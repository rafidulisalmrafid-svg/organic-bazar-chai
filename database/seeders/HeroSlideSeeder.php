<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HeroSlide;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        $slides = [
            [
                'order' => 1,
                'badge_bn' => '১০০% খাঁটি পাহাড়ি পণ্য',
                'badge_en' => '100% Authentic Hill Products',
                'title_bn' => 'পাহাড়ের খাঁটি কারুশিল্প সরাসরি আপনার ঘরে',
                'title_en' => 'Authentic Hill Crafts Direct to Your Door',
                'subtitle_bn' => 'রাঙ্গামাটি, বান্দরবান ও খাগড়াছড়ির আদিবাসী তাঁতি, মৌয়াল ও মৃৎশিল্পীদের শতবর্ষের ঐতিহ্যবাহী হস্তশিল্প ও প্রাকৃতিক খাদ্য সম্ভার।',
                'subtitle_en' => 'Centuries of indigenous weaving, pure forest honey and artisanal crafts from Chittagong Hill Tracts.',
                'image_url' => '/images/hero.jpg',
                'button_text_bn' => 'পণ্য দেখুন',
                'button_text_en' => 'Explore Marketplace',
                'button_link' => '/shop',
                'is_active' => true,
            ],
            [
                'order' => 2,
                'badge_bn' => 'ঐতিহ্যবাহী কোমর তাঁত',
                'badge_en' => 'Traditional Waist-Loom Weaves',
                'title_bn' => 'চাকমা ও তঞ্চঙ্গ্যাদের বোনা পিনন, হাদি ও শাল',
                'title_en' => 'Exquisite Indigenous Handloom & Textiles',
                'subtitle_bn' => 'প্রাকৃতিক রঙে রঞ্জিত সুতা এবং পাহাড়ের চিরন্তন মোটিফে বোনা খাঁটি শাল, থামি ও কুশন কাভার।',
                'subtitle_en' => 'Naturally dyed yarns and timeless tribal geometric motifs handcrafted by village artisan collectives.',
                'image_url' => '/images/cat-textiles.jpg',
                'button_text_bn' => 'তাঁতবস্ত্র দেখুন',
                'button_text_en' => 'Shop Handlooms',
                'button_link' => '/shop?category=ঐতিহ্যবাহী পোশাক ও তাঁতবস্ত্র',
                'is_active' => true,
            ],
            [
                'order' => 3,
                'badge_bn' => 'প্রাকৃতিক বনজ উপহার',
                'badge_en' => 'Pure Forest Harvest',
                'title_bn' => 'কেওক্রাডং ও সাজেকের বন্য কাঁচা পাহাড়ি মধু',
                'title_en' => 'Wild Canopy Honey & Hillside Harvests',
                'subtitle_bn' => 'গভীর অরণ্যের প্রাকৃতিক মৌচাক থেকে আদিবাসী মৌয়ালদের সংগৃহীত অপরিশোধিত ও হিটিংমুক্ত খাঁটি মধু।',
                'subtitle_en' => 'Unheated, raw forest honey harvested directly from high canopy beehives in deep reserve forests.',
                'image_url' => '/images/artisan.jpg',
                'button_text_bn' => 'মধু ও অর্গানিক পণ্য',
                'button_text_en' => 'Shop Organics',
                'button_link' => '/shop?category=মধু ও মৌচাকজাত পণ্য',
                'is_active' => true,
            ],
            [
                'order' => 4,
                'badge_bn' => 'টেকসই পরিবেশবান্ধব কারুশিল্প',
                'badge_en' => 'Eco-Friendly Bamboo Craft',
                'title_bn' => 'বান্দরবানের পাহাড়ি বাঁশ ও বেতের দৃষ্টিনন্দন সংগ্রহ',
                'title_en' => 'Artisanal Bamboo & Cane Living Craft',
                'subtitle_bn' => 'পাহাড়ের খাঁটি বাঁশ দিয়ে দক্ষ কারিগরদের হাতে তৈরি ঝুড়ি, ল্যাম্পশেড, মোড়া ও গৃহসজ্জা সামগ্রী।',
                'subtitle_en' => 'Sustainably harvested highland bamboo woven into modern home living accents and storage.',
                'image_url' => '/images/cat-bamboo.jpg',
                'button_text_bn' => 'বাঁশ ও বেতের পণ্য',
                'button_text_en' => 'Shop Bamboo',
                'button_link' => '/shop?category=বাঁশ ও বেত শিল্প',
                'is_active' => true,
            ],
        ];

        foreach ($slides as $data) {
            HeroSlide::updateOrCreate(
                ['order' => $data['order']],
                $data
            );
        }
    }
}
