<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use App\Models\VariationAttributeValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VendorProductController extends Controller
{
    /**
     * Store a new product from the 9-Step Wizard
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Step 1: Basic
            'name_en' => 'required|string|max:200',
            'name_bn' => 'required|string|max:200',
            'category_id' => 'required|string',
            'subcategory' => 'nullable|string',
            'brand' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',

            // Step 2: Media
            'image' => 'nullable|string',
            'video_url' => 'nullable|string',
            'gallery_images' => 'nullable|array',
            'gallery_images.*.image_path' => 'required|string',
            'gallery_images.*.color_value_id' => 'nullable|integer',

            // Step 3: Product Type
            'product_type' => 'required|in:simple,variable',

            // Step 4: Variations (if variable)
            'variations' => 'nullable|array',
            'selected_attributes' => 'nullable|array',

            // Step 5: Pricing & Stock (Simple product default or base)
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'sale_start_date' => 'nullable|date',
            'sale_end_date' => 'nullable|date',
            'sku' => 'nullable|string|max:100',
            'stock' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'min_order_qty' => 'nullable|integer|min:1',
            'max_order_qty' => 'nullable|integer|min:1',

            // Step 6: Shipping
            'weight_val' => 'nullable|numeric',
            'weight_unit' => 'nullable|string',
            'length' => 'nullable|numeric',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'delivery_time' => 'nullable|string',
            'is_cod_available' => 'nullable|boolean',

            // Step 7: Hill Specifics
            'district' => 'required|string',
            'community' => 'nullable|string',
            'is_handmade' => 'nullable|boolean',
            'is_natural' => 'nullable|boolean',
            'is_organic' => 'nullable|boolean',
            'is_food' => 'nullable|boolean',
            'production_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'storage_instructions' => 'nullable|string',

            // Step 8: SEO & Tags
            'tags' => 'nullable|array',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',

            // Step 9: Submit
            'status' => 'required|in:Draft,Pending_Review,Approved',
            'vendor_name' => 'nullable|string',
            'vendor_location' => 'nullable|string',
        ]);

        $productId = Str::slug($validated['name_en']) . '-' . Str::random(5);
        $slug = Str::slug($validated['name_en']) . '-' . Str::random(4);

        $product = Product::create([
            'id' => $productId,
            'name_en' => $validated['name_en'],
            'name_bn' => $validated['name_bn'],
            'slug' => $slug,
            'category_id' => $validated['category_id'],
            'subcategory' => $validated['subcategory'] ?? null,
            'brand' => $validated['brand'] ?? null,
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'product_type' => $validated['product_type'],
            'price' => $validated['price'],
            'old_price' => $validated['old_price'] ?? null,
            'sale_start_date' => $validated['sale_start_date'] ?? null,
            'sale_end_date' => $validated['sale_end_date'] ?? null,
            'sku' => $validated['sku'] ?? strtoupper(Str::random(8)),
            'stock' => $validated['stock'] ?? 10,
            'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
            'min_order_qty' => $validated['min_order_qty'] ?? 1,
            'max_order_qty' => $validated['max_order_qty'] ?? 50,
            'image' => $validated['image'] ?? '/images/hero.jpg',
            'video_url' => $validated['video_url'] ?? null,
            'weight_val' => $validated['weight_val'] ?? null,
            'weight_unit' => $validated['weight_unit'] ?? 'kg',
            'length' => $validated['length'] ?? null,
            'width' => $validated['width'] ?? null,
            'height' => $validated['height'] ?? null,
            'delivery_time' => $validated['delivery_time'] ?? '২-৩ দিন',
            'is_cod_available' => $validated['is_cod_available'] ?? true,
            'district' => $validated['district'],
            'community' => $validated['community'] ?? 'চাকমা',
            'is_handmade' => $validated['is_handmade'] ?? false,
            'is_natural' => $validated['is_natural'] ?? false,
            'is_organic' => $validated['is_organic'] ?? false,
            'is_food' => $validated['is_food'] ?? false,
            'production_date' => $validated['production_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'storage_instructions' => $validated['storage_instructions'] ?? null,
            'tags' => $validated['tags'] ?? [],
            'seo_title' => $validated['seo_title'] ?? $validated['name_bn'],
            'seo_description' => $validated['seo_description'] ?? null,
            'status' => $validated['status'],
            'vendor_name' => $validated['vendor_name'] ?? 'Rangamati Weaves',
            'vendor_location' => $validated['vendor_location'] ?? 'রাঙ্গামাটি',
            'rating' => 5.0,
            'reviews_count' => 0,
        ]);

        // Save Gallery Images
        if (!empty($validated['gallery_images'])) {
            foreach ($validated['gallery_images'] as $idx => $img) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $img['image_path'],
                    'color_value_id' => $img['color_value_id'] ?? null,
                    'sort_order' => $idx + 1,
                    'is_primary' => $idx === 0,
                ]);
            }
        } else {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $product->image,
                'sort_order' => 1,
                'is_primary' => true,
            ]);
        }

        // Save Selected Attributes
        if (!empty($validated['selected_attributes'])) {
            foreach ($validated['selected_attributes'] as $attrId => $values) {
                ProductAttribute::create([
                    'product_id' => $product->id,
                    'attribute_id' => $attrId,
                    'selected_values' => $values,
                ]);
            }
        }

        // Save Variations (If Variable Product)
        if ($validated['product_type'] === 'variable' && !empty($validated['variations'])) {
            $totalStock = 0;
            foreach ($validated['variations'] as $v) {
                if (!isset($v['is_active']) || $v['is_active']) {
                    $totalStock += (int)($v['stock'] ?? 0);
                }

                $variation = ProductVariation::create([
                    'product_id' => $product->id,
                    'sku' => $v['sku'] ?? ($product->sku . '-' . Str::random(4)),
                    'price' => $v['price'] ?? $product->price,
                    'sale_price' => $v['sale_price'] ?? null,
                    'stock' => $v['stock'] ?? 0,
                    'image_url' => $v['image_url'] ?? $product->image,
                    'is_active' => $v['is_active'] ?? true,
                ]);

                // Link to attribute value IDs
                if (!empty($v['attribute_values'])) {
                    foreach ($v['attribute_values'] as $attrId => $valId) {
                        VariationAttributeValue::create([
                            'variation_id' => $variation->id,
                            'attribute_id' => $attrId,
                            'attribute_value_id' => $valId,
                        ]);
                    }
                }
            }
            $product->update(['stock' => $totalStock]);
        }

        return response()->json([
            'success' => true,
            'message' => $product->status === 'Draft' 
                ? 'পণ্যটি ড্রাফট হিসেবে সংরক্ষিত হয়েছে!' 
                : 'পণ্যটি সফলভাবে সাবমিট হয়েছে এবং অনুমোদনের অপেক্ষায় আছে!',
            'product' => $product->load(['images', 'variations.attributeValues.attributeValue']),
        ], 201);
    }

    /**
     * Inline quick edit for price and stock from the product table
     */
    public function quickUpdate(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:Draft,Pending_Review,Approved,Rejected',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'পণ্যের তথ্য সফলভাবে আপডেট হয়েছে!',
            'product' => $product,
        ]);
    }

    /**
     * Duplicate an existing product
     */
    public function duplicate($id): JsonResponse
    {
        $original = Product::with(['images', 'productAttributes', 'variations.attributeValues'])->findOrFail($id);

        $newId = $original->id . '-copy-' . Str::random(4);
        $newSku = ($original->sku ? $original->sku : 'SKU') . '-CPY';

        $clone = $original->replicate([
            'id', 'slug', 'created_at', 'updated_at'
        ]);
        $clone->id = $newId;
        $clone->name_en = $original->name_en . ' (Copy)';
        $clone->name_bn = $original->name_bn . ' (অনুলিপি)';
        $clone->slug = Str::slug($clone->name_en) . '-' . Str::random(4);
        $clone->sku = $newSku;
        $clone->status = 'Draft';
        $clone->save();

        // Copy images
        foreach ($original->images as $img) {
            $newImg = $img->replicate(['id', 'product_id', 'created_at', 'updated_at']);
            $newImg->product_id = $clone->id;
            $newImg->save();
        }

        // Copy attributes
        foreach ($original->productAttributes as $attr) {
            $newAttr = $attr->replicate(['id', 'product_id', 'created_at', 'updated_at']);
            $newAttr->product_id = $clone->id;
            $newAttr->save();
        }

        // Copy variations
        foreach ($original->variations as $var) {
            $newVar = $var->replicate(['id', 'product_id', 'sku', 'created_at', 'updated_at']);
            $newVar->product_id = $clone->id;
            $newVar->sku = $var->sku . '-CPY-' . Str::random(3);
            $newVar->save();

            foreach ($var->attributeValues as $vav) {
                VariationAttributeValue::create([
                    'variation_id' => $newVar->id,
                    'attribute_id' => $vav->attribute_id,
                    'attribute_value_id' => $vav->attribute_value_id,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'পণ্যটি সফলভাবে ডুপ্লিকেট করা হয়েছে!',
            'product' => $clone->fresh(['images', 'variations.attributeValues.attributeValue']),
        ]);
    }

    /**
     * Delete product
     */
    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'পণ্যটি সফলভাবে মুছে ফেলা হয়েছে!',
        ]);
    }

    /**
     * Download sample CSV template for bulk upload
     */
    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="paharika_products_template.csv"',
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            
            // UTF-8 BOM for Excel Bengali character rendering
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Header row
            fputcsv($handle, [
                'Name_EN',
                'Name_BN',
                'Category_ID',
                'Subcategory',
                'Product_Type (simple/variable)',
                'Price',
                'Old_Price',
                'Stock',
                'SKU',
                'District (বান্দরবান/রাঙামাটি/খাগড়াছড়ি)',
                'Community (চাকমা/মারমা/ত্রিপুরা/বম)',
                'Is_Handmade (1/0)',
                'Is_Organic (1/0)',
                'Description'
            ]);

            // Sample rows
            fputcsv($handle, [
                'Handwoven Chakma Gamcha',
                'চাকমা সুতি গামছা',
                'cat-apparel',
                'শাল ও চাদর',
                'simple',
                '450',
                '500',
                '25',
                'TEX-GAM-01',
                'রাঙ্গামাটি',
                'চাকমা',
                '1',
                '0',
                'ঐতিহ্যবাহী তাঁতে বোনা সুতি গামছা।'
            ]);

            fputcsv($handle, [
                'Organic Forest Wild Honey 250g',
                'খাঁটি বুনো পাহাড়ি মধু ২৫০ গ্রাম',
                'cat-honey',
                'বন্য মধু',
                'simple',
                '450',
                '520',
                '30',
                'KO-HON-250',
                'বান্দরবান',
                'ম্রো',
                '0',
                '1',
                'সাজেক অরণ্য থেকে সংগৃহীত খাঁটি মধু।'
            ]);

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Bulk upload products from CSV
     */
    public function bulkUpload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);

        $file = $request->file('file');
        $csvData = file_get_contents($file->getRealPath());
        $lines = explode(PHP_EOL, $csvData);

        $insertedCount = 0;
        $header = null;

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            $row = str_getcsv($line);
            if (!$header) {
                $header = $row;
                continue;
            }

            if (count($row) < 6) continue;

            $nameEn = $row[0] ?? 'Hill Product';
            $nameBn = $row[1] ?? $nameEn;
            $catId = $row[2] ?? 'cat-fruits';
            $subcat = $row[3] ?? null;
            $pType = in_array(strtolower($row[4] ?? ''), ['simple', 'variable']) ? strtolower($row[4]) : 'simple';
            $price = floatval($row[5] ?? 100);
            $oldPrice = !empty($row[6]) ? floatval($row[6]) : null;
            $stock = intval($row[7] ?? 10);
            $sku = !empty($row[8]) ? $row[8] : ('BULK-' . strtoupper(Str::random(6)));
            $district = $row[9] ?? 'বান্দরবান';
            $community = $row[10] ?? 'চাকমা';
            $isHandmade = !empty($row[11]) && $row[11] == '1';
            $isOrganic = !empty($row[12]) && $row[12] == '1';
            $desc = $row[13] ?? 'Chittagong Hill Tracts authentic product.';

            $productId = Str::slug($nameEn) . '-' . Str::random(4);

            Product::create([
                'id' => $productId,
                'name_en' => $nameEn,
                'name_bn' => $nameBn,
                'slug' => Str::slug($nameEn) . '-' . Str::random(4),
                'category_id' => $catId,
                'subcategory' => $subcat,
                'product_type' => $pType,
                'price' => $price,
                'old_price' => $oldPrice,
                'stock' => $stock,
                'sku' => $sku,
                'district' => $district,
                'community' => $community,
                'is_handmade' => $isHandmade,
                'is_organic' => $isOrganic,
                'description' => $desc,
                'image' => '/images/hero.jpg',
                'status' => 'Pending_Review',
                'vendor_name' => 'Rangamati Weaves',
                'vendor_location' => $district,
                'rating' => 5.0,
                'reviews_count' => 0,
            ]);

            $insertedCount++;
        }

        return response()->json([
            'success' => true,
            'message' => "সফলভাবে {$insertedCount}টি পণ্য বাল্ক আপলোড করা হয়েছে এবং রিভিউয়ের জন্য জমা দেওয়া হয়েছে!",
            'count' => $insertedCount,
        ]);
    }
}
