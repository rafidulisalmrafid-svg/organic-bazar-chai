<?php

use App\Http\Controllers\AdminAttributeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VendorProductController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AdminHeroSlideController;

// Public Storefront Pages
Route::get('/', [ProductController::class, 'home'])->name('home');
Route::get('/shop', [ProductController::class, 'shop'])->name('shop');
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
Route::get('/checkout', [ProductController::class, 'checkout'])->name('checkout');
Route::get('/track-order', [ProductController::class, 'trackOrder'])->name('track.order');
Route::get('/become-a-vendor', [ProductController::class, 'becomeVendor'])->name('vendor.register');
Route::get('/dashboard', [ProductController::class, 'dashboard'])->name('dashboard');

// Admin - Unit Management
Route::prefix('admin')->group(function () {
    Route::get('/units', [AdminAttributeController::class, 'indexUnits'])->name('admin.units.index');
    Route::post('/units', [AdminAttributeController::class, 'storeUnit'])->name('admin.units.store');
    Route::put('/units/{id}', [AdminAttributeController::class, 'updateUnit'])->name('admin.units.update');
    Route::delete('/units/{id}', [AdminAttributeController::class, 'destroyUnit'])->name('admin.units.destroy');

    // Admin - Attribute & Value Management
    Route::get('/attributes', [AdminAttributeController::class, 'indexAttributes'])->name('admin.attributes.index');
    Route::post('/attributes', [AdminAttributeController::class, 'storeAttribute'])->name('admin.attributes.store');
    Route::put('/attributes/{id}', [AdminAttributeController::class, 'updateAttribute'])->name('admin.attributes.update');
    Route::delete('/attributes/{id}', [AdminAttributeController::class, 'destroyAttribute'])->name('admin.attributes.destroy');
    Route::post('/attributes/{id}/values', [AdminAttributeController::class, 'storeValue'])->name('admin.attributes.values.store');
    Route::put('/attributes/values/{id}', [AdminAttributeController::class, 'updateValue'])->name('admin.attributes.values.update');
    Route::delete('/attributes/values/{id}', [AdminAttributeController::class, 'destroyValue'])->name('admin.attributes.values.destroy');

    // Admin - Category Attribute Mapping
    Route::get('/category-attributes', [AdminAttributeController::class, 'indexMappings'])->name('admin.category.attributes.index');
    Route::post('/category-attributes', [AdminAttributeController::class, 'storeMapping'])->name('admin.category.attributes.store');

    // Admin - Vendor Attribute Requests
    Route::get('/attribute-requests', [AdminAttributeController::class, 'indexRequests'])->name('admin.attribute.requests.index');
    Route::put('/attribute-requests/{id}/status', [AdminAttributeController::class, 'updateRequestStatus'])->name('admin.attribute.requests.status');

    // Admin - Hero Slides Management
    Route::get('/hero-slides', [AdminHeroSlideController::class, 'index'])->name('admin.hero-slides.index');
    Route::post('/hero-slides', [AdminHeroSlideController::class, 'store'])->name('admin.hero-slides.store');
    Route::post('/hero-slides/{id}', [AdminHeroSlideController::class, 'update'])->name('admin.hero-slides.update');
    Route::delete('/hero-slides/{id}', [AdminHeroSlideController::class, 'destroy'])->name('admin.hero-slides.destroy');
    Route::patch('/hero-slides/{id}/toggle', [AdminHeroSlideController::class, 'toggleStatus'])->name('admin.hero-slides.toggle');
    Route::post('/hero-slides-reorder', [AdminHeroSlideController::class, 'reorder'])->name('admin.hero-slides.reorder');
});

// Vendor - Product Wizard, Duplication, Inline Edit, Bulk Upload, Requests
Route::prefix('vendor')->group(function () {
    Route::post('/products', [VendorProductController::class, 'store'])->name('vendor.products.store');
    Route::patch('/products/{id}/quick-update', [VendorProductController::class, 'quickUpdate'])->name('vendor.products.quick-update');
    Route::post('/products/{id}/duplicate', [VendorProductController::class, 'duplicate'])->name('vendor.products.duplicate');
    Route::delete('/products/{id}', [VendorProductController::class, 'destroy'])->name('vendor.products.destroy');
    Route::get('/products/template', [VendorProductController::class, 'downloadTemplate'])->name('vendor.products.template');
    Route::post('/products/bulk-upload', [VendorProductController::class, 'bulkUpload'])->name('vendor.products.bulk-upload');

    Route::post('/attribute-requests', [AdminAttributeController::class, 'storeRequest'])->name('vendor.attribute.requests.store');
});
