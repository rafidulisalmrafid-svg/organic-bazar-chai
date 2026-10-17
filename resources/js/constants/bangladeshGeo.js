// Bangladesh Divisions, Districts and Upazilas with Delivery Zone configurations

export const BANGLADESH_DIVISIONS = [
    {
        id: 'dhaka',
        name: 'ঢাকা (Dhaka)',
        bnName: 'ঢাকা',
        districts: [
            {
                id: 'dhaka-city',
                name: 'ঢাকা জেলা (Dhaka)',
                bnName: 'ঢাকা',
                isInsideDhaka: true,
                upazilas: [
                    'ধানমন্ডি (Dhanmondi)',
                    'গুলশান (Gulshan)',
                    'বনানী (Banani)',
                    'মিরপুর (Mirpur)',
                    'উত্তরা (Uttara)',
                    'মোহাম্মদপুর (Mohammadpur)',
                    'মতিঝিল (Motijheel)',
                    'বাড্ডা (Badda)',
                    'তেজগাঁও (Tejgaon)',
                    'লালবাগ (Lalbagh)',
                    'সাভার (Savar)',
                    'কেরানীগঞ্জ (Keraniganj)',
                    'ধামরাই (Dhamrai)',
                    'খিলগাঁও (Khilgaon)',
                    'যাত্রাবাড়ী (Jatrabari)'
                ]
            },
            {
                id: 'gazipur',
                name: 'গাজীপুর (Gazipur)',
                bnName: 'গাজীপুর',
                isInsideDhaka: false,
                upazilas: ['গাজীপুর সদর', 'টঙ্গী', 'কালিয়াকৈর', 'শ্রীপুর', 'কাপাসিয়া']
            },
            {
                id: 'narayanganj',
                name: 'নারায়ণগঞ্জ (Narayanganj)',
                bnName: 'নারায়ণগঞ্জ',
                isInsideDhaka: false,
                upazilas: ['নারায়ণগঞ্জ সদর', 'সিদ্ধিরগঞ্জ', 'ফতুল্লা', 'বন্দর', 'রূপগঞ্জ', 'সোনারগাঁও']
            },
            {
                id: 'manikganj',
                name: 'মানিকগঞ্জ (Manikganj)',
                bnName: 'মানিকগঞ্জ',
                isInsideDhaka: false,
                upazilas: ['মানিকগঞ্জ সদর', 'সিংগাইর', 'সাটুরিয়া', 'শিবালয়']
            },
            {
                id: 'narsingdi',
                name: 'নরসিংদী (Narsingdi)',
                bnName: 'নরসিংদী',
                isInsideDhaka: false,
                upazilas: ['নরসিংদী সদর', 'পলাশ', 'বেলাব', 'রায়পুরা', 'শিবপুর']
            },
            {
                id: 'munshiganj',
                name: 'মুন্সীগঞ্জ (Munshiganj)',
                bnName: 'মুন্সীগঞ্জ',
                isInsideDhaka: false,
                upazilas: ['মুন্সীগঞ্জ সদর', 'সিরাজদিখান', 'শ্রীনগর', 'গজারিয়া', 'টঙ্গীবাড়ি']
            },
            {
                id: 'tangail',
                name: 'টাঙ্গাইল (Tangail)',
                bnName: 'টাঙ্গাইল',
                isInsideDhaka: false,
                upazilas: ['টাঙ্গাইল সদর', 'মির্জাপুর', 'কালিহাতী', 'মধুপুর', 'ঘাটাইল', 'সখিপুর']
            }
        ]
    },
    {
        id: 'chattogram',
        name: 'চট্টগ্রাম (Chattogram)',
        bnName: 'চট্টগ্রাম',
        districts: [
            {
                id: 'rangamati',
                name: 'রাঙ্গামাটি (Rangamati - পার্বত্য জেলা)',
                bnName: 'রাঙ্গামাটি',
                isHillTract: true,
                upazilas: [
                    'রাঙ্গামাটি সদর',
                    'সাজেক ভ্যালি (বাঘাইছড়ি)',
                    'কাপ্তাই (Kaptai)',
                    'বরকল (Barkal)',
                    'জুরাছড়ি (Jurachhari)',
                    'বিলাইছড়ি (Belaichhari)',
                    'নানিয়ারচর (Naniarchar)',
                    'রাজস্থলী (Rajasthali)',
                    'লংগদু (Longadu)',
                    'কাউখালী (Kaukhali)'
                ]
            },
            {
                id: 'bandarban',
                name: 'বান্দরবান (Bandarban - পার্বত্য জেলা)',
                bnName: 'বান্দরবান',
                isHillTract: true,
                upazilas: [
                    'বান্দরবান সদর',
                    'রুমা (Ruma / Keokradong)',
                    'রোয়াংছড়ি (Rowangchhari)',
                    'থানচি (Thanchi / Nafakhum)',
                    'লামা (Lama)',
                    'আলীকদম (Alikadam)',
                    'নাইক্ষ্যংছড়ি (Naikhongchhari)'
                ]
            },
            {
                id: 'khagrachari',
                name: 'খাগড়াছড়ি (Khagrachari - পার্বত্য জেলা)',
                bnName: 'খাগড়াছড়ি',
                isHillTract: true,
                upazilas: [
                    'খাগড়াছড়ি সদর',
                    'দীঘিনালা (Dighinala)',
                    'পানছড়ি (Panchhari)',
                    'মাটিরাঙ্গা (Matiranga)',
                    'মহালছড়ি (Mahalchhari)',
                    'মানিকছড়ি (Manikchhari)',
                    'রামগড় (Ramgarh)',
                    'লক্ষ্মীছড়ি (Lakshmichhari)',
                    'গুইমারা (Guimara)'
                ]
            },
            {
                id: 'ctg-city',
                name: 'চট্টগ্রাম জেলা (Chattogram)',
                bnName: 'চট্টগ্রাম',
                isChittagongZone: true,
                upazilas: [
                    'কোতোয়ালী',
                    'পাঁচলাইশ',
                    'খুলশী',
                    'আগ্রাবাদ',
                    'হালিশহর',
                    'চকবাজার',
                    'পটিয়া',
                    'সীতাকুণ্ড',
                    'হাটহাজারী',
                    'ফটিকছড়ি',
                    'মীরসরাই',
                    'চন্দনাইশ',
                    'আনোয়ারা',
                    'বোয়ালখালী'
                ]
            },
            {
                id: 'coxsbazar',
                name: 'কক্সবাজার (Cox\'s Bazar)',
                bnName: 'কক্সবাজার',
                isChittagongZone: true,
                upazilas: ['কক্সবাজার সদর', 'টেকনাফ', 'উখিয়া', 'চকরিয়া', 'মহেশখালী', 'রামু', 'পেকুয়া']
            },
            {
                id: 'comilla',
                name: 'কুমিল্লা (Cumilla)',
                bnName: 'কুমিল্লা',
                upazilas: ['কুমিল্লা সদর', 'লাকসাম', 'দাউদকান্দি', 'চৌদ্দগ্রাম', 'দেবীদ্বার', 'বুড়িচং']
            },
            {
                id: 'noakhali',
                name: 'নোয়াখালী (Noakhali)',
                bnName: 'নোয়াখালী',
                upazilas: ['নোয়াখালী সদর', 'বেগমগঞ্জ', 'চাটখিল', 'কোম্পানীগঞ্জ', 'সেনবাগ', 'হাতিয়া']
            },
            {
                id: 'feni',
                name: 'ফেনী (Feni)',
                bnName: 'ফেনী',
                upazilas: ['ফেনী সদর', 'দাগনভূঞা', 'সোনাগাজী', 'ছাগলনাইয়া', 'পরশুরাম']
            }
        ]
    },
    {
        id: 'sylhet',
        name: 'সিলেট (Sylhet)',
        bnName: 'সিলেট',
        districts: [
            {
                id: 'sylhet-city',
                name: 'সিলেট জেলা (Sylhet)',
                bnName: 'সিলেট',
                upazilas: ['সিলেট সদর', 'শাহপরান', 'জালালাবাদ', 'গোয়াইনঘাট (জাফলং)', 'জৈন্তাপুর', 'বিয়ানীবাজার', 'গোলাপগঞ্জ', 'ওসমানীনগর']
            },
            {
                id: 'moulvibazar',
                name: 'মৌলভীবাজার (Moulvibazar / Sreemangal)',
                bnName: 'মৌলভীবাজার',
                upazilas: ['মৌলভীবাজার সদর', 'শ্রীমঙ্গল (চা বাগান অঞ্চল)', 'কমলগঞ্জ', 'কুলাউড়া', 'বড়লেখা']
            },
            {
                id: 'habiganj',
                name: 'হবিগঞ্জ (Habiganj)',
                bnName: 'হবিগঞ্জ',
                upazilas: ['হবিগঞ্জ সদর', 'মাধবপুর', 'বাহুবল', 'চুনারুঘাট', 'নবীগঞ্জ']
            },
            {
                id: 'sunamganj',
                name: 'সুনামগঞ্জ (Sunamganj)',
                bnName: 'সুনামগঞ্জ',
                upazilas: ['সুনামগঞ্জ সদর', 'তাহিরপুর (টাঙ্গুয়ার হাওড়)', 'জগন্নাথপুর', 'দোয়ারাবাজার']
            }
        ]
    },
    {
        id: 'rajshahi',
        name: 'রাজশাহী (Rajshahi)',
        bnName: 'রাজশাহী',
        districts: [
            {
                id: 'rajshahi-city',
                name: 'রাজশাহী জেলা (Rajshahi)',
                bnName: 'রাজশাহী',
                upazilas: ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'শাহ মখদুম', 'বাঘা', 'চারঘাট', 'পুঠিয়া', 'তানোর', 'গোদাগাড়ী']
            },
            {
                id: 'bogra',
                name: 'বগুড়া (Bogura)',
                bnName: 'বগুড়া',
                upazilas: ['বগুড়া সদর', 'শেরপুর', 'শিবগঞ্জ', 'দুপচাঁচিয়া', 'গাবতলী', 'শাজাহানপুর']
            },
            {
                id: 'pabna',
                name: 'পাবনা (Pabna)',
                bnName: 'পাবনা',
                upazilas: ['পাবনা সদর', 'ঈশ্বরদী', 'সাঁথিয়া', 'সুজানগর', 'চাটমোহর']
            },
            {
                id: 'natore',
                name: 'নাটোর (Natore)',
                bnName: 'নাটোর',
                upazilas: ['নাটোর সদর', 'সিংড়া', 'বড়াইগ্রাম', 'গুরুদাসপুর', 'লালপুর']
            }
        ]
    },
    {
        id: 'khulna',
        name: 'খুলনা (Khulna)',
        bnName: 'খুলনা',
        districts: [
            {
                id: 'khulna-city',
                name: 'খুলনা জেলা (Khulna)',
                bnName: 'খুলনা',
                upazilas: ['খুলনা সদর', 'সোনাডাঙ্গা', 'খালিশপুর', 'দৌলতপুর', 'রূপসা', 'ডুমুরিয়া', 'দাকোপ', 'কয়রা']
            },
            {
                id: 'jashore',
                name: 'যশোর (Jashore)',
                bnName: 'যশোর',
                upazilas: ['যশোর সদর', 'ঝিকরগাছা', 'অভয়নগর', 'মনিরামপুর', 'কেশবপুর', 'শার্শা']
            },
            {
                id: 'kushtia',
                name: 'কুষ্টিয়া (Kushtia)',
                bnName: 'কুষ্টিয়া',
                upazilas: ['কুষ্টিয়া সদর', 'কুমারখালী', 'ভেড়ামারা', 'মিরপুর', 'দৌলতপুর']
            },
            {
                id: 'satkhira',
                name: 'সাতক্ষীরা (Satkhira)',
                bnName: 'সাতক্ষীরা',
                upazilas: ['সাতক্ষীরা সদর', 'শ্যামনগর', 'কালিগঞ্জ', 'আশাশুনি', 'কলারোয়া']
            }
        ]
    },
    {
        id: 'barishal',
        name: 'বরিশাল (Barishal)',
        bnName: 'বরিশাল',
        districts: [
            {
                id: 'barishal-city',
                name: 'বরিশাল জেলা (Barishal)',
                bnName: 'বরিশাল',
                upazilas: ['বরিশাল সদর', 'বাকেরগঞ্জ', 'বানারীপাড়া', 'বাবুগঞ্জ', 'উজিরপুর', 'মেহেন্দীগঞ্জ', 'গৌরনদী']
            },
            {
                id: 'patuakhali',
                name: 'পটুয়াখালী (Patuakhali / Kuakata)',
                bnName: 'পটুয়াখালী',
                upazilas: ['পটুয়াখালী সদর', 'কলাপাড়া (কুয়াকাটা)', 'বাউফল', 'গলাচিপা', 'দশমিনা']
            },
            {
                id: 'bhola',
                name: 'ভোলা (Bhola)',
                bnName: 'ভোলা',
                upazilas: ['ভোলা সদর', 'বোরহানউদ্দিন', 'চরফ্যাশন', 'দৌলতখান', 'লালমোহন']
            }
        ]
    },
    {
        id: 'rangpur',
        name: 'রংপুর (Rangpur)',
        bnName: 'রংপুর',
        districts: [
            {
                id: 'rangpur-city',
                name: 'রংপুর জেলা (Rangpur)',
                bnName: 'রংপুর',
                upazilas: ['রংপুর সদর', 'মিঠাপুকুর', 'পীরগঞ্জ', 'বদরগঞ্জ', 'গংগাচড়া', 'কাউনিয়া']
            },
            {
                id: 'dinajpur',
                name: 'দিনাজপুর (Dinajpur)',
                bnName: 'দিনাজপুর',
                upazilas: ['দিনাজপুর সদর', 'বিরামপুর', 'বীরগঞ্জ', 'পার্বতীপুর', 'ফুলবাড়ী']
            },
            {
                id: 'panchagarh',
                name: 'পঞ্চগড় (Panchagarh / Tentulia)',
                bnName: 'পঞ্চগড়',
                upazilas: ['পঞ্চগড় সদর', 'তেঁতুলিয়া (পাহাড়ি চা অঞ্চল)', 'বোদা', 'আটোয়ারী', 'দেবীগঞ্জ']
            }
        ]
    },
    {
        id: 'mymensingh',
        name: 'ময়মনসিংহ (Mymensingh)',
        bnName: 'ময়মনসিংহ',
        districts: [
            {
                id: 'mymensingh-city',
                name: 'ময়মনসিংহ জেলা (Mymensingh)',
                bnName: 'ময়মনসিংহ',
                upazilas: ['ময়মনসিংহ সদর', 'ত্রিশাল', 'মুক্তাগাছা', 'ভালুকা', 'ফুলবাড়িয়া', 'গৌরীপুর', 'নান্দাইল']
            },
            {
                id: 'sherpur',
                name: 'শেরপুর (Sherpur / Garo Hills)',
                bnName: 'শেরপুর',
                upazilas: ['শেরপুর সদর', 'ঝিনাইগাতী (গারো পাহাড়)', 'নালিতাবাড়ী', 'শ্রীবরদী', 'নকলা']
            },
            {
                id: 'netrokona',
                name: 'নেত্রকোণা (Netrokona / Birishiri)',
                bnName: 'নেত্রকোণা',
                upazilas: ['নেত্রকোণা সদর', 'দুর্গাপুর (বিরিশিরি চীনা মাটির পাহাড়)', 'কলমাকান্দা', 'কেন্দুয়া', 'বারহাট্টা']
            }
        ]
    }
];

