<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AttributeRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_name',
        'vendor_id',
        'request_type',
        'name_en',
        'name_bn',
        'attribute_id',
        'category_id',
        'details',
        'status',
        'admin_note',
    ];

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }
}
