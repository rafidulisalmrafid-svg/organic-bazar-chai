<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'অর্গানিক বাজার চাই — Organic Hill & Farm Marketplace') }}</title>
    <meta name="description" content="খাঁটি অর্গানিক পণ্য, পাহাড়ি মধু, কৃষিজাত ফলমূল ও ঐতিহ্যবাহী হস্তশিল্পের বিশ্বস্ত মার্কেটপ্লেস — অর্গানিক বাজার চাই।">
    <link rel="icon" type="image/png" href="/images/logo.png">

    <!-- Fonts: Fraunces & Karla -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Inertia & Vite Assets -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="min-h-screen bg-[#FBF9F4] text-[#1C241E] font-sans antialiased selection:bg-[#C85A32] selection:text-white">
    @inertia
</body>
</html>
