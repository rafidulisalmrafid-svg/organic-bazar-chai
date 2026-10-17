import {
    // Fashion & Apparel
    Shirt,
    ShoppingBag,
    Watch,
    Footprints,
    Scissors,
    Crown,
    Gem,
    Glasses,

    // Food, Spices & Agriculture
    Coffee,
    Apple,
    Utensils,
    Carrot,
    Fish,
    Leaf,
    Sprout,
    Wheat,
    Flame,
    Milk,
    Wine,
    Cookie,
    Soup,

    // Handicrafts, Art & Home
    TreePine,
    Flower2,
    Home,
    Lamp,
    Armchair,
    Bed,
    Paintbrush,
    Hammer,
    Feather,
    Palette,

    // Beauty, Health & Wellness
    Sparkles,
    Heart,
    Smile,
    Droplet,
    Sun,
    Pill,
    Activity,

    // Electronics & Tech
    Smartphone,
    Laptop,
    Headphones,
    Camera,
    Zap,
    Battery,
    Tv,
    Radio,

    // Lifestyle, Gifts, Sports & Hill Specialty
    Baby,
    Gamepad2,
    Tent,
    Bike,
    Compass,
    Trophy,
    BookOpen,
    Music,
    Gift,
    Mountain,
    Tag,
    FolderTree,
    Store,
    Package,
    Star
} from 'lucide-react';

export const CATEGORY_ICON_GROUPS = [
    { id: 'all', label: 'সবগুলো আইকন' },
    { id: 'fashion', label: '👗 পোশাক ও ফ্যাশন' },
    { id: 'food', label: '🍯 খাদ্য, মসলা ও কৃষিজ' },
    { id: 'craft', label: '🏺 হস্তশিল্প ও গৃহসজ্জা' },
    { id: 'beauty', label: '✨ রূপচর্চা ও স্বাস্থ্য' },
    { id: 'tech', label: '📱 ইলেকট্রনিক্স ও গ্যাজেট' },
    { id: 'lifestyle', label: '🎁 উপহার ও লাইফস্টাইল' },
];

