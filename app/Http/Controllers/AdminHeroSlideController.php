<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HeroSlide;
use Illuminate\Support\Facades\Storage;

class AdminHeroSlideController extends Controller
{
    public function index()
    {
        $slides = HeroSlide::orderBy('order')->get();
        return response()->json(['slides' => $slides]);
    }

    private function handleImageUpload(Request $request): ?string
    {
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = 'hero_' . time() . '_' . uniqid() . '.' . $extension;

            // Save directly into public/uploads/hero
            $publicHeroDir = public_path('uploads/hero');
            if (!file_exists($publicHeroDir)) {
                mkdir($publicHeroDir, 0755, true);
            }
            $file->move($publicHeroDir, $filename);

            // Also mirror to storage/app/public/hero if possible
            $storageHeroDir = storage_path('app/public/hero');
            if (!file_exists($storageHeroDir)) {
                @mkdir($storageHeroDir, 0755, true);
            }
            @copy($publicHeroDir . DIRECTORY_SEPARATOR . $filename, $storageHeroDir . DIRECTORY_SEPARATOR . $filename);

            return '/uploads/hero/' . $filename;
        }

        // Support base64 upload if provided in image_url
        $rawUrl = $request->input('image_url');
        if (!empty($rawUrl) && preg_match('/^data:image\/(\w+);base64,/', $rawUrl, $matches)) {
            $extension = strtolower($matches[1]);
            if ($extension === 'jpeg') $extension = 'jpg';
            $base64Data = substr($rawUrl, strpos($rawUrl, ',') + 1);
            $decoded = base64_decode($base64Data);
            if ($decoded !== false) {
                $filename = 'hero_' . time() . '_' . uniqid() . '.' . $extension;
                $publicHeroDir = public_path('uploads/hero');
                if (!file_exists($publicHeroDir)) {
                    mkdir($publicHeroDir, 0755, true);
                }
                file_put_contents($publicHeroDir . DIRECTORY_SEPARATOR . $filename, $decoded);
                return '/uploads/hero/' . $filename;
            }
        }

        return null;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_bn' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle_bn' => 'nullable|string',
            'subtitle_en' => 'nullable|string',
            'badge_bn' => 'nullable|string|max:100',
            'badge_en' => 'nullable|string|max:100',
            'button_text_bn' => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,avif|max:15360',
        ]);

        $uploadedUrl = $this->handleImageUpload($request);
        $imageUrl = $uploadedUrl ?? ($validated['image_url'] ?? '/images/hero.jpg');

        $maxOrder = HeroSlide::max('order') ?? 0;

        $slide = HeroSlide::create([
            'title_bn' => $validated['title_bn'] ?? 'পাহাড়ের খাঁটি কারুশিল্প',
            'title_en' => $validated['title_en'] ?? 'Authentic Hill Crafts',
            'subtitle_bn' => $validated['subtitle_bn'] ?? 'রাঙ্গামাটি, বান্দরবান ও খাগড়াছড়ির আদিবাসী কারুশিল্প সম্ভার।',
            'subtitle_en' => $validated['subtitle_en'] ?? 'Handcrafted goods from verified artisan stores across the hill tracts.',
            'badge_bn' => $validated['badge_bn'] ?? '১০০% খাঁটি পাহাড়ি পণ্য',
            'badge_en' => $validated['badge_en'] ?? '100% Authentic Hill Products',
            'button_text_bn' => $validated['button_text_bn'] ?? 'পণ্য দেখুন',
            'button_text_en' => $validated['button_text_en'] ?? 'Shop Now',
            'button_link' => $validated['button_link'] ?? '/shop',
            'image_url' => $imageUrl,
            'order' => $maxOrder + 1,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'নতুন হিরো ব্যানার সফলভাবে তৈরি হয়েছে!',
            'slide' => $slide,
        ]);
    }

    public function update(Request $request, $id)
    {
        $slide = HeroSlide::findOrFail($id);

        $validated = $request->validate([
            'title_bn' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'subtitle_bn' => 'nullable|string',
            'subtitle_en' => 'nullable|string',
            'badge_bn' => 'nullable|string|max:100',
            'badge_en' => 'nullable|string|max:100',
            'button_text_bn' => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,avif|max:15360',
            'is_active' => 'nullable',
        ]);

        $uploadedUrl = $this->handleImageUpload($request);
        if ($uploadedUrl) {
            $slide->image_url = $uploadedUrl;
        } elseif (!empty($validated['image_url']) && !str_starts_with($validated['image_url'], 'data:image')) {
            $slide->image_url = $validated['image_url'];
        }

        if (isset($validated['title_bn'])) $slide->title_bn = $validated['title_bn'];
        if (isset($validated['title_en'])) $slide->title_en = $validated['title_en'];
        if (isset($validated['subtitle_bn'])) $slide->subtitle_bn = $validated['subtitle_bn'];
        if (isset($validated['subtitle_en'])) $slide->subtitle_en = $validated['subtitle_en'];
        if (isset($validated['badge_bn'])) $slide->badge_bn = $validated['badge_bn'];
        if (isset($validated['badge_en'])) $slide->badge_en = $validated['badge_en'];
        if (isset($validated['button_text_bn'])) $slide->button_text_bn = $validated['button_text_bn'];
        if (isset($validated['button_text_en'])) $slide->button_text_en = $validated['button_text_en'];
        if (isset($validated['button_link'])) $slide->button_link = $validated['button_link'];
        if (isset($validated['is_active'])) $slide->is_active = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);

        $slide->save();

        return response()->json([
            'success' => true,
            'message' => 'হিরো ব্যানার আপডেট সম্পন্ন হয়েছে!',
            'slide' => $slide,
        ]);
    }

    public function destroy($id)
    {
        $slide = HeroSlide::findOrFail($id);
        $slide->delete();

        return response()->json([
            'success' => true,
            'message' => 'হিরো ব্যানারটি সফলভাবে মুছে ফেলা হয়েছে!',
        ]);
    }

    public function toggleStatus($id)
    {
        $slide = HeroSlide::findOrFail($id);
        $slide->is_active = !$slide->is_active;
        $slide->save();

        return response()->json([
            'success' => true,
            'is_active' => $slide->is_active,
            'message' => 'স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে!',
        ]);
    }

    public function reorder(Request $request)
    {
        $orders = $request->input('orders', []); // [[id => 1, order => 1], ...]

        foreach ($orders as $item) {
            if (isset($item['id']) && isset($item['order'])) {
                HeroSlide::where('id', $item['id'])->update(['order' => (int)$item['order']]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'ব্যানারের ক্রম আপডেট হয়েছে!',
        ]);
    }
}
