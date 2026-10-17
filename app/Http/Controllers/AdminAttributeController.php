<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use App\Models\AttributeRequest;
use App\Models\AttributeValue;
use App\Models\CategoryAttribute;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminAttributeController extends Controller
{
    // ==========================================
    // 1. UNITS (একক) CRUD
    // ==========================================
    public function indexUnits(): JsonResponse
    {
        $units = Unit::orderBy('group')->orderBy('name_en')->get();
        $grouped = $units->groupBy('group');

        return response()->json([
            'success' => true,
            'units' => $units,
            'grouped' => $grouped,
        ]);
    }

    public function storeUnit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:100',
            'name_bn' => 'required|string|max:100',
            'short_code' => 'required|string|max:20|unique:units,short_code',
            'group' => 'required|in:weight,liquid,count,length',
        ]);

        $unit = Unit::create([
            ...$validated,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'নতুন ইউনিট সফলভাবে যোগ করা হয়েছে!',
            'unit' => $unit,
        ], 201);
    }

    public function updateUnit(Request $request, $id): JsonResponse
    {
        $unit = Unit::findOrFail($id);

        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:100',
            'name_bn' => 'sometimes|string|max:100',
            'short_code' => 'sometimes|string|max:20|unique:units,short_code,' . $id,
            'group' => 'sometimes|in:weight,liquid,count,length',
            'is_active' => 'sometimes|boolean',
        ]);

        $unit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'ইউনিট সফলভাবে আপডেট করা হয়েছে!',
            'unit' => $unit,
        ]);
    }

    public function destroyUnit($id): JsonResponse
    {
        $unit = Unit::findOrFail($id);
        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'ইউনিট সফলভাবে মুছে ফেলা হয়েছে!',
        ]);
    }

    // ==========================================
    // 2. ATTRIBUTES & VALUES CRUD
    // ==========================================
    public function indexAttributes(): JsonResponse
    {
        $attributes = Attribute::with(['values'])->orderBy('name_en')->get();

        return response()->json([
            'success' => true,
            'attributes' => $attributes,
        ]);
    }

    public function storeAttribute(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:100',
            'name_bn' => 'required|string|max:100',
            'code' => 'nullable|string|max:50|unique:attributes,code',
            'type' => 'required|in:button_group,color_swatch,select,text',
        ]);

        $code = !empty($validated['code']) 
            ? Str::slug($validated['code'], '_') 
            : Str::slug($validated['name_en'], '_');

        $attribute = Attribute::create([
            'name_en' => $validated['name_en'],
            'name_bn' => $validated['name_bn'],
            'code' => $code,
            'type' => $validated['type'],
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'নতুন অ্যাট্রিবিউট সফলভাবে তৈরি হয়েছে!',
            'attribute' => $attribute->load('values'),
        ], 201);
    }

    public function updateAttribute(Request $request, $id): JsonResponse
    {
        $attribute = Attribute::findOrFail($id);

        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:100',
            'name_bn' => 'sometimes|string|max:100',
            'type' => 'sometimes|in:button_group,color_swatch,select,text',
            'is_active' => 'sometimes|boolean',
        ]);

        $attribute->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'অ্যাট্রিবিউট সফলভাবে আপডেট হয়েছে!',
            'attribute' => $attribute->load('values'),
        ]);
    }

    public function destroyAttribute($id): JsonResponse
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return response()->json([
            'success' => true,
            'message' => 'অ্যাট্রিবিউট সফলভাবে মুছে ফেলা হয়েছে!',
        ]);
    }

    public function storeValue(Request $request, $attributeId): JsonResponse
    {
        $attribute = Attribute::findOrFail($attributeId);

        $validated = $request->validate([
            'name_en' => 'required|string|max:100',
            'name_bn' => 'required|string|max:100',
            'hex_color' => 'nullable|string|max:20',
        ]);

        $maxOrder = $attribute->values()->max('sort_order') ?? 0;

        $value = AttributeValue::create([
            'attribute_id' => $attribute->id,
            'name_en' => $validated['name_en'],
            'name_bn' => $validated['name_bn'],
            'hex_color' => $validated['hex_color'] ?? null,
            'sort_order' => $maxOrder + 1,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'নতুন মান সফলভাবে যোগ হয়েছে!',
            'value' => $value,
        ], 201);
    }

    public function updateValue(Request $request, $valueId): JsonResponse
    {
        $value = AttributeValue::findOrFail($valueId);

        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:100',
            'name_bn' => 'sometimes|string|max:100',
            'hex_color' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        $value->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'মান সফলভাবে আপডেট করা হয়েছে!',
            'value' => $value,
        ]);
    }

    public function destroyValue($valueId): JsonResponse
    {
        $value = AttributeValue::findOrFail($valueId);
        $value->delete();

        return response()->json([
            'success' => true,
            'message' => 'মান সফলভাবে মুছে ফেলা হয়েছে!',
        ]);
    }

    // ==========================================
    // 3. CATEGORY ATTRIBUTE MAPPING
    // ==========================================
    public function indexMappings(): JsonResponse
    {
        $mappings = CategoryAttribute::with('attribute.values')->get();

        return response()->json([
            'success' => true,
            'mappings' => $mappings,
        ]);
    }

    public function storeMapping(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|string',
            'attribute_ids' => 'required|array',
            'attribute_ids.*' => 'exists:attributes,id',
        ]);

        $categoryId = $validated['category_id'];
        $attributeIds = $validated['attribute_ids'];

        // Remove unselected mappings
        CategoryAttribute::where('category_id', $categoryId)
            ->whereNotIn('attribute_id', $attributeIds)
            ->delete();

        // Add or keep selected mappings
        foreach ($attributeIds as $attrId) {
            CategoryAttribute::firstOrCreate([
                'category_id' => $categoryId,
                'attribute_id' => $attrId,
            ], [
                'is_required' => true,
                'is_variation' => true,
            ]);
        }

        $updatedMappings = CategoryAttribute::where('category_id', $categoryId)
            ->with('attribute.values')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'ক্যাটাগরি-অ্যাট্রিবিউট ম্যাপিং সফলভাবে সংরক্ষিত হয়েছে!',
            'mappings' => $updatedMappings,
        ]);
    }

    // ==========================================
    // 4. VENDOR ATTRIBUTE / UNIT REQUESTS
    // ==========================================
    public function indexRequests(): JsonResponse
    {
        $requests = AttributeRequest::with('attribute')->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'requests' => $requests,
        ]);
    }

    public function storeRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vendor_name' => 'required|string|max:150',
            'request_type' => 'required|in:attribute,value,unit',
            'name_en' => 'required|string|max:150',
            'name_bn' => 'required|string|max:150',
            'attribute_id' => 'nullable|exists:attributes,id',
            'category_id' => 'nullable|string',
            'details' => 'nullable|string',
        ]);

        $newReq = AttributeRequest::create([
            ...$validated,
            'status' => 'Pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'আপনার অনুরোধটি সফলভাবে অ্যাডমিন প্যানেলে পাঠানো হয়েছে!',
            'request' => $newReq,
        ], 201);
    }

    public function updateRequestStatus(Request $request, $id): JsonResponse
    {
        $reqModel = AttributeRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected',
            'admin_note' => 'nullable|string',
        ]);

        $reqModel->status = $validated['status'];
        $reqModel->admin_note = $validated['admin_note'] ?? null;
        $reqModel->save();

        // If approved, dynamically create the entity!
        if ($validated['status'] === 'Approved') {
            if ($reqModel->request_type === 'unit') {
                Unit::firstOrCreate(
                    ['short_code' => Str::slug($reqModel->name_en)],
                    [
                        'name_en' => $reqModel->name_en,
                        'name_bn' => $reqModel->name_bn,
                        'group' => 'count',
                        'is_active' => true,
                    ]
                );
            } elseif ($reqModel->request_type === 'attribute') {
                $attr = Attribute::firstOrCreate(
                    ['code' => Str::slug($reqModel->name_en, '_')],
                    [
                        'name_en' => $reqModel->name_en,
                        'name_bn' => $reqModel->name_bn,
                        'type' => 'button_group',
                        'is_active' => true,
                    ]
                );

                if ($reqModel->category_id) {
                    CategoryAttribute::firstOrCreate([
                        'category_id' => $reqModel->category_id,
                        'attribute_id' => $attr->id,
                    ], [
                        'is_required' => true,
                        'is_variation' => true,
                    ]);
                }
            } elseif ($reqModel->request_type === 'value' && $reqModel->attribute_id) {
                AttributeValue::firstOrCreate(
                    [
                        'attribute_id' => $reqModel->attribute_id,
                        'name_en' => $reqModel->name_en,
                    ],
                    [
                        'name_bn' => $reqModel->name_bn,
                        'sort_order' => 99,
                        'is_active' => true,
                    ]
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => $validated['status'] === 'Approved' 
                ? 'অনুরোধটি অনুমোদন করা হয়েছে এবং নতুন মান সিস্টেমে যোগ করা হয়েছে!' 
                : 'অনুরোধটি কারণসহ বাতিল করা হয়েছে।',
            'request' => $reqModel->fresh(['attribute']),
        ]);
    }
}