export const ALL_CATEGORY_ICONS = [
    // Fashion & Apparel
    { id: 'Shirt', label: 'পোশাক / শার্ট', group: 'fashion', tags: 'shirt cloth dress panjabi saree bastra' },
    { id: 'ShoppingBag', label: 'ব্যাগ ও পার্স', group: 'fashion', tags: 'bag purse tote shopping' },
    { id: 'Watch', label: 'ঘড়ি ও অ্যাক্সেসরিজ', group: 'fashion', tags: 'watch time accessories ghori' },
    { id: 'Footprints', label: 'জুতো ও স্যান্ডেল', group: 'fashion', tags: 'shoes sandals footwear juto' },
    { id: 'Scissors', label: 'টেইলারিং ও সুতা', group: 'fashion', tags: 'tailoring stitch sew thread' },
    { id: 'Crown', label: 'রয়্যাল / ব্রাইডাল', group: 'fashion', tags: 'crown royal wedding bridal biye' },
    { id: 'Gem', label: 'গহনা ও জুয়েলারি', group: 'fashion', tags: 'jewelry ornament gohona gem silver gold' },
    { id: 'Glasses', label: 'চশমা ও সানগ্লাস', group: 'fashion', tags: 'glasses eyewear choshma sunglasses' },

    // Food, Spices & Organics
    { id: 'Coffee', label: 'চা ও কফি', group: 'food', tags: 'tea coffee cha drink organic' },
    { id: 'Apple', label: 'ফলমূল ও তাজা খাবার', group: 'food', tags: 'fruit apple fresh food fol' },
    { id: 'Utensils', label: 'রান্না ও মসলাপাতি', group: 'food', tags: 'cooking kitchen utensils food mosla' },
    { id: 'Carrot', label: 'শাকসবজি ও কৃষি', group: 'food', tags: 'vegetables organic farming shobji krishi' },
    { id: 'Fish', label: 'শুটকি ও মাছ', group: 'food', tags: 'fish shutki dry fish mach' },
    { id: 'Leaf', label: 'ভেষজ ও অর্গানিক', group: 'food', tags: 'herbal organic leaf pata veshaja' },
    { id: 'Sprout', label: 'বীজ ও চারাগাছ', group: 'food', tags: 'seeds plant sprout chara' },
    { id: 'Wheat', label: 'শস্য ও ডাল', group: 'food', tags: 'grain wheat rice chal dal crops' },
    { id: 'Flame', label: 'ঝাল ও পাহাড়ি মসলা', group: 'food', tags: 'spice ginger garlic turmeric jhal morich' },
    { id: 'Milk', label: 'দুগ্ধজাত পণ্য', group: 'food', tags: 'dairy milk ghee butter dudh' },
    { id: 'Wine', label: 'জুস ও পানীয়', group: 'food', tags: 'beverage juice syrup drink' },
    { id: 'Cookie', label: 'স্ন্যাকস ও বেকারি', group: 'food', tags: 'snacks bakery biscuit cookies pitha' },
    { id: 'Soup', label: 'স্যুপ ও ঐতিহ্যবাহী খাবার', group: 'food', tags: 'soup tribal food delicacy' },

    // Handicrafts & Home
    { id: 'TreePine', label: 'বাঁশ ও বেতের কাজ', group: 'craft', tags: 'bamboo cane wood bash bet craft' },
    { id: 'Flower2', label: 'মাটির মৃৎশিল্প', group: 'craft', tags: 'pottery terracotta clay flower mati' },
    { id: 'Home', label: 'হোম ডেকর ও বাসা', group: 'craft', tags: 'home decor living house' },
    { id: 'Lamp', label: 'ল্যাম্প ও লাইটিং', group: 'craft', tags: 'lamp light bamboo lamp lighting' },
    { id: 'Armchair', label: 'আসবাবপত্র ও ফার্নিচার', group: 'craft', tags: 'furniture chair cane furniture' },
    { id: 'Bed', label: 'বিছানা ও চাদর', group: 'craft', tags: 'bedding bedsheet chador cushion' },
    { id: 'Paintbrush', label: 'চিত্রকর্ম ও ক্যানভাস', group: 'craft', tags: 'art painting canvas drawing' },
    { id: 'Hammer', label: 'কাঠের খোদাই শিল্প', group: 'craft', tags: 'wood carving woodwork tools' },
    { id: 'Feather', label: 'ঐতিহ্য ও কারুশিল্প', group: 'craft', tags: 'heritage feather tribal traditional' },
    { id: 'Palette', label: 'হাতে আঁকা ডিজাইন', group: 'craft', tags: 'art color design batik handpainted' },

    // Beauty & Health
    { id: 'Sparkles', label: 'সৌন্দর্য ও প্রসাধন', group: 'beauty', tags: 'beauty cosmetics skincare care glow' },
    { id: 'Heart', label: 'স্বাস্থ্য ও ফিটনেস', group: 'beauty', tags: 'health medical wellness shastho' },
    { id: 'Smile', label: 'স্কিনকেয়ার ও ফেসিয়াল', group: 'beauty', tags: 'skincare face smile grooming' },
    { id: 'Droplet', label: 'প্রাকৃতিক তেল ও এসেন্স', group: 'beauty', tags: 'oil mustard honey droplet drop' },
    { id: 'Sun', label: 'সানকেয়ার ও প্রাকৃতিক', group: 'beauty', tags: 'sun organic summer nature' },
    { id: 'Pill', label: 'আয়ুর্বেদিক ও ভেষজ', group: 'beauty', tags: 'ayurvedic medicine herbal pill osudh' },
    { id: 'Activity', label: 'সুস্থতা ও থেরাপি', group: 'beauty', tags: 'fitness energy wellness exercise' },

    // Tech & Electronics
    { id: 'Smartphone', label: 'স্মার্টফোন ও গ্যাজেট', group: 'tech', tags: 'mobile phone smartphone gadget' },
    { id: 'Laptop', label: 'কম্পিউটার ও ল্যাপটপ', group: 'tech', tags: 'laptop computer pc tech' },
    { id: 'Headphones', label: 'হেডফোন ও অডিও', group: 'tech', tags: 'sound audio music headphones' },
    { id: 'Camera', label: 'ক্যামেরা ও ফটোগ্রাফি', group: 'tech', tags: 'camera photo video' },
    { id: 'Zap', label: 'ইলেকট্রনিক্স সরঞ্জাম', group: 'tech', tags: 'power electric battery zap' },
    { id: 'Battery', label: 'ব্যাটারি ও চার্জার', group: 'tech', tags: 'battery charger power powerbank' },
    { id: 'Tv', label: 'স্মার্ট টিভি ও ডিসপ্লে', group: 'tech', tags: 'television monitor tv display' },
    { id: 'Radio', label: 'রেডিও ও স্পিকার', group: 'tech', tags: 'speaker bluetooth audio radio' },

    // Lifestyle & Gifts
    { id: 'Baby', label: 'শিশু ও বাচ্চাদের পণ্য', group: 'lifestyle', tags: 'baby kids toys bacha shishu' },
    { id: 'Gamepad2', label: 'খেলনা ও গেমিং', group: 'lifestyle', tags: 'gaming toys kids khelna game' },
    { id: 'Tent', label: 'ক্যাম্পিং ও ট্যুরিজম', group: 'lifestyle', tags: 'camping travel tent outdoor pahar sajek' },
    { id: 'Bike', label: 'সাইকেল ও রাইডিং', group: 'lifestyle', tags: 'cycle bike sports ride' },
    { id: 'Compass', label: 'ভ্রমণ ও অ্যাডভেঞ্চার', group: 'lifestyle', tags: 'travel tour adventure guide' },
    { id: 'Trophy', label: 'খেলাধুলা ও ট্রফি', group: 'lifestyle', tags: 'sports trophy winner award' },
    { id: 'BookOpen', label: 'বই ও স্টেশনারি', group: 'lifestyle', tags: 'books notebook literature boi' },
    { id: 'Music', label: 'বাদ্যযন্ত্র ও পাহাড়ি সুর', group: 'lifestyle', tags: 'flute musical instrument gaan music' },
    { id: 'Gift', label: 'উপহার ও কম্বো বক্স', group: 'lifestyle', tags: 'gift combo pack festival upohar' },
    { id: 'Mountain', label: 'পাহাড়ি খাঁটি পণ্য', group: 'lifestyle', tags: 'hill mountain pahar indigenous sajek' },
    { id: 'Tag', label: 'ডিসকাউন্ট ও অফার', group: 'lifestyle', tags: 'offer discount sale tag deal' },
    { id: 'FolderTree', label: 'শাখা ও সাব-ক্যাটাগরি', group: 'lifestyle', tags: 'tree category structure all' },
    { id: 'Store', label: 'দোকান ও ভেন্ডর পণ্য', group: 'lifestyle', tags: 'store shop vendor dokan' },
    { id: 'Package', label: 'প্যাকেজ ও পার্সেল', group: 'lifestyle', tags: 'parcel box delivery package' },
    { id: 'Star', label: 'স্পেশাল কালেকশন', group: 'lifestyle', tags: 'featured special star best' },
];

