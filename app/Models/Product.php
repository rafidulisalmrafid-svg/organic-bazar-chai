<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name_en',
        'name_bn',
        'slug',
        'category_id',
        'subcategory',
        'brand',
        'short_description',
        'description',
        'product_type',
        'price',
        'old_price',
        'sale_start_date',
        'sale_end_date',
        'sku',
        'stock',
        'low_stock_threshold',
        'min_order_qty',
        'max_order_qty',
        'image',
        'video_url',
        'weight_val',
        'weight_unit',
        'length',
        'width',
        'height',
        'delivery_time',
        'is_cod_available',
        'district',
        'community',
        'is_handmade',
        'is_natural',
        'is_organic',
        'is_food',
        'production_date',
        'expiry_date',
        'storage_instructions',
        'tags',
        'seo_title',
        'seo_description',
        'status',
        'reject_reason',
        'vendor_id',
        'vendor_name',
        'vendor_location',
        'badge',
        'rating',
        'reviews_count',
        'specs',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'stock' => 'integer',
        'low_stock_threshold' => 'integer',
        'min_order_qty' => 'integer',
        'max_order_qty' => 'integer',
        'is_cod_available' => 'boolean',
        'is_handmade' => 'boolean',
        'is_natural' => 'boolean',
        'is_organic' => 'boolean',
        'is_food' => 'boolean',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'tags' => 'array',
        'specs' => 'array',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function productAttributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }
}
