<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'title_bn',
        'title_en',
        'subtitle_bn',
        'subtitle_en',
        'badge_bn',
        'badge_en',
        'image_url',
        'button_text_bn',
        'button_text_en',
        'button_link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