export const COUPONS = {
    'PAHARIKA10': { code: 'PAHARIKA10', type: 'percentage', value: 10, label: '১০% ছাড় (Hill Welcome Offer)' },
    'HILLLOVE': { code: 'HILLLOVE', type: 'fixed', value: 100, label: '৳১০০ ফ্ল্যাট ছাড় (Special Tribal Craft discount)' },
    'FREESHIP': { code: 'FREESHIP', type: 'free_delivery', value: 0, label: 'ফ্রি ডেলিভারি কুপন' },
};

export function calculateDeliveryFee(divisionId, districtId, subtotal) {
    if (subtotal >= 2000) {
        return { fee: 0, zone: 'Free Shipping Threshold (৳২,০০০+)', isFree: true, days: '২-৩ দিন' };
    }

    if (districtId === 'dhaka-city') {
        return { fee: 60, zone: 'ঢাকার ভেতরে (Inside Dhaka)', isFree: false, days: '২-৩ দিন' };
    }

    if (['rangamati', 'bandarban', 'khagrachari', 'ctg-city', 'coxsbazar'].includes(districtId)) {
        return { fee: 80, zone: 'চট্টগ্রাম ও পার্বত্য চট্টগ্রাম জেলা', isFree: false, days: '২-৩ দিন' };
    }

    return { fee: 120, zone: 'ঢাকার বাইরে ও সারা বাংলাদেশ', isFree: false, days: '৩-৫ দিন' };
}
