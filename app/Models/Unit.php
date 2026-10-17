<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_bn',
        'short_code',
        'group',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