export const CATEGORY_ICON_MAP = {
    // Fashion
    Shirt,
    ShoppingBag,
    Watch,
    Footprints,
    Scissors,
    Crown,
    Gem,
    Glasses,

    // Food
    Coffee,
    Apple,
    Utensils,
    Carrot,
    Fish,
    Leaf,
    Sprout,
    Wheat,
    Flame,
    Milk,
    Wine,
    Cookie,
    Soup,

    // Craft
    TreePine,
    Flower2,
    Home,
    Lamp,
    Armchair,
    Bed,
    Paintbrush,
    Hammer,
    Feather,
    Palette,

    // Beauty
    Sparkles,
    Heart,
    Smile,
    Droplet,
    Sun,
    Pill,
    Activity,

    // Tech
    Smartphone,
    Laptop,
    Headphones,
    Camera,
    Zap,
    Battery,
    Tv,
    Radio,

    // Lifestyle
    Baby,
    Gamepad2,
    Tent,
    Bike,
    Compass,
    Trophy,
    BookOpen,
    Music,
    Gift,
    Mountain,
    Tag,
    FolderTree,
    Store,
    Package,
    Star
};

export const getLucideCategoryIcon = (iconName, fallback = FolderTree) => {
    if (!iconName) return fallback;
    if (typeof iconName !== 'string') return iconName;
    return CATEGORY_ICON_MAP[iconName] || fallback;
};
