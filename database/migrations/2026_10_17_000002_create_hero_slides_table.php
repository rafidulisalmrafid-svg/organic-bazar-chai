<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title_bn')->nullable();
            $table->string('title_en')->nullable();
            $table->text('subtitle_bn')->nullable();
            $table->text('subtitle_en')->nullable();
            $table->string('badge_bn')->nullable();
            $table->string('badge_en')->nullable();
            $table->string('image_url');
            $table->string('button_text_bn')->default('পণ্য দেখুন');
            $table->string('button_text_en')->default('Shop Now');
            $table->string('button_link')->default('/shop');
            $table->integer('order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
