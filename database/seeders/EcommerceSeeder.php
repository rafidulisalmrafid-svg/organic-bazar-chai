<?php

namespace Database\Seeders;

use App\Http\Controllers\ProductController;
use App\Models\Attribute;
use App\Models\AttributeRequest;
use App\Models\AttributeValue;
use App\Models\CategoryAttribute;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use App\Models\Unit;
use App\Models\VariationAttributeValue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ==========================================
        // 1. SEED UNITS (একক)
        // ==========================================
        $unitsData = [
            // ওজন (Weight)
            ['name_en' => 'Gram', 'name_bn' => 'গ্রাম', 'short_code' => 'g', 'group' => 'weight'],
            ['name_en' => 'Kilogram', 'name_bn' => 'কেজি', 'short_code' => 'kg', 'group' => 'weight'],

            // তরল (Liquid)
            ['name_en' => 'Milliliter', 'name_bn' => 'মিলি', 'short_code' => 'ml', 'group' => 'liquid'],
            ['name_en' => 'Liter', 'name_bn' => 'লিটার', 'short_code' => 'L', 'group' => 'liquid'],

            // গণনা (Count)
            ['name_en' => 'Piece', 'name_bn' => 'পিস', 'short_code' => 'pc', 'group' => 'count'],
            ['name_en' => 'Dozen', 'name_bn' => 'ডজন', 'short_code' => 'dz', 'group' => 'count'],
            ['name_en' => 'Hali (4 Pcs)', 'name_bn' => 'হালি (৪ পিস)', 'short_code' => 'hali', 'group' => 'count'],
            ['name_en' => 'Pair', 'name_bn' => 'জোড়া', 'short_code' => 'pair', 'group' => 'count'],
            ['name_en' => 'Set', 'name_bn' => 'সেট', 'short_code' => 'set', 'group' => 'count'],
            ['name_en' => 'Packet', 'name_bn' => 'প্যাকেট', 'short_code' => 'pkt', 'group' => 'count'],
            ['name_en' => 'Box', 'name_bn' => 'বক্স', 'short_code' => 'box', 'group' => 'count'],
            ['name_en' => 'Bottle', 'name_bn' => 'বোতল', 'short_code' => 'btl', 'group' => 'count'],
            ['name_en' => 'Jar', 'name_bn' => 'জার', 'short_code' => 'jar', 'group' => 'count'],

            // দৈর্ঘ্য (Length)
            ['name_en' => 'Inch', 'name_bn' => 'ইঞ্চি', 'short_code' => 'in', 'group' => 'length'],
            ['name_en' => 'Foot', 'name_bn' => 'ফুট', 'short_code' => 'ft', 'group' => 'length'],
            ['name_en' => 'Meter', 'name_bn' => 'মিটার', 'short_code' => 'm', 'group' => 'length'],
            ['name_en' => 'Yard', 'name_bn' => 'গজ', 'short_code' => 'yd', 'group' => 'length'],
        ];

        foreach ($unitsData as $u) {
            Unit::updateOrCreate(
                ['short_code' => $u['short_code']],
                $u
            );
        }

        // ==========================================
        // 2. SEED ATTRIBUTES & VALUES
        // ==========================================
        $attributesData = [
            [
                'name_en' => 'Size (Apparel)',
                'name_bn' => 'সাইজ (পোশাক)',
                'code' => 'size_apparel',
                'type' => 'button_group',
                'values' => [
                    ['name_en' => 'XS', 'name_bn' => 'XS', 'hex_color' => null],
                    ['name_en' => 'S', 'name_bn' => 'S', 'hex_color' => null],
                    ['name_en' => 'M', 'name_bn' => 'M', 'hex_color' => null],
                    ['name_en' => 'L', 'name_bn' => 'L', 'hex_color' => null],
                    ['name_en' => 'XL', 'name_bn' => 'XL', 'hex_color' => null],
                    ['name_en' => 'XXL', 'name_bn' => 'XXL', 'hex_color' => null],
                    ['name_en' => 'XXXL', 'name_bn' => 'XXXL', 'hex_color' => null],
                    ['name_en' => 'Free Size', 'name_bn' => 'ফ্রি সাইজ', 'hex_color' => null],
                ],
            ],
            [
                'name_en' => 'Size (Shoes)',
                'name_bn' => 'সাইজ (জুতা)',
                'code' => 'size_shoes',
                'type' => 'button_group',
                'values' => [
                    ['name_en' => '38', 'name_bn' => '৩৮', 'hex_color' => null],
                    ['name_en' => '39', 'name_bn' => '৩৯', 'hex_color' => null],
                    ['name_en' => '40', 'name_bn' => '৪০', 'hex_color' => null],
                    ['name_en' => '41', 'name_bn' => '৪১', 'hex_color' => null],
                    ['name_en' => '42', 'name_bn' => '৪২', 'hex_color' => null],
                    ['name_en' => '43', 'name_bn' => '৪৩', 'hex_color' => null],
                    ['name_en' => '44', 'name_bn' => '৪৪', 'hex_color' => null],
                ],
            ],
            [
                'name_en' => 'Color',
                'name_bn' => 'রং',
                'code' => 'color',
                'type' => 'color_swatch',
                'values' => [
                    ['name_en' => 'Red', 'name_bn' => 'লাল', 'hex_color' => '#E53E3E'],
                    ['name_en' => 'Navy Blue', 'name_bn' => 'গাঢ় নীল', 'hex_color' => '#1A365D'],
                    ['name_en' => 'Black', 'name_bn' => 'কালো', 'hex_color' => '#1A202C'],
                    ['name_en' => 'White', 'name_bn' => 'সাদা', 'hex_color' => '#F7FAFC'],
                    ['name_en' => 'Forest Green', 'name_bn' => 'সবুজ', 'hex_color' => '#276749'],
                    ['name_en' => 'Mustard Yellow', 'name_bn' => 'হলুদ', 'hex_color' => '#D69E2E'],
                    ['name_en' => 'Terracotta', 'name_bn' => 'টেরাকোটা / মাটি রং', 'hex_color' => '#C85A32'],
                    ['name_en' => 'Maroon', 'name_bn' => 'মেরুন', 'hex_color' => '#7B1113'],
                ],
            ],
            [
                'name_en' => 'Weight / Quantity',
                'name_bn' => 'ওজন / পরিমাণ',
                'code' => 'weight',
                'type' => 'button_group',
                'values' => [
                    ['name_en' => '100g', 'name_bn' => '১০০ গ্রাম', 'hex_color' => null],
                    ['name_en' => '250g', 'name_bn' => '২৫০ গ্রাম', 'hex_color' => null],
                    ['name_en' => '500g', 'name_bn' => '৫০০ গ্রাম', 'hex_color' => null],
                    ['name_en' => '1kg', 'name_bn' => '১ কেজি', 'hex_color' => null],
                    ['name_en' => '2kg', 'name_bn' => '২ কেজি', 'hex_color' => null],
                    ['name_en' => '5kg', 'name_bn' => '৫ কেজি', 'hex_color' => null],
                ],
            ],
            [
                'name_en' => 'Volume',
                'name_bn' => 'আয়তন',
                'code' => 'volume',
                'type' => 'button_group',
                'values' => [
                    ['name_en' => '100ml', 'name_bn' => '১০০ মিলি', 'hex_color' => null],
                    ['name_en' => '200ml', 'name_bn' => '২০০ মিলি', 'hex_color' => null],
                    ['name_en' => '250ml', 'name_bn' => '২৫০ মিলি', 'hex_color' => null],
                    ['name_en' => '500ml', 'name_bn' => '৫০০ মিলি', 'hex_color' => null],
                    ['name_en' => '1L', 'name_bn' => '১ লিটার', 'hex_color' => null],
                ],
            ],
            [
                'name_en' => 'Material',
                'name_bn' => 'উপাদান / ম্যাটেরিয়াল',
                'code' => 'material',
                'type' => 'select',
                'values' => [
                    ['name_en' => 'Organic Cotton', 'name_bn' => 'তুলা (অর্গানিক পাহাড়ি তুলা)', 'hex_color' => null],
                    ['name_en' => 'Silk', 'name_bn' => 'সিল্ক', 'hex_color' => null],
                    ['name_en' => 'Bamboo', 'name_bn' => 'পাহাড়ি বাঁশ', 'hex_color' => null],
                    ['name_en' => 'Cane', 'name_bn' => 'বেত', 'hex_color' => null],
                    ['name_en' => 'Teak Wood', 'name_bn' => 'পাহাড়ি কাঠ / সেগুন', 'hex_color' => null],
                    ['name_en' => 'Tribal Silver', 'name_bn' => 'খাঁটি পাহাড়ি রূপা', 'hex_color' => null],
                    ['name_en' => 'Terracotta Clay', 'name_bn' => 'সাঙ্গু নদীর মাটি', 'hex_color' => null],
                ],
            ],
            [
                'name_en' => 'Pack Type',
                'name_bn' => 'প্যাকের ধরন',
                'code' => 'pack_type',
                'type' => 'select',
                'values' => [
                    ['name_en' => 'Glass Jar', 'name_bn' => 'কাঁচের জার', 'hex_color' => null],
                    ['name_en' => 'Bottle', 'name_bn' => 'বোতল', 'hex_color' => null],
                    ['name_en' => 'Eco Kraft Pouch', 'name_bn' => 'ইকো ক্রাফট পাউচ / প্যাকেট', 'hex_color' => null],
                    ['name_en' => 'Wooden Gift Box', 'name_bn' => 'কাঠের কারুকাজ গিফট বক্স', 'hex_color' => null],
                ],
            ],
        ];

        $attributeModels = [];
        foreach ($attributesData as $attr) {
            $model = Attribute::updateOrCreate(
                ['code' => $attr['code']],
                [
                    'name_en' => $attr['name_en'],
                    'name_bn' => $attr['name_bn'],
                    'type' => $attr['type'],
                    'is_active' => true,
                ]
            );
            $attributeModels[$attr['code']] = $model;

            foreach ($attr['values'] as $idx => $val) {
                AttributeValue::updateOrCreate(
                    [
                        'attribute_id' => $model->id,
                        'name_en' => $val['name_en'],
                    ],
                    [
                        'name_bn' => $val['name_bn'],
                        'hex_color' => $val['hex_color'],
                        'sort_order' => $idx + 1,
                        'is_active' => true,
                    ]
                );
            }
        }

        // ==========================================
        // 3. SEED CATEGORY ATTRIBUTE MAPPING
        // ==========================================
        // Rules from user:
        // - ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র (cat-apparel): Size, Color, Material
        // - মধু ও মৌচাকজাত পণ্য (cat-honey): Weight, Volume, Pack Type
        // - ফল (cat-fruits), মসলা (cat-spices), শুঁটকি ও খাদ্য (cat-food): Weight
        // - গহনা ও অলংকার (cat-jewelry): Material, Size, Color
        // - হস্তশিল্প (cat-craft): Size, Color, Material
        // - চা ও কফি (cat-tea): Weight, Pack Type
        // - ভেষজ ও প্রাকৃতিক পণ্য (cat-herbal): Volume, Weight
        // - উপহার ও গিফট প্যাক (cat-gifts): Pack Type, Material
        $mappings = [
            'cat-apparel' => ['size_apparel', 'color', 'material'],
            'cat-honey' => ['weight', 'volume', 'pack_type'],
            'cat-fruits' => ['weight'],
            'cat-spices' => ['weight'],
            'cat-food' => ['weight'],
            'cat-jewelry' => ['material', 'color', 'size_apparel'],
            'cat-craft' => ['size_apparel', 'color', 'material'],
            'cat-tea' => ['weight', 'pack_type'],
            'cat-herbal' => ['volume', 'weight'],
            'cat-gifts' => ['pack_type', 'material'],
        ];

        foreach ($mappings as $catId => $attrCodes) {
            foreach ($attrCodes as $code) {
                if (isset($attributeModels[$code])) {
                    CategoryAttribute::updateOrCreate(
                        [
                            'category_id' => $catId,
                            'attribute_id' => $attributeModels[$code]->id,
                        ],
                        [
                            'is_required' => true,
                            'is_variation' => true,
                        ]
                    );
                }
            }
        }

        // ==========================================
        // 4. MIGRATE EXISTING PRODUCTS AS SIMPLE & DEMO VARIABLE PRODUCTS
        // ==========================================
        $existingProducts = [
            [
                'id' => 'sajek-honey-pineapple',
                'name_en' => 'Sajek Honey Pineapple',
                'name_bn' => 'সাজেক পাহাড়ি মধু আনারস',
                'category_id' => 'cat-fruits',
                'subcategory' => 'আনারস',
                'price' => 120,
                'old_price' => 150,
                'stock' => 60,
                'sku' => 'FRT-PA-01',
                'image' => '/images/prod-pineapple.jpg',
                'district' => 'রাঙ্গামাটি',
                'community' => 'চাকমা',
                'is_organic' => true,
                'is_natural' => true,
                'is_food' => true,
                'production_date' => '2026-10-10',
                'expiry_date' => '2026-10-25',
                'storage_instructions' => 'স্বাভাবিক তাপমাত্রায় বা হালকা ঠাণ্ডা স্থানে সংরক্ষণ করুন।',
                'vendor_name' => 'Khagrachari Organics',
                'vendor_location' => 'সাজেক, রাঙ্গামাটি',
                'description' => 'সাজেক ভ্যালির পাহাড়ি ঢালে সম্পূর্ণ রাসায়নিক ও ফরমালিন ছাড়া প্রাকৃতিকভাবে পাকা তীব্র মিষ্টি ও রসালো খাঁটি পাহাড়ি মধু আনারস।',
            ],
            [
                'id' => 'bandarban-sweet-orange',
                'name_en' => 'Bandarban Hill Orange & Malta',
                'name_bn' => 'পাহাড়ি মিষ্টি কমলা ও মাল্টা',
                'category_id' => 'cat-fruits',
                'subcategory' => 'কমলা / মাল্টা',
                'price' => 350,
                'old_price' => 420,
                'stock' => 45,
                'sku' => 'FRT-OR-02',
                'image' => '/images/prod-orange.jpg',
                'district' => 'বান্দরবান',
                'community' => 'মারমা',
                'is_organic' => true,
                'is_food' => true,
                'vendor_name' => 'Mawrum Green Orchard',
                'vendor_location' => 'রুমা, বান্দরবান',
                'description' => 'বান্দরবানের রুমা ও চিম্বুক পাহাড়ের উঁচু ঢালে আদিবাসী জুমচাষীদের ফলানো অত্যন্ত রসালো পাহাড়ি মিষ্টি কমলা ও সবুজ মাল্টা।',
            ],
            [
                'id' => 'wild-forest-honey',
                'name_en' => 'Wild Forest Honey',
                'name_bn' => 'কেওক্রাডং বন্য কাঁচা মধু',
                'category_id' => 'cat-honey',
                'subcategory' => 'বন্য মধু',
                'price' => 890,
                'old_price' => 1050,
                'stock' => 50,
                'sku' => 'KO-HONEY-03',
                'image' => '/images/prod-honey.jpg',
                'district' => 'বান্দরবান',
                'community' => 'ম্রো',
                'is_organic' => true,
                'is_natural' => true,
                'is_food' => true,
                'vendor_name' => 'Khagrachari Organics',
                'vendor_location' => 'কেওক্রাডং, বান্দরবান',
                'description' => 'কেওক্রাডং ও সাজেকের গভীর ক্যানোপি অরণ্যের বুনো মৌচাক থেকে আদিবাসী মৌয়ালদের সংগৃহীত কাঁচা, অপরিশোধিত খাঁটি পাহাড়ি মধু।',
            ],
            [
                'id' => 'pure-hill-beeswax',
                'name_en' => 'Natural Hill Beeswax Block',
                'name_bn' => 'খাঁটি পাহাড়ি মৌচাকের মোম',
                'category_id' => 'cat-honey',
                'subcategory' => 'মোম',
                'price' => 320,
                'old_price' => 380,
                'stock' => 30,
                'sku' => 'KO-WAX-04',
                'image' => '/images/prod-honey.jpg',
                'district' => 'বান্দরবান',
                'community' => 'বম',
                'is_natural' => true,
                'vendor_name' => 'Khagrachari Organics',
                'vendor_location' => 'বান্দরবান',
                'description' => 'প্রাকৃতিক পাহাড়ি মৌচাকের মধু সংগ্রহের পর ফিল্টার করা খাঁটি ও প্রাকৃতিক সুবাসযুক্ত মৌচাকের মোম। স্কিনকেয়ার ও মোমবাতির জন্য উপযোগী।',
            ],
            [
                'id' => 'spicy-bamboo-shoot-pickle',
                'name_en' => 'Spicy Hill Bamboo Shoot Pickle',
                'name_bn' => 'পাহাড়ি বাঁশ কোড়ল আচার',
                'category_id' => 'cat-food',
                'subcategory' => 'বাঁশ কোড়ল ও আচার',
                'price' => 380,
                'old_price' => 450,
                'stock' => 40,
                'sku' => 'FOOD-BS-01',
                'image' => '/images/prod-bamboo-shoot.jpg',
                'district' => 'রাঙ্গামাটি',
                'community' => 'মারমা',
                'is_handmade' => true,
                'is_food' => true,
                'vendor_name' => 'Hillside Gourmet',
                'vendor_location' => 'রাঙ্গামাটি',
                'description' => 'পাহাড়ের কচি তাজা বাঁশের কোঁড়ল (মেওয়া) দিয়ে মারমা পরিবারের ঐতিহ্যবাহী মশলায় তৈরি জিভে জল আনা সুস্বাদু পাহাড়ি আচার।',
            ],
            [
                'id' => 'jhum-red-rice',
                'name_en' => 'Organic Jhum Red Rice',
                'name_bn' => 'পাহাড়ি জুমের লাল চাল',
                'category_id' => 'cat-food',
                'subcategory' => 'জুমের চাল',
                'price' => 280,
                'old_price' => 320,
                'stock' => 65,
                'sku' => 'FOOD-JR-02',
                'image' => '/images/prod-jhum-rice.jpg',
                'district' => 'বান্দরবান',
                'community' => 'ত্রিপুরা',
                'is_organic' => true,
                'is_food' => true,
                'vendor_name' => 'Mawrum Indigenous Group',
                'vendor_location' => 'বান্দরবান',
                'description' => 'পাহাড়ের চূড়ায় বৃষ্টির জলে প্রাকৃতিকভাবে উৎপন্ন আদিবাসী জুমের পুষ্টিকর লাল চাল। আয়রন, ফাইবার ও খনিজে ভরপুর।',
            ],
            [
                'id' => 'handwoven-bamboo-tote',
                'name_en' => 'Handwoven Bamboo Craft Tote',
                'name_bn' => 'হাতে বোনা পাহাড়ি বাঁশের টোট ব্যাগ',
                'category_id' => 'cat-craft',
                'subcategory' => 'বাঁশের তৈরি পণ্য',
                'price' => 1680,
                'old_price' => 1950,
                'stock' => 24,
                'sku' => 'BC-TOTE-02',
                'image' => '/images/prod-bag.jpg',
                'district' => 'বান্দরবান',
                'community' => 'মারমা',
                'is_handmade' => true,
                'is_natural' => true,
                'vendor_name' => 'Bandarban Cane Craft',
                'vendor_location' => 'বান্দরবান',
                'description' => 'বান্দরবানের পাহাড়ি বাঁশের শক্ত বেত ও চামড়ার বেল্ট দিয়ে হাতে বোনা আধুনিক ও নান্দনিক ক্রাফট টোট ব্যাগ।',
            ],
            [
                'id' => 'terracotta-carved-vase',
                'name_en' => 'Terracotta Carved Tribal Vase',
                'name_bn' => 'সাঙ্গু নদীর মাটির কারুকাজ করা ফুলদানি',
                'category_id' => 'cat-craft',
                'subcategory' => 'মাটি ও সিরামিক',
                'price' => 1250,
                'old_price' => 1450,
                'stock' => 14,
                'sku' => 'MC-VASE-04',
                'image' => '/images/prod-vase.jpg',
                'district' => 'বান্দরবান',
                'community' => 'মারমা',
                'is_handmade' => true,
                'vendor_name' => 'Marma Clay Studio',
                'vendor_location' => 'বান্দরবান',
                'description' => 'সাঙ্গু নদীর পলিমাটি দিয়ে চাকায় তৈরি এবং পাহাড়ি কাঠের চুলায় পোড়ানো ঐতিহ্যবাহী মাটির শোপিস ফুলদানি।',
            ],
            [
                'id' => 'chakma-pinon-hadi',
                'name_en' => 'Chakma Handwoven Pinon & Hadi',
                'name_bn' => 'চাকমা কোমর তাঁতে বোনা পিনন-হাদি',
                'category_id' => 'cat-apparel',
                'subcategory' => 'নারীদের পোশাক',
                'price' => 4800,
                'old_price' => 5500,
                'stock' => 12,
                'sku' => 'TEX-PINON-01',
                'image' => '/images/prod-pinon.jpg',
                'district' => 'রাঙ্গামাটি',
                'community' => 'চাকমা',
                'is_handmade' => true,
                'is_natural' => true,
                'vendor_name' => 'Rangamati Weaves',
                'vendor_location' => 'রাঙ্গামাটি',
                'description' => 'চাকমা নারীদের ঐতিহ্যবাহী কোমর তাঁতে (বাইন) বোনা এক্সক্লুসিভ পিনন এবং হাদি। নিখুঁত চাবুকি ও আলমের জ্যামিতিক নকশায় অলংকৃত।',
            ],
            [
                'id' => 'chakma-heritage-shawl',
                'name_en' => 'Chakma Heritage Shawl',
                'name_bn' => 'ঐতিহ্যবাহী পাহাড়ি শাল ও চাদর',
                'category_id' => 'cat-apparel',
                'subcategory' => 'শাল ও চাদর',
                'price' => 2450,
                'old_price' => 2900,
                'stock' => 18,
                'sku' => 'RW-SHAWL-01',
                'image' => '/images/prod-shawl.jpg',
                'district' => 'রাঙ্গামাটি',
                'community' => 'চাকমা',
                'is_handmade' => true,
                'vendor_name' => 'Rangamati Weaves',
                'vendor_location' => 'রাঙ্গামাটি',
                'description' => 'শীত ও বসন্তের উপযোগী উষ্ণ ও আরামদায়ক পাহাড়ি চাদর। শতাব্দী প্রাচীন পাহাড়ি জ্যামিতিক নকশায় বোনা।',
            ],
            [
                'id' => 'tribal-silver-hasuli',
                'name_en' => 'Traditional Tribal Silver Hasuli',
                'name_bn' => 'খাঁটি রূপার পাহাড়ি হাসুলি নেকলেস ও দুল',
                'category_id' => 'cat-jewelry',
                'subcategory' => 'রুপার গহনা',
                'price' => 7500,
                'old_price' => 8600,
                'stock' => 8,
                'sku' => 'JWL-HASULI-01',
                'image' => '/images/prod-silver.jpg',
                'district' => 'রাঙ্গামাটি',
                'community' => 'চাকমা',
                'is_handmade' => true,
                'vendor_name' => 'Rangamati Weaves',
                'vendor_location' => 'রাঙ্গামাটি',
                'description' => 'চাকমা ও মারমা ঐতিহ্যবাহী রূপার কারিগরদের হাতে খোদাই করা খাঁটি রূপার হাসুলি গলার হার ও ম্যাচিং কানের দুল।',
            ],
            [
                'id' => 'bandarban-arabica-coffee',
                'name_en' => 'Bandarban Highland Roasted Arabica Coffee',
                'name_bn' => 'বান্দরবান অ্যারাবিকা রোস্টেড কফি',
                'category_id' => 'cat-tea',
                'subcategory' => 'পাহাড়ি কফি',
                'price' => 750,
                'old_price' => 880,
                'stock' => 35,
                'sku' => 'COF-BAND-01',
                'image' => '/images/prod-coffee.jpg',
                'district' => 'বান্দরবান',
                'community' => 'বম',
                'is_organic' => true,
                'is_food' => true,
                'vendor_name' => 'Bandarban Hills Coffee',
                'vendor_location' => 'বান্দরবান',
                'description' => 'বান্দরবানের ২,২০০ ফুট উঁচুতে ম্রো ও বম চাষীদের ফলানো সিঙ্গেল-অরিজিন প্রিমিয়াম অ্যারাবিকা হোল বিন রোস্টেড কফি।',
            ],
            [
                'id' => 'khagrachari-leaf-tea',
                'name_en' => 'Artisanal Hill Green & Black Leaf Tea',
                'name_bn' => 'পাহাড়ি অর্গানিক হোল লিফ চা',
                'category_id' => 'cat-tea',
                'subcategory' => 'পাহাড়ি চা',
                'price' => 640,
                'old_price' => 720,
                'stock' => 45,
                'sku' => 'KO-TEA-06',
                'image' => '/images/prod-tea.jpg',
                'district' => 'খাগড়াছড়ি',
                'community' => 'ত্রিপুরা',
                'is_organic' => true,
                'is_food' => true,
                'vendor_name' => 'Khagrachari Organics',
                'vendor_location' => 'খাগড়াছড়ি',
                'description' => 'কুয়াশাচ্ছন্ন পাহাড়ি বাগানের কোমল দুটি পাতা একটি কুঁড়ি দিয়ে হাতে তৈরি বিশুদ্ধ পাহাড়ি গোটা পাতার ব্ল্যাক ও গ্রিন টি।',
            ],
            [
                'id' => 'forest-herbal-hair-body-oil',
                'name_en' => 'Cold-Pressed Forest Botanical Hair & Body Oil',
                'name_bn' => 'পাহাড়ি ভেষজ তেল ও প্রাকৃতিক সাবান',
                'category_id' => 'cat-herbal',
                'subcategory' => 'ভেষজ তেল',
                'price' => 580,
                'old_price' => 690,
                'stock' => 40,
                'sku' => 'HRB-OIL-01',
                'image' => '/images/prod-herbal.jpg',
                'district' => 'খাগড়াছড়ি',
                'community' => 'চাকমা',
                'is_natural' => true,
                'is_organic' => true,
                'vendor_name' => 'Khagrachari Organics',
                'vendor_location' => 'খাগড়াছড়ি',
                'description' => 'পাহাড়ের বুনো আমলকী, হরিতকী, বহেড়া, নিম ও মেথি দিয়ে কাঠের ঘানিতে ভাঙানো কোল্ড-প্রেসড ভেষজ হেয়ার ও স্কিন অয়েল।',
            ],
            [
                'id' => 'hill-ginger-powder',
                'name_en' => 'Organic Hill Ginger',
                'name_bn' => 'সাজেক ও খাগড়াছড়ির খাঁটি পাহাড়ি আদা',
                'category_id' => 'cat-spices',
                'subcategory' => 'Hill Ginger (আদা)',
                'price' => 380,
                'old_price' => 450,
                'stock' => 35,
                'sku' => 'KO-GIN-01',
                'image' => '/images/cat-pantry.jpg',
                'district' => 'খাগড়াছড়ি',
                'community' => 'চাকমা',
                'is_organic' => true,
                'is_food' => true,
                'vendor_name' => 'Khagrachari Organics',
                'vendor_location' => 'খাগড়াছড়ি',
                'description' => 'সাজেক ও খাগড়াছড়ির উঁচু পাহাড়ে প্রাকৃতিকভাবে ফলানো তীব্র ঝাঁঝালো ও সুগন্ধি খাঁটি পাহাড়ি আদা।',
            ],
        ];

        foreach ($existingProducts as $p) {
            $product = Product::updateOrCreate(
                ['id' => $p['id']],
                [
                    'name_en' => $p['name_en'],
                    'name_bn' => $p['name_bn'],
                    'slug' => Str::slug($p['name_en']) . '-' . Str::random(4),
                    'category_id' => $p['category_id'],
                    'subcategory' => $p['subcategory'] ?? null,
                    'product_type' => 'simple',
                    'price' => $p['price'],
                    'old_price' => $p['old_price'] ?? null,
                    'stock' => $p['stock'],
                    'sku' => $p['sku'],
                    'image' => $p['image'],
                    'district' => $p['district'],
                    'community' => $p['community'] ?? 'চাকমা',
                    'is_handmade' => $p['is_handmade'] ?? false,
                    'is_natural' => $p['is_natural'] ?? false,
                    'is_organic' => $p['is_organic'] ?? false,
                    'is_food' => $p['is_food'] ?? false,
                    'production_date' => $p['production_date'] ?? null,
                    'expiry_date' => $p['expiry_date'] ?? null,
                    'storage_instructions' => $p['storage_instructions'] ?? null,
                    'vendor_name' => $p['vendor_name'],
                    'vendor_location' => $p['vendor_location'],
                    'description' => $p['description'],
                    'status' => 'Approved',
                    'rating' => 4.9,
                    'reviews_count' => 50,
                ]
            );

            // Add primary image to product_images
            ProductImage::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'image_path' => $product->image,
                ],
                [
                    'sort_order' => 1,
                    'is_primary' => true,
                ]
            );
        }

        // =========================================================================
        // 5. ENRICH ONE FLAGSHIP TEXTILE PRODUCT AS A COMPLETE "VARIABLE PRODUCT"
        //    (Chakma Handwoven Pinon & Hadi with S, M, L, XL and Red/Navy/Terracotta)
        // =========================================================================
        $variableProduct = Product::find('chakma-pinon-hadi');
        if ($variableProduct) {
            $variableProduct->update(['product_type' => 'variable']);

            $sizeAttr = Attribute::where('code', 'size_apparel')->first();
            $colorAttr = Attribute::where('code', 'color')->first();

            if ($sizeAttr && $colorAttr) {
                $sizes = AttributeValue::where('attribute_id', $sizeAttr->id)
                    ->whereIn('name_en', ['S', 'M', 'L', 'XL'])
                    ->get();
                $colors = AttributeValue::where('attribute_id', $colorAttr->id)
                    ->whereIn('name_en', ['Terracotta', 'Navy Blue', 'Forest Green'])
                    ->get();

                // Save Product Attributes
                ProductAttribute::updateOrCreate(
                    [
                        'product_id' => $variableProduct->id,
                        'attribute_id' => $sizeAttr->id,
                    ],
                    [
                        'selected_values' => $sizes->pluck('id')->toArray(),
                    ]
                );

                ProductAttribute::updateOrCreate(
                    [
                        'product_id' => $variableProduct->id,
                        'attribute_id' => $colorAttr->id,
                    ],
                    [
                        'selected_values' => $colors->pluck('id')->toArray(),
                    ]
                );

                // Generate Variations Combinations
                foreach ($colors as $cIndex => $cVal) {
                    foreach ($sizes as $sIndex => $sVal) {
                        $sku = "TEX-PINON-{$cVal->name_en}-{$sVal->name_en}";
                        
                        // Let's create varying prices & stock (some in stock, one out of stock for testing)
                        $isOutOfStock = ($cVal->name_en === 'Forest Green' && $sVal->name_en === 'XL');
                        $stock = $isOutOfStock ? 0 : (5 + $sIndex * 3 + $cIndex * 2);
                        $variationPrice = 4800 + ($sIndex * 200); // larger size slightly higher
                        $salePrice = 4500 + ($sIndex * 200);

                        $varModel = ProductVariation::updateOrCreate(
                            [
                                'product_id' => $variableProduct->id,
                                'sku' => $sku,
                            ],
                            [
                                'price' => $variationPrice,
                                'sale_price' => $salePrice,
                                'stock' => $stock,
                                'image_url' => '/images/prod-pinon.jpg',
                                'is_active' => true,
                            ]
                        );

                        // Link variation values
                        VariationAttributeValue::updateOrCreate(
                            [
                                'variation_id' => $varModel->id,
                                'attribute_id' => $colorAttr->id,
                            ],
                            [
                                'attribute_value_id' => $cVal->id,
                            ]
                        );

                        VariationAttributeValue::updateOrCreate(
                            [
                                'variation_id' => $varModel->id,
                                'attribute_id' => $sizeAttr->id,
                            ],
                            [
                                'attribute_value_id' => $sVal->id,
                            ]
                        );
                    }
                }
            }
        }

        // Also enrich Honey as Variable Product (Weight variations: 250g, 500g, 1kg)
        $honeyProduct = Product::find('wild-forest-honey');
        if ($honeyProduct) {
            $honeyProduct->update(['product_type' => 'variable']);
            $weightAttr = Attribute::where('code', 'weight')->first();
            if ($weightAttr) {
                $weights = AttributeValue::where('attribute_id', $weightAttr->id)
                    ->whereIn('name_en', ['250g', '500g', '1kg'])
                    ->get();

                ProductAttribute::updateOrCreate(
                    [
                        'product_id' => $honeyProduct->id,
                        'attribute_id' => $weightAttr->id,
                    ],
                    [
                        'selected_values' => $weights->pluck('id')->toArray(),
                    ]
                );

                $weightPrices = [
                    '250g' => ['price' => 480, 'sale' => 450, 'stock' => 35],
                    '500g' => ['price' => 890, 'sale' => 820, 'stock' => 50],
                    '1kg'  => ['price' => 1700, 'sale' => 1550, 'stock' => 20],
                ];

                foreach ($weights as $wVal) {
                    $wMeta = $weightPrices[$wVal->name_en] ?? ['price' => 890, 'sale' => 820, 'stock' => 10];
                    $var = ProductVariation::updateOrCreate(
                        [
                            'product_id' => $honeyProduct->id,
                            'sku' => "KO-HONEY-{$wVal->name_en}",
                        ],
                        [
                            'price' => $wMeta['price'],
                            'sale_price' => $wMeta['sale'],
                            'stock' => $wMeta['stock'],
                            'image_url' => '/images/prod-honey.jpg',
                            'is_active' => true,
                        ]
                    );

                    VariationAttributeValue::updateOrCreate(
                        [
                            'variation_id' => $var->id,
                            'attribute_id' => $weightAttr->id,
                        ],
                        [
                            'attribute_value_id' => $wVal->id,
                        ]
                    );
                }
            }
        }

        // ==========================================
        // 6. SEED SAMPLE VENDOR ATTRIBUTE REQUESTS
        // ==========================================
        $sampleRequests = [
            [
                'vendor_name' => 'Rangamati Weaves',
                'vendor_id' => 'v-1',
                'request_type' => 'value',
                'name_en' => 'Indigo Natural Blue (নীল গাছ রং)',
                'name_bn' => 'প্রাকৃতিক নীল রং',
                'attribute_id' => Attribute::where('code', 'color')->value('id'),
                'category_id' => 'cat-apparel',
                'details' => 'আমরা পাহাড়ি জঙ্গল থেকে সংগৃহীত প্রাকৃতিক নীল পাতার উদ্ভিজ্জ রং তৈরি করেছি যা তাঁত কাপড়ে ব্যবহার করা হবে।',
                'status' => 'Pending',
                'admin_note' => null,
            ],
            [
                'vendor_name' => 'Bandarban Hills Coffee',
                'vendor_id' => 'v-3',
                'request_type' => 'unit',
                'name_en' => 'Drip Bag Pack (ড্রিপ কফি প্যাক)',
                'name_bn' => 'ড্রিপ ব্যাগ প্যাক',
                'attribute_id' => null,
                'category_id' => 'cat-tea',
                'details' => 'সিঙ্গেল সার্ভ ড্রিপ কফি ফিল্টার ব্যাগের জন্য নতুন ইউনিট কোড প্রয়োজন।',
                'status' => 'Pending',
                'admin_note' => null,
            ],
            [
                'vendor_name' => 'Marma Clay Studio',
                'vendor_id' => 'v-4',
                'request_type' => 'attribute',
                'name_en' => 'Glaze Finish (গ্লেজ কোটিং)',
                'name_bn' => 'মাটির পাত্রের গ্লেজিং ফিনিশ',
                'attribute_id' => null,
                'category_id' => 'cat-craft',
                'details' => 'ম্যাট এবং গ্লসি ফিনিশের সিরামিক পাত্র আলাদা করতে এই অ্যাট্রিবিউট প্রয়োজন।',
                'status' => 'Approved',
                'admin_note' => 'অনুমোদিত। ক্যাটাগরি হস্তশিল্পে যুক্ত করা হয়েছে।',
            ],
        ];

        foreach ($sampleRequests as $req) {
            AttributeRequest::updateOrCreate(
                [
                    'vendor_name' => $req['vendor_name'],
                    'name_en' => $req['name_en'],
                ],
                $req
            );
        }
    }
}
