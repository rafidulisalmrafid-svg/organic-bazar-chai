<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public static function getCategories(): array
    {
        return [
            [
                'id' => 'cat-fruits',
                'name' => 'পাহাড়ি ফল', 
                'parentId' => null,
                'slug' => 'hill-fruits',
                'icon' => 'Apple',
                'image' => '/images/prod-pineapple.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'পাহাড়ের খাঁটি মিষ্টি আনারস, পাহাড়ি রসালো কমলা ও মাল্টা, কাঠাল, পাহাড়ি কলা, লিচু ও ড্রাগন ফল।',
                'status' => 'Active',
                'order' => 1,
                'featured' => true,
                'seoTitle' => 'Fresh Organic Hill Fruits from Chittagong Hill Tracts | Paharika',
                'seoDesc' => 'Authentic sweet hill pineapple, mountain oranges, jackfruit, hill bananas and seasonal fruits directly from indigenous orchards.',
                'count' => 32,
                'commission' => 8,
                'subcategories' => ['আনারস', 'কমলা / মাল্টা', 'কাঁঠাল', 'কলা', 'লিচু', 'আম', 'ড্রাগন ফল / অন্যান্য'],
            ],
            [
                'id' => 'cat-honey',
                'name' => 'মধু ও মৌচাকজাত পণ্য', 
                'parentId' => null,
                'slug' => 'honey-and-bee-products',
                'icon' => 'Droplet',
                'image' => '/images/prod-honey.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'সাজেক ও কেওক্রাডং গভীর বনাঞ্চলের সংগৃহীত কাঁচা বুনো মধু, খামারের প্রাকৃতিক চাকের মধু ও খাঁটি মোম।',
                'status' => 'Active',
                'order' => 2,
                'featured' => true,
                'seoTitle' => 'Raw Forest Honey & Pure Beeswax | Paharika',
                'seoDesc' => '100% pure raw wild forest honey harvested from Sajek and Keokradong canopy reserves.',
                'count' => 24,
                'commission' => 10,
                'subcategories' => ['বন্য মধু', 'খামারের মধু', 'মোম'],
            ],
            [
                'id' => 'cat-food',
                'name' => 'পাহাড়ি খাদ্য ও শুঁটকি', 
                'parentId' => null,
                'slug' => 'hill-food-and-dried-fish',
                'icon' => 'Soup',
                'image' => '/images/prod-bamboo-shoot.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'ঐতিহ্যবাহী কচি বাঁশ কোড়ল, পাহাড়ি শুঁটকি মাছ, জুমের লাল চাল, ঐতিহ্যবাহী পিঠা ও পাহাড়ি বুনো মাশরুম।',
                'status' => 'Active',
                'order' => 3,
                'featured' => true,
                'seoTitle' => 'Traditional Hill Food, Bamboo Shoot & Dry Fish | Paharika',
                'seoDesc' => 'Traditional bamboo shoot pickle, indigenous Jhum red rice, dried fish and ethnic delicacies.',
                'count' => 38,
                'commission' => 10,
                'subcategories' => ['বাঁশ কোড়ল (বাঁশের কোঁড়) ও আচার', 'শুঁটকি মাছ', 'পাহাড়ি চাল (জুমের চাল)', 'ঐতিহ্যবাহী পিঠা ও শুকনো খাবার', 'মাশরুম', 'আচার ও চাটনি'],
            ],
            [
                'id' => 'cat-craft',
                'name' => 'হস্তশিল্প', 
                'parentId' => null,
                'slug' => 'handicrafts',
                'icon' => 'TreePine',
                'image' => '/images/cat-bamboo.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'পাহাড়ি পাকা বাঁশ ও বেতের তৈরি ঝুড়ি, হাতপাখা, চেয়ার-মোড়া, নান্দনিক কাঠের শোপিস ও মৃৎশিল্প।',
                'status' => 'Active',
                'order' => 4,
                'featured' => true,
                'seoTitle' => 'Artisanal Bamboo, Cane Crafts & Terracotta | Paharika',
                'seoDesc' => 'Handwoven bamboo baskets, cane craft furniture, wooden showpieces and terracotta pottery.',
                'count' => 54,
                'commission' => 10,
                'subcategories' => ['বাঁশের তৈরি পণ্য (ঝুড়ি, টুপি, হাতপাখা, কলম দানি)', 'বেতের তৈরি পণ্য (চেয়ার, মোড়া, ঝুড়ি)', 'কাঠের তৈরি শোপিস', 'মাটি ও সিরামিক পণ্য', 'ঘর সাজানোর জিনিস'],
            ],
            [
                'id' => 'cat-apparel',
                'name' => 'ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র', 
                'parentId' => null,
                'slug' => 'traditional-apparel',
                'icon' => 'Shirt',
                'image' => '/images/prod-pinon.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'আদিবাসী কোমর তাঁতে বোনা নারীদের থামি, পিনন-হাদি, পুরুষদের পোশাক, ঐতিহ্যবাহী শাল, চাদর ও কুশন কভার।',
                'status' => 'Active',
                'order' => 5,
                'featured' => true,
                'seoTitle' => 'Traditional Handloom Textiles, Pinon & Shawls | Paharika',
                'seoDesc' => 'Centuries-old tribal waist-loom and pit-loom woven fabrics from Chakma, Marma, and Tripura artisans.',
                'count' => 65,
                'commission' => 10,
                'subcategories' => ['নারীদের পোশাক (থামি, পিনন, খাদি)', 'পুরুষদের পোশাক', 'শাল ও চাদর', 'ব্যাগ ও পার্স (হাতে বোনা)', 'স্কার্ফ ও মাফলার', 'বিছানার চাদর ও কুশন কভার'],
            ],
            [
                'id' => 'cat-jewelry',
                'name' => 'গহনা ও অলংকার', 
                'parentId' => null,
                'slug' => 'jewellery-and-ornaments',
                'icon' => 'Gem',
                'image' => '/images/prod-silver.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'ঐতিহ্যবাহী চাকমা ও মারমা রূপার পাহাড়ি গহনা (হাসুলি, ঝুমকা, বালা), কাঠের ও রঙিন পুঁতির পাহাড়ি মালা।',
                'status' => 'Active',
                'order' => 6,
                'featured' => true,
                'seoTitle' => 'Authentic Tribal Silver Jewellery & Hill Beads | Paharika',
                'seoDesc' => 'Handmade tribal silver jewellery, ethnic beads necklaces and traditional hill ornaments.',
                'count' => 28,
                'commission' => 12,
                'subcategories' => ['রুপার গহনা', 'পুঁতির মালা', 'কানের দুল ও চুড়ি', 'ঐতিহ্যবাহী অলংকার'],
            ],
            [
                'id' => 'cat-tea',
                'name' => 'চা ও কফি', 
                'parentId' => null,
                'slug' => 'hill-tea-and-coffee',
                'icon' => 'Coffee',
                'image' => '/images/prod-coffee.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'উঁচু পাহাড়ি ঢালে চাষকৃত প্রিমিয়াম হোল-লিফ পাহাড়ি চা, অ্যারাবিকা পাহাড়ি রোস্টেড কফি ও ভেষজ হারবাল চা।',
                'status' => 'Active',
                'order' => 7,
                'featured' => true,
                'seoTitle' => 'Artisanal Hill Tea & Roasted Hill Coffee | Paharika',
                'seoDesc' => 'Single-estate highland whole leaf black & green tea, artisanal hill coffee from Bandarban.',
                'count' => 22,
                'commission' => 10,
                'subcategories' => ['পাহাড়ি চা', 'পাহাড়ি কফি', 'হারবাল চা'],
            ],
            [
                'id' => 'cat-herbal',
                'name' => 'ভেষজ ও প্রাকৃতিক পণ্য', 
                'parentId' => null,
                'slug' => 'herbal-and-natural',
                'icon' => 'Leaf',
                'image' => '/images/prod-herbal.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'পাহাড়ের বুনো ঔষধি গাছগাছড়া, কোল্ড-প্রেসড ভেষজ তেল, কেমিক্যালমুক্ত প্রাকৃতিক সাবান, স্কিনকেয়ার ও সুগন্ধি আগর।',
                'status' => 'Active',
                'order' => 8,
                'featured' => true,
                'seoTitle' => 'Natural Herbal Remedies, Essential Oils & Agarbatti | Paharika',
                'seoDesc' => 'Indigenous medicinal herbs, cold-pressed oils, natural soaps and aromatic agarwood.',
                'count' => 30,
                'commission' => 10,
                'subcategories' => ['ভেষজ তেল', 'ভেষজ গাছগাছড়া', 'প্রাকৃতিক সাবান ও স্কিনকেয়ার', 'আগর ও সুগন্ধি পণ্য'],
            ],
            [
                'id' => 'cat-gifts',
                'name' => 'উপহার ও গিফট প্যাক', 
                'parentId' => null,
                'slug' => 'gifts-and-souvenirs',
                'icon' => 'Gift',
                'image' => '/images/prod-giftbox.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'উৎসব ও প্রিয়জনের জন্য সাজানো পাহাড়ি গিফট বক্স, পর্যটক স্যুভেনির এবং স্পেশাল কম্বো প্যাক (মধু + মসলা + চা)।',
                'status' => 'Active',
                'order' => 9,
                'featured' => true,
                'seoTitle' => 'Hill Souvenirs, Festive Gift Boxes & Combos | Paharika',
                'seoDesc' => 'Curated hill gift boxes, authentic traveler souvenirs and combo pairings from Chittagong Hill Tracts.',
                'count' => 19,
                'commission' => 10,
                'subcategories' => ['গিফট বক্স', 'পর্যটক স্যুভেনির', 'কম্বো প্যাক (মধু + মসলা + চা)'],
            ],
            [
                'id' => 'cat-spices',
                'name' => 'পাহাড়ি মসলা', 
                'parentId' => null,
                'slug' => 'hill-spices',
                'icon' => 'Flame',
                'image' => '/images/cat-pantry.jpg',
                'banner' => '/images/hero.jpg',
                'description' => 'পাহাড়ের খাঁটি আদা, পাহাড়ি দেশি রসুন, কেওক্রাডং বুনো হলুদ ও গভীর অরণ্যের গোলমরিচ — শতভাগ অর্গানিক ও রাসায়নিকমুক্ত।',
                'status' => 'Active',
                'order' => 10,
                'featured' => true,
                'seoTitle' => 'Organic Hill Ginger, Garlic & Mountain Spices | Paharika',
                'seoDesc' => 'Authentic hill-grown raw ginger, hill garlic, wild forest turmeric and mountain spices directly sourced from indigenous farmers.',
                'count' => 18,
                'commission' => 10,
                'subcategories' => [
                    'Hill Ginger (আদা)', 
                    'Wild Garlic (রসুন)', 
                    'Forest Turmeric (হলুদ)', 
                    'Black Pepper (গোলমরিচ)'
                ],
            ],
        ];
    }

    public static function getCategoryRequests(): array
    {
        return [
            [
                'id' => 'req-1',
                'vendorName' => 'Rangamati Weaves',
                'requestedCategory' => 'Tribal Silver Jewellery (রূপার পাহাড়ি গহনা)',
                'parentCategory' => 'Handloom Textiles',
                'reason' => 'আমাদের ১৫ জন চাকমা রূপার কারিগর ঐতিহ্যবাহী হাসুলি, ঝুমকা ও বালা তৈরি করছেন।',
                'status' => 'Pending',
                'date' => 'Today, 11:20 AM'
            ],
            [
                'id' => 'req-2',
                'vendorName' => 'Bandarban Cane Craft',
                'requestedCategory' => 'Hill Musical Instruments (বাঁশের বাঁশি ও দোতারা)',
                'parentCategory' => 'Bamboo & Cane',
                'reason' => 'মারমা ও বম বাঁশি কারিগরদের তৈরি খাঁটি পাহাড়ি বাঁশের বাঁশি বিক্রির জন্য আলাদা ক্যাটাগরি প্রয়োজন।',
                'status' => 'Pending',
                'date' => 'Yesterday'
            ]
        ];
    }

    public static function getDynamicFields(): array
    {
        return [
            [
                'category' => 'Handloom Textiles',
                'fields' => [
                    ['name' => 'loom_type', 'label' => 'তাঁতের ধরণ (Loom Type)', 'type' => 'select', 'options' => ['Traditional Backstrap Loom (কোমর তাঁত)', 'Pit Loom (খটখটি তাঁত)', 'Frame Loom']],
                    ['name' => 'dye_type', 'label' => 'রং প্রক্রিয়া (Dye Method)', 'type' => 'select', 'options' => ['100% Natural Plant Dye (উদ্ভিজ্জ রং)', 'Vegetable-tanned', 'Chemical-free Cotton']],
                    ['name' => 'tribal_motif', 'label' => 'ঐতিহ্যবাহী নকশা (Tribal Motif)', 'type' => 'text', 'placeholder' => 'e.g. Chakma Diamond Pattern / Alom Motifs'],
                    ['name' => 'artisan_community', 'label' => 'কারিগর সম্প্রদায় (Artisan Tribe)', 'type' => 'select', 'options' => ['Chakma', 'Marma', 'Tripura', 'Tanchangya', 'Bawm']],
                ]
            ],
            [
                'category' => 'Hill Pantry',
                'fields' => [
                    ['name' => 'harvest_valley', 'label' => 'সংগ্রহের উপত্যকা (Harvest Valley)', 'type' => 'select', 'options' => ['Deep Sajek Valley (সাজেক)', 'Keokradong Forest (কেওক্রাডং)', 'Alikadam Hills (আলীকদম)', 'Ruma Reserve']],
                    ['name' => 'purity_certification', 'label' => 'বিশুদ্ধতার প্রমাণ (Certification)', 'type' => 'select', 'options' => ['100% Raw Unfiltered (অপরিশোধিত)', 'Lab-Tested Pure', 'Small Batch Seasonal']],
                    ['name' => 'batch_season', 'label' => 'মৌসুম (Harvest Season)', 'type' => 'text', 'placeholder' => 'e.g. Winter Blossom 2026'],
                ]
            ],
            [
                'category' => 'Bamboo & Cane',
                'fields' => [
                    ['name' => 'cane_treatment', 'label' => 'বাঁশ প্রক্রিয়াজাতকরণ (Curing Method)', 'type' => 'select', 'options' => ['Sun-cured Hill Bamboo (রোদে শুকানো)', 'Smoked & Seasoned', 'Natural River-washed']],
                    ['name' => 'handle_material', 'label' => 'হাতলের উপাদান (Handle Material)', 'type' => 'select', 'options' => ['Vegetable-tanned Leather', 'Woven Cane Rope', 'Bamboo Root']],
                ]
            ],
            [
                'category' => 'Terracotta & Clay',
                'fields' => [
                    ['name' => 'clay_origin', 'label' => 'মাটির উৎস (Clay Origin)', 'type' => 'select', 'options' => ['Sangu River Clay (সাঙ্গু নদী)', 'Karnafuli Hill Clay', 'Wild Terracotta Deposit']],
                    ['name' => 'firing_method', 'label' => 'পোড়ানোর ধরণ (Firing Technique)', 'type' => 'select', 'options' => ['Traditional Wood Kiln (কাঠের ভাটি)', 'Smoked Black Pottery', 'Earthen Pit Fired']],
                ]
            ]
        ];
    }

    public static function getVendors(): array
    {
        return [
            [
                'id' => 'v-1',
                'name' => 'Rangamati Weaves', 
                'location' => 'Rangamati', 
                'specialty' => 'Handloom Textiles', 
                'products' => 24, 
                'rating' => 4.9, 
                'image' => '/images/cat-textiles.jpg',
                'status' => 'Approved',
                'artisanCount' => 120,
                'joinedDate' => 'Jan 2025',
                'balance' => 42500,
                'story' => 'Preserving centuries-old backstrap weaving traditions across the Chakma and Tanchangya villages along Lake Kaptai.'
            ],
            [
                'id' => 'v-2',
                'name' => 'Bandarban Cane Craft', 
                'location' => 'Bandarban', 
                'specialty' => 'Bamboo & Cane', 
                'products' => 18, 
                'rating' => 4.8, 
                'image' => '/images/cat-bamboo.jpg',
                'status' => 'Approved',
                'artisanCount' => 75,
                'joinedDate' => 'Mar 2025',
                'balance' => 28400,
                'story' => 'Master Marma and Bawm bamboo craftsmen creating sturdy, sustainable lifestyle crafts from mature hill cane.'
            ],
            [
                'id' => 'v-3',
                'name' => 'Khagrachari Organics', 
                'location' => 'Khagrachari', 
                'specialty' => 'Honey, Tea & Spices', 
                'products' => 15, 
                'rating' => 4.9, 
                'image' => '/images/cat-pantry.jpg',
                'status' => 'Approved',
                'artisanCount' => 60,
                'joinedDate' => 'Apr 2025',
                'balance' => 31200,
                'story' => 'Ethical wild harvesters gathering unheated forest honey and single-estate loose leaf tea from the misty Khagrachari hills.'
            ],
            [
                'id' => 'v-4',
                'name' => 'Marma Clay Studio', 
                'location' => 'Bandarban', 
                'specialty' => 'Terracotta & Pottery', 
                'products' => 12, 
                'rating' => 4.7, 
                'image' => '/images/cat-pottery.jpg',
                'status' => 'Approved',
                'artisanCount' => 45,
                'joinedDate' => 'Jun 2025',
                'balance' => 19800,
                'story' => 'Hand-thrown terracotta pottery using enriched Sangu riverbed clay fired in community wood kilns.'
            ],
        ];
    }

    public static function getVendorApplications(): array
    {
        return [
            [
                'id' => 'app-101',
                'name' => 'Bawm Bamboo Artisans',
                'owner' => 'Lal Lian Bawm',
                'email' => 'lallian@bawmbamboo.com',
                'phone' => '01812-449102',
                'phoneVerified' => true,
                'location' => 'Ruma, Bandarban',
                'specialty' => 'Bamboo & Cane Furnishings',
                'artisanCount' => 28,
                'nidNumber' => '882910492109',
                'nidOrTrade' => 'NID-8829104921 (Verified)',
                'appliedDate' => '2 days ago',
                'status' => 'Pending',
                'logo' => '/images/cat-bamboo.jpg',
                'cover' => '/images/hero.jpg',
                'businessDocs' => 'ট্রেড লাইসেন্স ও টিন সার্টিফিকেট দেওয়া হয়নি (ঐচ্ছিক)',
                'hasBusinessDocs' => false,
                'paymentMethod' => 'bKash Merchant (01812-449102)',
                'description' => 'A cooperative of 28 artisan families specializing in traditional nested storage baskets and rattan homeware.'
            ],
            [
                'id' => 'app-102',
                'name' => 'Tripura Natural Dyes Studio',
                'owner' => 'Khumpui Tripura',
                'email' => 'khumpui@tripuradyes.com',
                'phone' => '01719-823901',
                'phoneVerified' => true,
                'location' => 'Dighinala, Khagrachari',
                'specialty' => 'Natural Dyed Handloom Scarves',
                'artisanCount' => 19,
                'nidNumber' => '409182394019',
                'nidOrTrade' => 'TradeLicense-KHA-4091',
                'appliedDate' => 'Yesterday',
                'status' => 'Pending',
                'logo' => '/images/cat-textiles.jpg',
                'cover' => '/images/hero.jpg',
                'businessDocs' => 'ট্রেড লাইসেন্স সংযুক্ত: TR-KHA-4091 (ঐচ্ছিক)',
                'hasBusinessDocs' => true,
                'paymentMethod' => 'Islami Bank Bangladesh Ltd, A/C: 205011409210',
                'description' => 'Extracting natural forest dyes from wild indigo, turmeric, and barks to weave chemical-free ceremonial scarves.'
            ],
            [
                'id' => 'app-103',
                'name' => 'Pangkhua Herbal Roots',
                'owner' => 'Remthang Pangkhua',
                'email' => 'remthang@pangkhuaherbs.com',
                'phone' => '01923-019283',
                'phoneVerified' => true,
                'location' => 'Bilaichhari, Rangamati',
                'specialty' => 'Hill Herbal Teas & Roots',
                'artisanCount' => 12,
                'nidNumber' => '719204918201',
                'nidOrTrade' => 'NID-7192049182',
                'appliedDate' => '4 days ago',
                'status' => 'Pending',
                'logo' => '/images/cat-pantry.jpg',
                'cover' => '/images/hero.jpg',
                'businessDocs' => 'কোনো বাণিজ্যিক ডকুমেন্ট সংযুক্ত নেই (ঐচ্ছিক)',
                'hasBusinessDocs' => false,
                'paymentMethod' => 'Nagad Personal (01923-019283)',
                'description' => 'Foraged hill spices and herbal blends packaged in eco-friendly banana fiber pouches.'
            ]
        ];
    }

    public static function getWithdrawalRequests(): array
    {
        return [
            [
                'id' => '#WD-9041',
                'vendor' => 'Rangamati Weaves',
                'amount' => '৳ 34,500',
                'method' => 'bKash Merchant (01712-849102)',
                'date' => 'Today, 2:30 PM',
                'status' => 'Pending'
            ],
            [
                'id' => '#WD-9042',
                'vendor' => 'Khagrachari Organics',
                'amount' => '৳ 21,800',
                'method' => 'Islami Bank (A/C: 2050184910)',
                'date' => 'Yesterday',
                'status' => 'Pending'
            ],
            [
                'id' => '#WD-9040',
                'vendor' => 'Bandarban Cane Craft',
                'amount' => '৳ 18,200',
                'method' => 'Nagad (01819-749201)',
                'date' => '3 days ago',
                'status' => 'Approved'
            ],
            [
                'id' => '#WD-9039',
                'vendor' => 'Marma Clay Studio',
                'amount' => '৳ 15,000',
                'method' => 'bKash (01911-309182)',
                'date' => '5 days ago',
                'status' => 'Approved'
            ]
        ];
    }

    public static function getProducts(): array
    {
        try {
            if (class_exists(\App\Models\Product::class) && \App\Models\Product::exists()) {
                $categories = self::getCategories();
                $catNameMap = collect($categories)->pluck('name', 'id')->toArray();

                $dbProducts = \App\Models\Product::with([
                    'images', 
                    'variations.attributeValues.attributeValue', 
                    'productAttributes.attribute.values'
                ])->get();

                return $dbProducts->map(function ($p) use ($catNameMap) {
                    $categoryName = $catNameMap[$p->category_id] ?? $p->category_id;
                    $specs = $p->specs ?? [
                        'উৎস' => $p->district . ($p->community ? " ({$p->community} সম্প্রদায়)" : ''),
                        'ধরন' => $p->product_type === 'variable' ? 'ভ্যারিয়েবল পণ্য' : 'একক পণ্য',
                    ];

                    return [
                        'id' => $p->id,
                        'name' => $p->name_bn ? "{$p->name_en} ({$p->name_bn})" : $p->name_en,
                        'name_en' => $p->name_en,
                        'name_bn' => $p->name_bn,
                        'category' => $categoryName,
                        'category_id' => $p->category_id,
                        'subcategory' => $p->subcategory,
                        'brand' => $p->brand,
                        'price' => (float)$p->price,
                        'oldPrice' => $p->old_price ? (float)$p->old_price : null,
                        'rating' => (float)$p->rating,
                        'reviews' => (int)$p->reviews_count,
                        'vendor' => $p->vendor_name,
                        'location' => $p->vendor_location,
                        'stock' => (int)$p->stock,
                        'sku' => $p->sku,
                        'image' => $p->image,
                        'badge' => $p->badge ?? ($p->is_organic ? 'Organic' : ($p->is_handmade ? 'Handmade' : 'Authentic')),
                        'description' => $p->description,
                        'short_description' => $p->short_description,
                        'product_type' => $p->product_type,
                        'district' => $p->district,
                        'community' => $p->community,
                        'is_handmade' => (bool)$p->is_handmade,
                        'is_natural' => (bool)$p->is_natural,
                        'is_organic' => (bool)$p->is_organic,
                        'is_food' => (bool)$p->is_food,
                        'production_date' => $p->production_date,
                        'expiry_date' => $p->expiry_date,
                        'storage_instructions' => $p->storage_instructions,
                        'status' => $p->status,
                        'specs' => $specs,
                        'gallery' => $p->images->map(fn($img) => [
                            'id' => $img->id,
                            'image_path' => $img->image_path,
                            'color_value_id' => $img->color_value_id,
                            'is_primary' => $img->is_primary,
                        ])->toArray(),
                        'variations' => $p->variations->map(fn($v) => [
                            'id' => $v->id,
                            'sku' => $v->sku,
                            'price' => (float)$v->price,
                            'sale_price' => $v->sale_price ? (float)$v->sale_price : null,
                            'stock' => (int)$v->stock,
                            'image_url' => $v->image_url,
                            'is_active' => (bool)$v->is_active,
                            'attributes' => $v->attributeValues->mapWithKeys(fn($av) => [
                                $av->attribute->code ?? (string)$av->attribute_id => [
                                    'id' => $av->attributeValue->id ?? $av->attribute_value_id,
                                    'name_en' => $av->attributeValue->name_en ?? '',
                                    'name_bn' => $av->attributeValue->name_bn ?? '',
                                    'hex_color' => $av->attributeValue->hex_color ?? null,
                                ]
                            ])->toArray(),
                        ])->toArray(),
                        'product_attributes' => $p->productAttributes->map(fn($pa) => [
                            'id' => $pa->attribute->id,
                            'code' => $pa->attribute->code,
                            'name_en' => $pa->attribute->name_en,
                            'name_bn' => $pa->attribute->name_bn,
                            'type' => $pa->attribute->type,
                            'selected_values' => $pa->selected_values,
                            'values' => $pa->attribute->values
                                ->whereIn('id', $pa->selected_values ?? [])
                                ->values()
                                ->map(fn($val) => [
                                    'id' => $val->id,
                                    'name_en' => $val->name_en,
                                    'name_bn' => $val->name_bn,
                                    'hex_color' => $val->hex_color,
                                ])->toArray(),
                        ])->toArray(),
                    ];
                })->toArray();
            }
        } catch (\Throwable $e) {
            // fallback to static list on any exception
        }

        return [
            // 1. পাহাড়ি ফল (Hill Fruits)
            [
                'id' => 'sajek-honey-pineapple',
                'name' => 'Sajek Honey Pineapple (সাজেক পাহাড়ি মধু আনারস)',
                'category' => 'পাহাড়ি ফল',
                'subcategory' => 'আনারস',
                'price' => 120,
                'oldPrice' => 150,
                'rating' => 4.9,
                'reviews' => 85,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Sajek, Rangamati',
                'stock' => 60,
                'sku' => 'FRT-PA-01',
                'image' => '/images/prod-pineapple.jpg',
                'badge' => 'Fresh Harvest',
                'description' => 'সাজেক ভ্যালির পাহাড়ি ঢালে সম্পূর্ণ রাসায়নিক ও ফরমালিন ছাড়া প্রাকৃতিকভাবে পাকা তীব্র মিষ্টি ও রসালো খাঁটি পাহাড়ি মধু আনারস।',
                'specs' => [
                    'উৎস' => 'সাজেক ভ্যালি, রাঙ্গামাটি',
                    'প্যাক সাইজ' => 'প্রতি জোড়া (২ পিস)',
                    'গুণগত মান' => 'গাছপাকা শতভাগ প্রাকৃতিক'
                ]
            ],
            [
                'id' => 'bandarban-sweet-orange',
                'name' => 'Bandarban Hill Orange & Malta (পাহাড়ি মিষ্টি কমলা ও মাল্টা)',
                'category' => 'পাহাড়ি ফল',
                'subcategory' => 'কমলা / মাল্টা',
                'price' => 350,
                'oldPrice' => 420,
                'rating' => 4.8,
                'reviews' => 62,
                'vendor' => 'Mawrum Green Orchard',
                'location' => 'Ruma, Bandarban',
                'stock' => 45,
                'sku' => 'FRT-OR-02',
                'image' => '/images/prod-orange.jpg',
                'badge' => 'Organic',
                'description' => 'বান্দরবানের রুমা ও চিম্বুক পাহাড়ের উঁচু ঢালে আদিবাসী জুমচাষীদের ফলানো অত্যন্ত রসালো পাহাড়ি মিষ্টি কমলা ও সবুজ মাল্টা।',
                'specs' => [
                    'উৎস' => 'চিম্বুক পাহাড়, বান্দরবান',
                    'ওজন' => '১ কেজি ক্রাফট ব্যাগ',
                    'স্বাদ' => 'মিষ্টি ও হালকা টক পাহাড়ি ফ্লেভার'
                ]
            ],

            // 2. মধু ও মৌচাকজাত পণ্য (Honey & Bee Products)
            [
                'id' => 'wild-forest-honey',
                'name' => 'Wild Forest Honey (কেওক্রাডং বন্য কাঁচা মধু)',
                'category' => 'মধু ও মৌচাকজাত পণ্য',
                'subcategory' => 'বন্য মধু',
                'price' => 890,
                'oldPrice' => 1050,
                'rating' => 4.9,
                'reviews' => 214,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Khagrachari',
                'stock' => 50,
                'sku' => 'KO-HONEY-03',
                'image' => '/images/prod-honey.jpg',
                'badge' => 'Best Seller',
                'description' => 'কেওক্রাডং ও সাজেকের গভীর ক্যানোপি অরণ্যের বুনো মৌচাক থেকে আদিবাসী মৌয়ালদের সংগৃহীত কাঁচা, অপরিশোধিত খাঁটি পাহাড়ি মধু।',
                'specs' => [
                    'সংগ্রহ অঞ্চল' => 'সাজেক ও কেওক্রাডং রিজার্ভ ফরেস্ট',
                    'বিশুদ্ধতা' => '১০০% কাঁচা, অপরিশোধিত ও হিটিংমুক্ত',
                    'পরিমাণ' => '৫০০ গ্রাম কাঁচের জার'
                ]
            ],
            [
                'id' => 'pure-hill-beeswax',
                'name' => 'Natural Hill Beeswax Block (খাঁটি পাহাড়ি মৌচাকের মোম)',
                'category' => 'মধু ও মৌচাকজাত পণ্য',
                'subcategory' => 'মোম',
                'price' => 320,
                'oldPrice' => 380,
                'rating' => 4.7,
                'reviews' => 39,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Bandarban',
                'stock' => 30,
                'sku' => 'KO-WAX-04',
                'image' => '/images/prod-honey.jpg',
                'badge' => 'Pure Natural',
                'description' => 'প্রাকৃতিক পাহাড়ি মৌচাকের মধু সংগ্রহের পর ফিল্টার করা খাঁটি ও প্রাকৃতিক সুবাসযুক্ত মৌচাকের মোম। স্কিনকেয়ার ও মোমবাতির জন্য উপযোগী।',
                'specs' => [
                    'উপাদান' => '১০০% বিশুদ্ধ মোম',
                    'ওজন' => '২০০ গ্রাম সলিড ব্লক'
                ]
            ],

            // 3. পাহাড়ি খাদ্য ও শুঁটকি (Hill Food & Delicacies)
            [
                'id' => 'spicy-bamboo-shoot-pickle',
                'name' => 'Spicy Hill Bamboo Shoot Pickle (পাহাড়ি বাঁশ কোড়ল আচার)',
                'category' => 'পাহাড়ি খাদ্য ও শুঁটকি',
                'subcategory' => 'বাঁশ কোড়ল (বাঁশের কোঁড়) ও আচার',
                'price' => 380,
                'oldPrice' => 450,
                'rating' => 4.9,
                'reviews' => 118,
                'vendor' => 'Hillside Gourmet',
                'location' => 'Rangamati',
                'stock' => 40,
                'sku' => 'FOOD-BS-01',
                'image' => '/images/prod-bamboo-shoot.jpg',
                'badge' => 'Indigenous Recipe',
                'description' => 'পাহাড়ের কচি তাজা বাঁশের কোঁড়ল (মেওয়া) দিয়ে মারমা পরিবারের ঐতিহ্যবাহী মশলায় তৈরি জিভে জল আনা সুস্বাদু পাহাড়ি আচার।',
                'specs' => [
                    'রেসিপি' => 'মারমা সনাতনী ঘরোয়া রেসিপি',
                    'তেল' => 'খাঁটি ঘানিভাঙা সরিষার তেল',
                    'ওজন' => '৩৫০ গ্রাম কাঁচের জার'
                ]
            ],
            [
                'id' => 'jhum-red-rice',
                'name' => 'Organic Jhum Red Rice (পাহাড়ি জুমের লাল চাল)',
                'category' => 'পাহাড়ি খাদ্য ও শুঁটকি',
                'subcategory' => 'পাহাড়ি চাল (জুমের চাল)',
                'price' => 280,
                'oldPrice' => 320,
                'rating' => 4.8,
                'reviews' => 76,
                'vendor' => 'Mawrum Indigenous Gathering Group',
                'location' => 'Bandarban',
                'stock' => 65,
                'sku' => 'FOOD-JR-02',
                'image' => '/images/prod-jhum-rice.jpg',
                'badge' => 'Nutritious',
                'description' => 'পাহাড়ের চূড়ায় বৃষ্টির জলে প্রাকৃতিকভাবে উৎপন্ন আদিবাসী জুমের পুষ্টিকর লাল চাল। আয়রন, ফাইবার ও খনিজে ভরপুর।',
                'specs' => [
                    'চাষের ধরন' => '১০০% রাসায়নিকমুক্ত আদিবাসী জুমচাষ',
                    'পুষ্টিগুণ' => 'লো-গ্লাইসেমিক ইনডেক্স ও উচ্চ ফাইবার',
                    'ওজন' => '১ কেজি বায়োডিগ্রেডেবল প্যাক'
                ]
            ],

            // 4. হস্তশিল্প (Handicrafts)
            [
                'id' => 'handwoven-bamboo-tote',
                'name' => 'Handwoven Bamboo Craft Tote (হাতে বোনা পাহাড়ি বাঁশের টোট ব্যাগ)',
                'category' => 'হস্তশিল্প',
                'subcategory' => 'বাঁশের তৈরি পণ্য (ঝুড়ি, টুপি, হাতপাখা, কলম দানি)',
                'price' => 1680,
                'oldPrice' => 1950,
                'rating' => 4.8,
                'reviews' => 96,
                'vendor' => 'Bandarban Cane Craft',
                'location' => 'Bandarban',
                'stock' => 24,
                'sku' => 'BC-TOTE-02',
                'image' => '/images/prod-bag.jpg',
                'badge' => 'Handmade',
                'description' => 'বান্দরবানের পাহাড়ি বাঁশের শক্ত বেত ও চামড়ার বেল্ট দিয়ে হাতে বোনা আধুনিক ও নান্দনিক ক্রাফট টোট ব্যাগ।',
                'specs' => [
                    'উপাদান' => 'রোদে শুকানো পাহাড়ি পাকা বাঁশ',
                    'হ্যান্ডেল' => 'ন্যাচারাল ভেজিটেবল লেদার স্ট্র্যাপ',
                    'বুনন শৈলী' => 'ডাবল ইন্টারলক হেরিংবোন বুনন'
                ]
            ],
            [
                'id' => 'terracotta-carved-vase',
                'name' => 'Terracotta Carved Tribal Vase (সাঙ্গু নদীর মাটির কারুকাজ করা ফুলদানি)',
                'category' => 'হস্তশিল্প',
                'subcategory' => 'মাটি ও সিরামিক পণ্য',
                'price' => 1250,
                'oldPrice' => 1450,
                'rating' => 4.7,
                'reviews' => 58,
                'vendor' => 'Marma Clay Studio',
                'location' => 'Bandarban',
                'stock' => 14,
                'sku' => 'MC-VASE-04',
                'image' => '/images/prod-vase.jpg',
                'badge' => 'Artisan Crafted',
                'description' => 'সাঙ্গু নদীর পলিমাটি দিয়ে চাকায় তৈরি এবং পাহাড়ি কাঠের চুলায় পোড়ানো ঐতিহ্যবাহী মাটির শোপিস ফুলদানি।',
                'specs' => [
                    'মাটি' => 'সাঙ্গু নদী অববাহিকার বিশেষ পাহাড়ি মাটি',
                    'ভাটি' => 'কাঠের ঐতিহ্যবাহী সনাতনী ভাটি',
                    'উচ্চতা' => '১০ ইঞ্চি হ্যান্ড-কার্ভড'
                ]
            ],

            // 5. ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র (Traditional Apparel & Handloom)
            [
                'id' => 'chakma-pinon-hadi',
                'name' => 'Chakma Handwoven Pinon & Hadi (চাকমা কোমর তাঁতে বোনা পিনন-হাদি)',
                'category' => 'ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র',
                'subcategory' => 'নারীদের পোশাক (থামি, পিনন, খাদি)',
                'price' => 4800,
                'oldPrice' => 5500,
                'rating' => 5.0,
                'reviews' => 42,
                'vendor' => 'Rangamati Weaves',
                'location' => 'Rangamati',
                'stock' => 12,
                'sku' => 'TEX-PINON-01',
                'image' => '/images/prod-pinon.jpg',
                'badge' => 'Master Weaver',
                'description' => 'চাকমা নারীদের ঐতিহ্যবাহী কোমর তাঁতে (বাইন) বোনা এক্সক্লুসিভ পিনন এবং হাদি। নিখুঁত চাবুকি ও আলমের জ্যামিতিক নকশায় অলংকৃত।',
                'specs' => [
                    'তাঁতের ধরন' => 'কোমর তাঁত (Backstrap Loom)',
                    'সুতা' => '১০০% অর্গানিক পাহাড়ি সুতি',
                    'রং' => 'গাঢ় নীল ও টেরাকোটা প্রাকৃতিক উদ্ভিজ্জ রং',
                    'কারিগর' => 'বাসন্তী চাকমা ও উইভিং গ্রুপ'
                ]
            ],
            [
                'id' => 'chakma-heritage-shawl',
                'name' => 'Chakma Heritage Shawl (ঐতিহ্যবাহী পাহাড়ি শাল ও চাদর)',
                'category' => 'ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র',
                'subcategory' => 'শাল ও চাদর',
                'price' => 2450,
                'oldPrice' => 2900,
                'rating' => 4.9,
                'reviews' => 132,
                'vendor' => 'Rangamati Weaves',
                'location' => 'Rangamati',
                'stock' => 18,
                'sku' => 'RW-SHAWL-01',
                'image' => '/images/prod-shawl.jpg',
                'badge' => 'Best Seller',
                'description' => 'শীত ও বসন্তের উপযোগী উষ্ণ ও আরামদায়ক পাহাড়ি চাদর। শতাব্দী প্রাচীন পাহাড়ি জ্যামিতিক নকশায় বোনা।',
                'specs' => [
                    'উপাদান' => '১০০% অর্গানিক পাহাড়ি তুলা',
                    'রং' => 'উদ্ভিজ্জ ও গাছের ছালের প্রাকৃতিক রং',
                    'সাইজ' => '৮৫ × ৪০ ইঞ্চি'
                ]
            ],
            [
                'id' => 'tribal-cushion-cover',
                'name' => 'Tribal Handloom Cushion Cover (তাঁতে বোনা পাহাড়ি কুশন কভার)',
                'category' => 'ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র',
                'subcategory' => 'বিছানার চাদর ও কুশন কভার',
                'price' => 950,
                'oldPrice' => 1200,
                'rating' => 4.7,
                'reviews' => 46,
                'vendor' => 'Tanchangya Textiles',
                'location' => 'Rangamati',
                'stock' => 22,
                'sku' => 'TEX-CUSH-03',
                'image' => '/images/prod-cushion.jpg',
                'badge' => 'Eco Living',
                'description' => 'লিভিং রুম ও সোফার জন্য পাহাড়ি কোমর তাঁতে বোনা ডাবল-পার্সেল পাহাড়ি কুশন কভার।',
                'specs' => [
                    'সেট' => '২ পিস সেট',
                    'সাইজ' => '১৬ × ১৬ ইঞ্চি',
                    'জিপার' => 'হিডেন প্রিমিয়াম মেটাল জিপার'
                ]
            ],

            // 6. গহনা ও অলংকার (Jewellery & Ornaments)
            [
                'id' => 'tribal-silver-hasuli',
                'name' => 'Traditional Tribal Silver Hasuli (খাঁটি রূপার পাহাড়ি হাসুলি নেকলেস ও দুল)',
                'category' => 'গহনা ও অলংকার',
                'subcategory' => 'রুপার গহনা',
                'price' => 7500,
                'oldPrice' => 8600,
                'rating' => 4.9,
                'reviews' => 34,
                'vendor' => 'Rangamati Weaves',
                'location' => 'Rangamati',
                'stock' => 8,
                'sku' => 'JWL-HASULI-01',
                'image' => '/images/prod-silver.jpg',
                'badge' => 'Authentic Silver',
                'description' => 'চাকমা ও মারমা ঐতিহ্যবাহী রূপার কারিগরদের হাতে খোদাই করা খাঁটি রূপার হাসুলি গলার হার ও ম্যাচিং কানের দুল।',
                'specs' => [
                    'ধাতু' => 'খাঁটি পাহাড়ি রূপা (Hill Silver)',
                    'কারিগর' => 'রাঙ্গামাটির রাজবাড়ি রোড সিলভার কারিগর',
                    'নকশা' => 'ঐতিহ্যবাহী মারমা ও চাকমা কারুকাজ'
                ]
            ],
            [
                'id' => 'ethnic-bead-necklace',
                'name' => 'Ethnic Hill Bead Necklace (রঙিন পাহাড়ি পুঁতির ঐতিহ্যবাহী মালা)',
                'category' => 'গহনা ও অলংকার',
                'subcategory' => 'পুঁতির মালা',
                'price' => 680,
                'oldPrice' => 850,
                'rating' => 4.8,
                'reviews' => 51,
                'vendor' => 'Marma Clay Studio',
                'location' => 'Bandarban',
                'stock' => 25,
                'sku' => 'JWL-BEAD-02',
                'image' => '/images/prod-silver.jpg',
                'badge' => 'Handmade',
                'description' => 'মারমা ও বম নারীদের বর্ণিল উৎসবের পাহাড়ি রঙিন পুঁতি দিয়ে হাতে গাঁথা দৃষ্টিনন্দন মাল্টি-লেয়ার মালা।',
                'specs' => [
                    'উপাদান' => 'ঐতিহ্যবাহী সিরামিক ও গ্লাস পুঁতি',
                    'দৈর্ঘ্য' => 'অ্যাডজাস্টেবল কটন থ্রেড'
                ]
            ],

            // 7. চা ও কফি (Hill Tea & Coffee)
            [
                'id' => 'bandarban-arabica-coffee',
                'name' => 'Bandarban Highland Roasted Arabica Coffee (বান্দরবান অ্যারাবিকা রোস্টেড কফি)',
                'category' => 'চা ও কফি',
                'subcategory' => 'পাহাড়ি কফি',
                'price' => 750,
                'oldPrice' => 880,
                'rating' => 4.9,
                'reviews' => 82,
                'vendor' => 'Bandarban Hills Coffee',
                'location' => 'Bandarban',
                'stock' => 35,
                'sku' => 'COF-BAND-01',
                'image' => '/images/prod-coffee.jpg',
                'badge' => 'Single Origin',
                'description' => 'বান্দরবানের ২,২০০ ফুট উঁচুতে ম্রো ও বম চাষীদের ফলানো সিঙ্গেল-অরিজিন প্রিমিয়াম অ্যারাবিকা হোল বিন রোস্টেড কফি। অসাধারণ চকোলেটি নোট ও ক্যারামেল ফ্লেভার।',
                'specs' => [
                    'উচ্চতা' => '২,২০০ ফুট সমুদ্রপৃষ্ঠ থেকে',
                    'রোস্ট প্রোফাইল' => 'মিডিয়াম-ডার্ক রোস্ট',
                    'ওজন' => '২৫০ গ্রাম এয়ারটাইট ক্রাফট পাউচ'
                ]
            ],
            [
                'id' => 'khagrachari-leaf-tea',
                'name' => 'Artisanal Hill Green & Black Leaf Tea (পাহাড়ি অর্গানিক হোল লিফ চা)',
                'category' => 'চা ও কফি',
                'subcategory' => 'পাহাড়ি চা',
                'price' => 640,
                'oldPrice' => 720,
                'rating' => 4.8,
                'reviews' => 168,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Khagrachari',
                'stock' => 45,
                'sku' => 'KO-TEA-06',
                'image' => '/images/prod-tea.jpg',
                'badge' => 'Whole Leaf',
                'description' => 'কুয়াশাচ্ছন্ন পাহাড়ি বাগানের কোমল দুটি পাতা একটি কুঁড়ি দিয়ে হাতে তৈরি বিশুদ্ধ পাহাড়ি গোটা পাতার ব্ল্যাক ও গ্রিন টি।',
                'specs' => [
                    'গ্রেড' => 'হোল লিফ গোল্ডেন টিপস',
                    'প্রক্রিয়াজাতকরণ' => 'হাতে রোল করা ও রোদে শুকানো',
                    'নেট ওজন' => '১৫০ গ্রাম মেটাল ক্যানিস্টার'
                ]
            ],

            // 8. ভেষজ ও প্রাকৃতিক পণ্য (Herbal & Natural)
            [
                'id' => 'forest-herbal-hair-body-oil',
                'name' => 'Cold-Pressed Forest Botanical Hair & Body Oil (পাহাড়ি ভেষজ তেল ও প্রাকৃতিক সাবান)',
                'category' => 'ভেষজ ও প্রাকৃতিক পণ্য',
                'subcategory' => 'ভেষজ তেল',
                'price' => 580,
                'oldPrice' => 690,
                'rating' => 4.9,
                'reviews' => 94,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Khagrachari',
                'stock' => 40,
                'sku' => 'HRB-OIL-01',
                'image' => '/images/prod-herbal.jpg',
                'badge' => '100% Herbal',
                'description' => 'পাহাড়ের বুনো আমলকী, হরিতকী, বহেড়া, নিম ও মেথি দিয়ে কাঠের ঘানিতে ভাঙানো কোল্ড-প্রেসড ভেষজ হেয়ার ও স্কিন অয়েল।',
                'specs' => [
                    'উপাদান' => '১২টি পাহাড়ি ভেষজ ও কোল্ড-প্রেসড তেল',
                    'কেমিক্যাল' => 'প্যারাবেন ও মিনারেল অয়েল মুক্ত',
                    'পরিমাণ' => '২০০ মিলি ড্রপার বোতল'
                ]
            ],
            [
                'id' => 'handmade-natural-botanical-soap',
                'name' => 'Artisan Handmade Forest Herbal Soap (পাহাড়ি বুনো ভেষজ হাতে তৈরি সাবান)',
                'category' => 'ভেষজ ও প্রাকৃতিক পণ্য',
                'subcategory' => 'প্রাকৃতিক সাবান ও স্কিনকেয়ার',
                'price' => 220,
                'oldPrice' => 260,
                'rating' => 4.8,
                'reviews' => 58,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Bandarban',
                'stock' => 50,
                'sku' => 'HRB-SOAP-02',
                'image' => '/images/prod-herbal.jpg',
                'badge' => 'Chemical-free',
                'description' => 'পাহাড়ি বুনো ল্যাভেন্ডার, নিম ও খাঁটি নারিকেল তেলে কোল্ড-প্রসেস পদ্ধতিতে তৈরি রাসায়নিকমুক্ত স্কিনকেয়ার বার সাবান।',
                'specs' => [
                    'ওজন' => '১১০ গ্রাম বার',
                    'সুবাস' => 'প্রাকৃতিক বনজ এসেনশিয়াল অয়েল'
                ]
            ],

            // 9. উপহার ও গিফট প্যাক (Gifts & Souvenirs)
            [
                'id' => 'hill-heritage-gift-box',
                'name' => 'Luxury Hill Heritage Gift Box (পাহাড়ি রাজকীয় প্রিমিয়াম গিফট হ্যাম্পার)',
                'category' => 'উপহার ও গিফট প্যাক',
                'subcategory' => 'গিফট বক্স',
                'price' => 2450,
                'oldPrice' => 2950,
                'rating' => 5.0,
                'reviews' => 38,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Rangamati',
                'stock' => 20,
                'sku' => 'GIFT-BOX-01',
                'image' => '/images/prod-giftbox.jpg',
                'badge' => 'Festive Edition',
                'description' => 'হাতে তৈরি সেগুন কাঠের বক্সে পাহাড়ি কাঁচা মধু (২৫০ গ্রাম), হোল লিফ পাহাড়ি চা ক্যানিস্টার, পাহাড়ি সুগন্ধি মসলা থলি এবং বাঁশের বুকমার্কের অনন্য উপহার সম্ভার।',
                'specs' => [
                    'বক্স' => 'কারুকাজ করা টেকসই কাঠের বক্স',
                    'উপহার সামগ্রী' => 'মধু + চা + মসলা + বুকমার্ক',
                    'প্যাকিং' => 'ন্যাচারাল জুট রশি ও গিফট ট্যাগ'
                ]
            ],
            [
                'id' => 'hill-artisan-souvenir-combo',
                'name' => 'Hill Traveler Souvenir & Trio Combo (পাহাড়ের স্মৃতি স্যুভেনির ও কম্বো প্যাক)',
                'category' => 'উপহার ও গিফট প্যাক',
                'subcategory' => 'কম্বো প্যাক (মধু + মসলা + চা)',
                'price' => 1490,
                'oldPrice' => 1750,
                'rating' => 4.9,
                'reviews' => 45,
                'vendor' => 'Bandarban Cane Craft',
                'location' => 'Bandarban',
                'stock' => 25,
                'sku' => 'GIFT-COMBO-02',
                'image' => '/images/prod-giftbox.jpg',
                'badge' => 'Souvenir Pick',
                'description' => 'পাহাড়ে ঘুরতে আসার স্মৃতি ধরে রাখতে বা প্রিয়জনকে উপহার দিতে খাঁটি পাহাড়ি পণ্যের ৩-ইন-১ কম্বো প্যাক।',
                'specs' => [
                    'উপাদান' => 'মধু, পাহাড়ি আদা ফ্লেক্স, পাহাড়ি গ্রিন টি',
                    'প্যাকিং' => 'ইকো-ফ্রেন্ডলি ক্রাফট বক্স'
                ]
            ],

            // 10. পাহাড়ি মসলা (Hill Spices)
            [
                'id' => 'hill-ginger-powder',
                'name' => 'Organic Hill Ginger (সাজেক ও খাগড়াছড়ির খাঁটি পাহাড়ি আদা)',
                'category' => 'পাহাড়ি মসলা',
                'subcategory' => 'Hill Ginger (আদা)',
                'price' => 380,
                'oldPrice' => 450,
                'rating' => 4.9,
                'reviews' => 48,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Khagrachari',
                'stock' => 35,
                'sku' => 'KO-GIN-01',
                'image' => '/images/cat-pantry.jpg',
                'badge' => 'Organic Spices',
                'description' => 'সাজেক ও খাগড়াছড়ির উঁচু পাহাড়ে প্রাকৃতিকভাবে ফলানো তীব্র ঝাঁঝালো ও সুগন্ধি খাঁটি পাহাড়ি আদা। ১০০% কেমিক্যালমুক্ত ও প্রাকৃতিক উপায়ে শুকানো।',
                'specs' => [
                    'উৎস' => 'সাজেক ভ্যালি ও দীঘিনালা পাহাড়',
                    'প্রক্রিয়া' => 'রোদে শুকানো ক্রাফট ফ্লেক্স ও গুঁড়ো',
                    'ওজন' => '২৫০ গ্রাম কাঁচের জার'
                ]
            ],
            [
                'id' => 'wild-hill-garlic',
                'name' => 'Wild Mountain Garlic (বান্দরবানের জুমের ছোট পাহাড়ি রসুন)',
                'category' => 'পাহাড়ি মসলা',
                'subcategory' => 'Wild Garlic (রসুন)',
                'price' => 490,
                'oldPrice' => 560,
                'rating' => 4.9,
                'reviews' => 36,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Bandarban',
                'stock' => 28,
                'sku' => 'KO-GAR-02',
                'image' => '/images/cat-pantry.jpg',
                'badge' => 'Best Seller',
                'description' => 'বান্দরবানের পাহাড়ি ঢালে জুম চাষের খাঁটি পাহাড়ি ছোট কোয়া বিশিষ্ট দেশি রসুন। অসাধারণ সুঘ্রাণ ও ঔষধি গুণসম্পন্ন।',
                'specs' => [
                    'উৎস' => 'রুমা রিজার্ভ ও কেওক্রাডং পাহাড়',
                    'জাত' => 'আদিবাসী পাহাড়ি ছোট কোয়া বিশিষ্ট দেশি রসুন',
                    'ওজন' => '৫০০ গ্রাম ইকো মেশ পাউচ'
                ]
            ],
            [
                'id' => 'forest-turmeric',
                'name' => 'Wild Forest Turmeric (বাঘাইছড়ি বনের খাঁটি বুনো হলুদ)',
                'category' => 'পাহাড়ি মসলা',
                'subcategory' => 'Forest Turmeric (হলুদ)',
                'price' => 320,
                'oldPrice' => 380,
                'rating' => 5.0,
                'reviews' => 64,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Rangamati',
                'stock' => 40,
                'sku' => 'KO-TUR-03',
                'image' => '/images/cat-pantry.jpg',
                'badge' => 'Handmade',
                'description' => 'গভীর পাহাড়ি বনাঞ্চল থেকে সংগৃহীত কাঁচা বুনো হলুদ রোদে শুকিয়ে ঢেঁকিতে ভাঙানো। প্রাকৃতিক কারকিউমিন সমৃদ্ধ গাঢ় সোনালী হলুদ।',
                'specs' => [
                    'উৎস' => 'বাঘাইছড়ি বনাঞ্চল, রাঙ্গামাটি',
                    'কারকিউমিন' => 'উচ্চ গ্রেড ৬.২% প্রাকৃতিক কারকিউমিন',
                    'ওজন' => '২০০ গ্রাম কাঁচের জার'
                ]
            ],
            [
                'id' => 'wild-black-pepper',
                'name' => 'Whole Black Pepper (পাহাড়ি অরণ্যের গোটা গোলমরিচ)',
                'category' => 'পাহাড়ি মসলা',
                'subcategory' => 'Black Pepper (গোলমরিচ)',
                'price' => 420,
                'oldPrice' => 490,
                'rating' => 4.9,
                'reviews' => 52,
                'vendor' => 'Khagrachari Organics',
                'location' => 'Rangamati',
                'stock' => 30,
                'sku' => 'KO-PEP-04',
                'image' => '/images/cat-pantry.jpg',
                'badge' => 'Pungent Aroma',
                'description' => 'পাহাড়ের গভীর জঙ্গলের গাছে পেঁচিয়ে ওঠা লতার প্রাকৃতিক গোটা কালো গোলমরিচ। প্রাকৃতিকভাবে শুকানো, তীব্র ঝাঁঝ ও মনমাতানো সুবাস।',
                'specs' => [
                    'উৎস' => 'আলীকদম ও কাপ্তাই রিজার্ভ ফরেস্ট',
                    'গুণমান' => '১০০% খাঁটি অরণ্যের গোটা কালো গোলমরিচ',
                    'ওজন' => '১৫০ গ্রাম কাঁচের বয়াম'
                ]
            ],
        ];
    }

    public static function getStats(): array
    {
        return [
            ['label' => 'Total Marketplace Revenue', 'value' => '৳ 4,82,500', 'delta' => '+18.2%'],
            ['label' => 'Total Orders Placed', 'value' => '1,284', 'delta' => '+12.4%'],
            ['label' => 'Active Approved Vendors', 'value' => '86', 'delta' => '+6'],
            ['label' => 'Hill Products Live', 'value' => '1,932', 'delta' => '+54'],
        ];
    }

    public static function getRecentOrders(): array
    {
        return [
            [
                'id' => '#PH-2481', 
                'customer' => 'Ayesha Rahman', 
                'phone' => '01712-384910',
                'district' => 'Dhaka',
                'address' => 'House 42, Road 11, Dhanmondi',
                'product' => 'Chakma Heritage Shawl', 
                'quantity' => 1,
                'total' => '৳ 2,450', 
                'payment' => 'Cash on Delivery',
                'date' => 'Oct 16, 2026',
                'status' => 'Delivered',
                'timeline' => [
                    ['title' => 'Order Placed', 'time' => 'Oct 14, 10:15 AM', 'done' => true],
                    ['title' => 'Verified by Rangamati Weaves', 'time' => 'Oct 14, 2:30 PM', 'done' => true],
                    ['title' => 'Dispatched via Hill Express', 'time' => 'Oct 15, 9:00 AM', 'done' => true],
                    ['title' => 'Delivered to Customer', 'time' => 'Oct 16, 1:45 PM', 'done' => true],
                ]
            ],
            [
                'id' => '#PH-2480', 
                'customer' => 'Tanvir Hasan', 
                'phone' => '01819-204918',
                'district' => 'Chittagong',
                'address' => 'GEC Circle, Nasirabad',
                'product' => 'Wild Forest Honey', 
                'quantity' => 1,
                'total' => '৳ 890', 
                'payment' => 'Cash on Delivery',
                'date' => 'Oct 15, 2026',
                'status' => 'Shipped',
                'timeline' => [
                    ['title' => 'Order Placed', 'time' => 'Oct 15, 11:30 AM', 'done' => true],
                    ['title' => 'Packed by Khagrachari Organics', 'time' => 'Oct 15, 4:00 PM', 'done' => true],
                    ['title' => 'In Transit to Chittagong Hub', 'time' => 'Oct 16, 8:20 AM', 'done' => true],
                    ['title' => 'Out for Delivery', 'time' => 'Pending', 'done' => false],
                ]
            ],
            [
                'id' => '#PH-2479', 
                'customer' => 'Mimi Chakma', 
                'phone' => '01552-309182',
                'district' => 'Rangamati',
                'address' => 'Tabalchhari, Rangamati Sadar',
                'product' => 'Bamboo Basket Collection', 
                'quantity' => 1,
                'total' => '৳ 2,750', 
                'payment' => 'Cash on Delivery',
                'date' => 'Oct 15, 2026',
                'status' => 'Processing',
                'timeline' => [
                    ['title' => 'Order Placed', 'time' => 'Oct 15, 03:10 PM', 'done' => true],
                    ['title' => 'Artisans Preparing Order', 'time' => 'Oct 16, 10:00 AM', 'done' => true],
                    ['title' => 'Quality Inspection', 'time' => 'In Progress', 'done' => false],
                    ['title' => 'Delivery Handover', 'time' => 'Pending', 'done' => false],
                ]
            ],
            [
                'id' => '#PH-2478', 
                'customer' => 'Arif Chowdhury', 
                'phone' => '01911-409182',
                'district' => 'Sylhet',
                'address' => 'Amberkhana, Sylhet',
                'product' => 'Hill Pattern Cushion Set', 
                'quantity' => 1,
                'total' => '৳ 1,980', 
                'payment' => 'Cash on Delivery',
                'date' => 'Oct 14, 2026',
                'status' => 'Delivered',
                'timeline' => [
                    ['title' => 'Order Placed', 'time' => 'Oct 13, 09:00 AM', 'done' => true],
                    ['title' => 'Packed by Rangamati Weaves', 'time' => 'Oct 13, 01:00 PM', 'done' => true],
                    ['title' => 'Dispatched via Hill Express', 'time' => 'Oct 14, 08:30 AM', 'done' => true],
                    ['title' => 'Delivered to Customer', 'time' => 'Oct 15, 04:15 PM', 'done' => true],
                ]
            ],
            [
                'id' => '#PH-2477', 
                'customer' => 'Nusrat Jahan', 
                'phone' => '01711-209182',
                'district' => 'Dhaka',
                'address' => 'Uttara Sector 7, Dhaka',
                'product' => 'Carved Terracotta Vase', 
                'quantity' => 1,
                'total' => '৳ 1,250', 
                'payment' => 'Cash on Delivery',
                'date' => 'Oct 16, 2026',
                'status' => 'Pending',
                'timeline' => [
                    ['title' => 'Order Placed', 'time' => 'Oct 16, 01:20 PM', 'done' => true],
                    ['title' => 'Awaiting Vendor Confirmation', 'time' => 'Pending', 'done' => false],
                    ['title' => 'Dispatched', 'time' => 'Pending', 'done' => false],
                    ['title' => 'Delivered', 'time' => 'Pending', 'done' => false],
                ]
            ],
            [
                'id' => '#PH-2476', 
                'customer' => 'Sajid Karim', 
                'phone' => '01812-409182',
                'district' => 'Rajshahi',
                'address' => 'Kazihata, Rajshahi',
                'product' => 'Honey & Tea Gift Duo', 
                'quantity' => 1,
                'total' => '৳ 1,450', 
                'payment' => 'Cash on Delivery',
                'date' => 'Oct 13, 2026',
                'status' => 'Shipped',
                'timeline' => [
                    ['title' => 'Order Placed', 'time' => 'Oct 13, 11:00 AM', 'done' => true],
                    ['title' => 'Packed by Khagrachari Organics', 'time' => 'Oct 13, 03:00 PM', 'done' => true],
                    ['title' => 'In Transit', 'time' => 'Oct 14, 09:30 AM', 'done' => true],
                    ['title' => 'Delivered', 'time' => 'Pending', 'done' => false],
                ]
            ],
        ];
    }

    public function home(): Response
    {
        $products = self::getProducts();
        $categories = self::getCategories();
        $vendors = self::getVendors();

        $bestSellers = array_values(array_filter($products, fn($p) => ($p['badge'] ?? '') === 'Best Seller' || $p['rating'] >= 4.9));
        $newArrivals = array_values(array_filter($products, fn($p) => in_array($p['badge'] ?? '', ['New', 'Handmade'])));

        $heroSlides = class_exists(\App\Models\HeroSlide::class)
            ? \App\Models\HeroSlide::where('is_active', true)->orderBy('order')->get()
            : [];

        return Inertia::render('Home', [
            'products' => $products,
            'categories' => $categories,
            'vendors' => $vendors,
            'bestSellers' => array_slice($bestSellers, 0, 4),
            'newArrivals' => array_slice($newArrivals, 0, 4),
            'heroSlides' => $heroSlides,
        ]);
    }

    public function shop(Request $request): Response
    {
        $products = self::getProducts();
        $categories = self::getCategories();
        $vendors = self::getVendors();

        return Inertia::render('Shop', [
            'products' => $products,
            'categories' => $categories,
            'vendors' => $vendors,
            'filters' => [
                'category' => $request->query('category'),
                'subcategory' => $request->query('subcategory'),
                'vendor' => $request->query('vendor'),
                'sort' => $request->query('sort', 'featured'),
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    public function show(string $id): Response
    {
        $products = self::getProducts();
        $vendors = self::getVendors();

        $product = collect($products)->firstWhere('id', $id) ?? $products[0];
        $vendor = collect($vendors)->firstWhere('name', $product['vendor']) ?? $vendors[0];

        $relatedProducts = array_values(array_filter($products, fn($p) => $p['id'] !== $product['id'] && $p['category'] === $product['category']));

        return Inertia::render('Product', [
            'product' => $product,
            'vendor' => $vendor,
            'relatedProducts' => array_slice($relatedProducts, 0, 4),
            'allProducts' => $products,
        ]);
    }

    public function checkout(): Response
    {
        return Inertia::render('Checkout', [
            'districts' => [
                'Dhaka', 'Chittagong', 'Rangamati', 'Bandarban', 'Khagrachari', 
                'Cox\'s Bazar', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Mymensingh', 'Rangpur', 'Comilla', 'Gazipur', 'Narayanganj'
            ],
        ]);
    }

    public function trackOrder(Request $request): Response
    {
        $orderId = $request->query('order', '#PH-2481');
        $orders = self::getRecentOrders();
        $matched = collect($orders)->firstWhere('id', $orderId) ?? $orders[0];

        return Inertia::render('OrderTracking', [
            'selectedOrder' => $matched,
            'recentOrders' => $orders,
        ]);
    }

    public function becomeVendor(): Response
    {
        return Inertia::render('BecomeVendor', [
            'categories' => self::getCategories(),
            'districts' => [
                'Rangamati', 'Bandarban', 'Khagrachari', 'Dhaka', 'Chittagong', 
                'Cox\'s Bazar', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Mymensingh', 'Rangpur', 'Comilla'
            ],
            'tribes' => ['Chakma', 'Marma', 'Tripura', 'Tanchangya', 'Bawm', 'Pangkhua', 'Mro', 'Khumi', 'Lushei', 'Other Indigenous Community'],
        ]);
    }

    public function dashboard(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => self::getStats(),
            'topProducts' => self::getProducts(),
            'recentOrders' => self::getRecentOrders(),
            'vendors' => self::getVendors(),
            'vendorApplications' => self::getVendorApplications(),
            'categories' => self::getCategories(),
            'categoryRequests' => self::getCategoryRequests(),
            'dynamicFields' => self::getDynamicFields(),
            'withdrawalRequests' => self::getWithdrawalRequests(),
            'units' => class_exists(\App\Models\Unit::class) ? \App\Models\Unit::orderBy('group')->get() : [],
            'attributes' => class_exists(\App\Models\Attribute::class) ? \App\Models\Attribute::with('values')->orderBy('name_en')->get() : [],
            'categoryAttributes' => class_exists(\App\Models\CategoryAttribute::class) ? \App\Models\CategoryAttribute::with('attribute.values')->get() : [],
            'attributeRequests' => class_exists(\App\Models\AttributeRequest::class) ? \App\Models\AttributeRequest::with('attribute')->orderByDesc('id')->get() : [],
            'heroSlides' => class_exists(\App\Models\HeroSlide::class) ? \App\Models\HeroSlide::orderBy('order')->get() : [],
        ]);
    }
}
