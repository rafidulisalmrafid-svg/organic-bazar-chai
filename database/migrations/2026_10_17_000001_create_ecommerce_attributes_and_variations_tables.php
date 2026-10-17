<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Units Table
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_bn');
            $table->string('short_code');
            $table->string('group'); // weight, liquid, count, length
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['group', 'is_active']);
        });

        // 2. Attributes Table
        Schema::create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_bn');
            $table->string('code')->unique(); // size_apparel, size_shoes, color, weight, volume, material, pack_type
            $table->string('type')->default('button_group'); // button_group, color_swatch, select, text
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Attribute Values Table
        Schema::create('attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->string('name_en');
            $table->string('name_bn');
            $table->string('hex_color')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['attribute_id', 'sort_order']);
        });

        // 4. Category Attributes Mapping Table
        Schema::create('category_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('category_id'); // e.g. cat-apparel, cat-fruits
            $table->foreignId('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->boolean('is_required')->default(false);
            $table->boolean('is_variation')->default(true);
            $table->timestamps();

            $table->unique(['category_id', 'attribute_id']);
        });

        // 5. Products Table (Structured for Chittagong Hill Tracts Marketplace)
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. sajek-honey-pineapple
            $table->string('name_en');
            $table->string('name_bn');
            $table->string('slug')->unique();
            $table->string('category_id');
            $table->string('subcategory')->nullable();
            $table->string('brand')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('product_type')->default('simple'); // 'simple' or 'variable'
            
            // Pricing & Stock
            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();
            $table->date('sale_start_date')->nullable();
            $table->date('sale_end_date')->nullable();
            $table->string('sku')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->integer('min_order_qty')->default(1);
            $table->integer('max_order_qty')->default(50);
            
            // Media
            $table->string('image')->nullable();
            $table->string('video_url')->nullable();
            
            // Shipping Details
            $table->decimal('weight_val', 8, 2)->nullable();
            $table->string('weight_unit')->default('kg');
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('height', 8, 2)->nullable();
            $table->string('delivery_time')->default('২-৩ দিন');
            $table->boolean('is_cod_available')->default(true);
            
            // Hill Specifics (Chittagong Hill Tracts)
            $table->string('district')->default('বান্দরবান'); // বান্দরবান, রাঙামাটি, খাগড়াছড়ি
            $table->string('community')->nullable(); // চাকমা, মারমা, ত্রিপুরা, বম, তঞ্চঙ্গ্যা, ম্রো, খুমি, ইত্যাদি
            $table->boolean('is_handmade')->default(false);
            $table->boolean('is_natural')->default(false);
            $table->boolean('is_organic')->default(false);
            
            // Food Specifics
            $table->boolean('is_food')->default(false);
            $table->date('production_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->text('storage_instructions')->nullable();
            
            // SEO & Extra
            $table->json('tags')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            
            // Status & Vendor
            $table->string('status')->default('Approved'); // 'Draft', 'Pending_Review', 'Approved', 'Rejected'
            $table->text('reject_reason')->nullable();
            $table->string('vendor_id')->nullable();
            $table->string('vendor_name')->default('Khagrachari Organics');
            $table->string('vendor_location')->default('খাগড়াছড়ি');
            $table->string('badge')->nullable();
            $table->decimal('rating', 3, 2)->default(5.0);
            $table->integer('reviews_count')->default(0);
            $table->json('specs')->nullable();
            
            $table->timestamps();

            $table->index(['category_id', 'status']);
            $table->index(['district', 'community']);
            $table->index('product_type');
        });

        // 6. Product Images Gallery & Color Linking
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('image_path');
            $table->foreignId('color_value_id')->nullable()->constrained('attribute_values')->nullOnDelete();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });

        // 7. Product Selected Attributes
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreignId('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->json('selected_values'); // Array of attribute_value IDs
            $table->timestamps();

            $table->unique(['product_id', 'attribute_id']);
        });

        // 8. Product Variations (Variable Product SKUs)
        Schema::create('product_variations', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['product_id', 'is_active']);
        });

        // 9. Variation Attribute Values (Linking variation to specific value)
        Schema::create('variation_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variation_id')->constrained('product_variations')->onDelete('cascade');
            $table->foreignId('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->foreignId('attribute_value_id')->constrained('attribute_values')->onDelete('cascade');
            $table->timestamps();

            $table->index(['variation_id', 'attribute_id'], 'vav_variation_attribute_idx');
        });

        // 10. Vendor Attribute / Unit Requests
        Schema::create('attribute_requests', function (Blueprint $table) {
            $table->id();
            $table->string('vendor_name');
            $table->string('vendor_id')->nullable();
            $table->string('request_type'); // 'attribute', 'value', 'unit'
            $table->string('name_en');
            $table->string('name_bn');
            $table->foreignId('attribute_id')->nullable()->constrained('attributes')->nullOnDelete();
            $table->string('category_id')->nullable();
            $table->text('details')->nullable();
            $table->string('status')->default('Pending'); // 'Pending', 'Approved', 'Rejected'
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_requests');
        Schema::dropIfExists('variation_attribute_values');
        Schema::dropIfExists('product_variations');
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('category_attributes');
        Schema::dropIfExists('attribute_values');
        Schema::dropIfExists('attributes');
        Schema::dropIfExists('units');
    }
};
