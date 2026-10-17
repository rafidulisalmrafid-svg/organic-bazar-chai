import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Mountain, 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Store, 
    Users, 
    Settings, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Plus,
    Wallet,
    Sliders,
    FolderTree,
    Percent,
    Sparkles,
    ShieldCheck,
    Check,
    AlertCircle,
    Eye,
    Mail,
    Phone,
    MapPin,
    Lock,
    FileText,
    X,
    ExternalLink,
    Trash2,
    Edit2,
    Tag,
    FolderPlus,
    Search,
    Image as ImageIcon,
    Layers,
    GripVertical,
    ChevronDown,
    ChevronRight,
    ArrowUpDown,
    AlertTriangle,
    Globe,
    CornerDownRight,
    Shirt,
    TreePine,
    Coffee,
    Flower2,
    ArrowUp,
    ArrowDown,
    Star,
    Upload,
    RotateCcw,
    CreditCard,
    FileSpreadsheet,
    Download,
    Copy
} from 'lucide-react';
import { CartProvider } from '../context/CartContext';
import ProductWizardModal from '../Components/ProductWizardModal';
import AdminAttributeStudio from '../Components/AdminAttributeStudio';
import AdminHeroStudio from '../Components/AdminHeroStudio';
import VendorProductWizardModal from '../Components/VendorProductWizardModal';
import VendorAttributeRequestModal from '../Components/VendorAttributeRequestModal';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { 
    ALL_CATEGORY_ICONS, 
    CATEGORY_ICON_GROUPS, 
    CATEGORY_ICON_MAP, 
    getLucideCategoryIcon 
} from '../constants/categoryIcons';

const renderCategoryIcon = (iconName, className = "size-4") => {
    const Component = getLucideCategoryIcon(iconName);
    return <Component className={className} />;
};

export default function Dashboard({ 
    stats, 
    topProducts: initialProducts, 
    recentOrders: initialOrders, 
    vendors: initialVendors, 
    vendorApplications: initialApplications,
    categories: initialCategories,
    categoryRequests: initialCategoryRequests,
    dynamicFields,
    withdrawalRequests: initialWithdrawals,
    units: initialUnits = [],
    attributes: initialAttributes = [],
    categoryAttributes: initialCategoryAttributes = [],
    attributeRequests: initialDbAttributeRequests = [],
    heroSlides: initialHeroSlides = []
}) {
    const [panelType, setPanelType] = useState('admin');
    const [activeTab, setActiveTab] = useState(0);
    const { isBn, formatCurrency, formatNumber, t } = useLanguage();

    // State for live interactions
    const [products, setProducts] = useState(initialProducts);
    const [orders, setOrders] = useState(initialOrders);
    const [vendorApplications, setVendorApplications] = useState(initialApplications);
    const [withdrawalRequests, setWithdrawalRequests] = useState(initialWithdrawals);
    const [categories, setCategories] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('paharika_custom_categories_v2');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length >= (initialCategories?.length || 10)) return parsed;
                }
            }
        } catch (e) {}
        return initialCategories;
    });

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && categories && categories.length > 0) {
                localStorage.setItem('paharika_custom_categories_v2', JSON.stringify(categories));
            }
        } catch (e) {}
    }, [categories]);

    const [commissionRate, setCommissionRate] = useState(10);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isAttrRequestOpen, setIsAttrRequestOpen] = useState(false);
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [csvUploading, setCsvUploading] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [inlinePrice, setInlinePrice] = useState('');
    const [inlineStock, setInlineStock] = useState('');

    // Inline edit handler
    const handleSaveInline = async (pId) => {
        try {
            const res = await fetch(`/vendor/products/${pId}/quick-update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: Number(inlinePrice),
                    stock: Number(inlineStock)
                })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.map(p => p.id === pId ? { ...p, price: Number(inlinePrice), stock: Number(inlineStock) } : p));
                setEditingProductId(null);
            }
        } catch (e) {
            alert('ইনলাইন আপডেট ব্যর্থ: ' + e.message);
        }
    };

    // Duplicate product handler
    const handleDuplicateProduct = async (pId) => {
        try {
            const res = await fetch(`/vendor/products/${pId}/duplicate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => [data.product, ...prev]);
                alert('পণ্যটি সফলভাবে অনুলিপি (Duplicate) করা হয়েছে!');
            }
        } catch (e) {
            alert('ডুপ্লিকেট ব্যর্থ: ' + e.message);
        }
    };

    // Bulk upload CSV handler
    const handleBulkUploadSubmit = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('vendor_csv_file');
        if (!fileInput || !fileInput.files[0]) {
            alert('অনুগ্রহ করে একটি CSV ফাইল নির্বাচন করুন।');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        setCsvUploading(true);
        try {
            const res = await fetch('/vendor/products/bulk-upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setIsCsvModalOpen(false);
                window.location.reload();
            } else {
                alert('আপলোড ত্রুটি: ' + data.message);
            }
        } catch (err) {
            alert('ত্রুটি: ' + err.message);
        } finally {
            setCsvUploading(false);
        }
    };

    // Vendor Category Requests state
    const [categoryRequests, setCategoryRequests] = useState(initialCategoryRequests || [
        {
            id: 'req-1',
            vendorName: 'Rangamati Weaves',
            requestedCategory: 'Tribal Silver Jewellery (রূপার পাহাড়ি গহনা)',
            parentCategory: 'Handloom Textiles',
            reason: 'আমাদের ১৫ জন চাকমা রূপার কারিগর ঐতিহ্যবাহী হাসুলি, ঝুমকা ও বালা তৈরি করছেন।',
            status: 'Pending',
            date: 'Today, 11:20 AM'
        },
        {
            id: 'req-2',
            vendorName: 'Bandarban Cane Craft',
            requestedCategory: 'Hill Musical Instruments (বাঁশের বাঁশি ও দোতারা)',
            parentCategory: 'Bamboo & Cane',
            reason: 'মারমা ও বম বাঁশি কারিগরদের তৈরি খাঁটি পাহাড়ি বাঁশের বাঁশি বিক্রির জন্য আলাদা ক্যাটাগরি প্রয়োজন।',
            status: 'Pending',
            date: 'Yesterday'
        }
    ]);

    // Modal state for Vendor Review & Decision
    const [selectedAppForReview, setSelectedAppForReview] = useState(null);
    const [selectedAppForReject, setSelectedAppForReject] = useState(null);
    const [selectedAppForApprove, setSelectedAppForApprove] = useState(null);
    const [rejectReasonText, setRejectReasonText] = useState('NID ডকুমেন্ট অস্পষ্ট বা অসম্পূর্ণ');

    // Vendor balance & withdrawal state
    const [vendorBalance, setVendorBalance] = useState(42500);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('bKash');
    const [withdrawAccount, setWithdrawAccount] = useState('01712-XXXXXX');

    // Category Hub View Controls: 'tree' | 'cards' | 'requests'
    const [categoryStudioTab, setCategoryStudioTab] = useState('tree');
    const [categorySearch, setCategorySearch] = useState('');
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(true);
    const [expandedTreeNodes, setExpandedTreeNodes] = useState({ 'cat-1': true, 'cat-2': true, 'cat-3': true, 'cat-4': true });

    // Category Comprehensive Form State
    const [catForm, setCatForm] = useState({
        name: '',
        parentId: '', // '' = Root/Parent Category, else parent category name
        slug: '',
        icon: 'Shirt',
        image: '/images/cat-textiles.jpg',
        banner: '/images/hero.jpg',
        description: '',
        status: 'Active',
        order: (initialCategories?.length || 4) + 1,
        featured: true,
        commission: 10,
        seoTitle: '',
        seoDesc: '',
        subcategories: ['কোমর তাঁত শাল', 'পিনন ও হাদি'],
        subcatInput: '',
        showSeoFields: false,
        uploadedFileName: ''
    });

    // Image Input Modes: 'url' | 'upload'
    const [coverImageMode, setCoverImageMode] = useState('url');
    const [bannerImageMode, setBannerImageMode] = useState('url');
    const [editCoverImageMode, setEditCoverImageMode] = useState('url');
    const [editBannerImageMode, setEditBannerImageMode] = useState('url');

    const handleImageFileUpload = (file, targetField, isEdit = false) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে।');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) আপলোড করুন।');
            return;
        }

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            const dataUrl = uploadEvent.target?.result;
            if (isEdit) {
                setEditingCategory(prev => ({ 
                    ...prev, 
                    [targetField]: dataUrl,
                    [`${targetField}FileName`]: file.name 
                }));
            } else {
                setCatForm(prev => ({ 
                    ...prev, 
                    [targetField]: dataUrl,
                    [`${targetField}FileName`]: file.name 
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    // Inline Subcategory quick-add for existing categories
    const [activeInlineAddCat, setActiveInlineAddCat] = useState(null);
    const [inlineSubcatName, setInlineSubcatName] = useState('');

    // Category Icon Library State (50+ eCommerce icons)
    const [iconSearchQuery, setIconSearchQuery] = useState('');
    const [iconActiveGroup, setIconActiveGroup] = useState('all');
    const [isIconLibraryOpen, setIsIconLibraryOpen] = useState(false);
    const [isEditIconLibraryOpen, setIsEditIconLibraryOpen] = useState(false);

    // Edit Category Modal state
    const [editingCategory, setEditingCategory] = useState(null);
    const [editSubcatInput, setEditSubcatInput] = useState('');

    // Delete Guard Modal State (Blocks delete when products exist)
    const [deleteGuardModal, setDeleteGuardModal] = useState(null);

    const statusBadgeStyles = {
        Delivered: 'bg-primary/10 text-primary font-bold',
        Shipped: 'bg-[#8D5B36]/15 text-[#8D5B36] font-bold',
        Processing: 'bg-accent/10 text-accent font-bold',
        Pending: 'bg-muted text-muted-foreground font-bold',
    };

    // Approve vendor application & generate credentials
    const handleOpenApproveModal = (app) => {
        const tempPassword = `paharika_${app.id.replace(/[^a-zA-Z0-9]/g, '')}_${Math.floor(1000 + Math.random() * 9000)}`;
        const updatedApp = {
            ...app,
            status: 'Approved',
            tempPassword: app.tempPassword || tempPassword,
        };
        setVendorApplications(prev => prev.map(a => a.id === app.id ? updatedApp : a));
        setSelectedAppForApprove(updatedApp);
    };

    // Reject vendor application with reason
    const handleConfirmReject = (e) => {
        if (e) e.preventDefault();
        if (!selectedAppForReject) return;
        const reason = rejectReasonText.trim() || 'প্রয়োজনীয় তথ্যের অসঙ্গতি';
        setVendorApplications(prev => prev.map(a => a.id === selectedAppForReject.id ? { ...a, status: 'Rejected', rejectionReason: reason } : a));
        alert(`আবেদনটি বাতিল করা হয়েছে।\nভেন্ডরের ইমেইলে (${selectedAppForReject.email || 'applicant'}) বাতিলের কারণসহ নোটিফিকেশন পাঠানো হয়েছে।`);
        setSelectedAppForReject(null);
    };

    // Approve withdrawal payout
    const handleApproveWithdrawal = (id) => {
        setWithdrawalRequests(prev => prev.map(w => w.id === id ? { ...w, status: 'Approved' } : w));
        alert('উইথড্রয়াল পে-আউট অনুমোদন করা হয়েছে। ফান্ড ভেন্ডরের অ্যাকাউন্টে ট্রান্সফার হবে।');
    };

    // Update order status
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord));
    };

    // Vendor withdrawal submit
    const handleVendorWithdrawSubmit = (e) => {
        e.preventDefault();
        const amt = Number(withdrawAmount);
        if (!amt || amt <= 0 || amt > vendorBalance) {
            alert('অনুগ্রহ করে সঠিক পরিমাণ লিখুন (উত্তোলনযোগ্য ব্যালেন্সের মধ্যে)।');
            return;
        }

        const newReq = {
            id: '#WD-' + Math.floor(9000 + Math.random() * 1000),
            vendor: 'Rangamati Weaves',
            amount: `৳ ${amt.toLocaleString('en-IN')}`,
            method: `${withdrawMethod} (${withdrawAccount})`,
            date: 'Just Now',
            status: 'Pending'
        };

        setWithdrawalRequests([newReq, ...withdrawalRequests]);
        setVendorBalance(prev => prev - amt);
        setWithdrawAmount('');
        alert('উইথড্রয়াল রিকোয়েস্ট সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর ফান্ড পৌঁছাবে।');
    };

    // Slug generator utility
    const generateSlug = (text) => {
        return (text || '')
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Category Name change with auto-slug and SEO auto-fill
    const handleCatNameChange = (val) => {
        setCatForm(prev => ({
            ...prev,
            name: val,
            slug: generateSlug(val) || val.toLowerCase().replace(/\s+/g, '-'),
            seoTitle: val ? `${val} — পাহাড়ি ঐতিহ্যবাহী পণ্য | Paharika` : ''
        }));
    };

    // 1. Add Subcategory tag to creation form
    const handleAddSubcatTag = (e) => {
        if (e) e.preventDefault();
        const tag = (catForm.subcatInput || '').trim();
        if (!tag) return;
        if (catForm.subcategories.includes(tag)) {
            alert('এই সাব-ক্যাটাগরি ইতিমধ্যে তালিকায় রয়েছে।');
            return;
        }
        setCatForm(prev => ({
            ...prev,
            subcategories: [...prev.subcategories, tag],
            subcatInput: ''
        }));
    };

    const handleRemoveSubcatTag = (indexToRemove) => {
        setCatForm(prev => ({
            ...prev,
            subcategories: prev.subcategories.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    // 2. Create new Category or Sub-category
    const handleCreateCategorySubmit = (e) => {
        e.preventDefault();
        const trimmedName = catForm.name.trim();
        if (!trimmedName) {
            alert('অনুগ্রহ করে ক্যাটাগরির নাম লিখুন।');
            return;
        }

        // Check if creating as a Sub-category under a Parent Category
        if (catForm.parentId) {
            setCategories(prev => prev.map(c => {
                if (c.name === catForm.parentId || c.id === catForm.parentId) {
                    const subs = c.subcategories || [];
                    if (subs.includes(trimmedName)) {
                        alert(`"${trimmedName}" ইতিমধ্যে এই ক্যাটাগরিতে বিদ্যমান।`);
                        return c;
                    }
                    return {
                        ...c,
                        subcategories: [...subs, trimmedName]
                    };
                }
                return c;
            }));
            alert(`"${trimmedName}" সাব-ক্যাটাগরিটি "${catForm.parentId}"-এর অধীনে সফলভাবে তৈরি করা হয়েছে!`);
        } else {
            // Creating a Root Category
            if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
                alert('এই নামের ক্যাটাগরি ইতিমধ্যে তৈরি করা আছে। অন্য একটি নাম দিন।');
                return;
            }

            const newCategory = {
                id: 'cat-' + Date.now(),
                name: trimmedName,
                parentId: null,
                slug: catForm.slug || generateSlug(trimmedName) || 'hill-category',
                icon: catForm.icon || 'Shirt',
                image: catForm.image || '/images/cat-textiles.jpg',
                banner: catForm.banner || '/images/hero.jpg',
                description: catForm.description || `${trimmedName} - authentic indigenous crafted hill products.`,
                status: catForm.status || 'Active',
                order: Number(catForm.order) || (categories.length + 1),
                featured: Boolean(catForm.featured),
                commission: Number(catForm.commission) || 10,
                seoTitle: catForm.seoTitle || `${trimmedName} | Paharika`,
                seoDesc: catForm.seoDesc || `${trimmedName} collection made by hill artisans.`,
                count: 0,
                subcategories: catForm.subcategories.length > 0 ? catForm.subcategories : ['General']
            };

            setCategories([newCategory, ...categories]);
            alert(`মূল ক্যাটাগরি "${newCategory.name}" সফলভাবে তৈরি হয়েছে!`);
        }

        // Reset Form
        setCatForm({
            name: '',
            parentId: '',
            slug: '',
            icon: 'Shirt',
            image: '/images/cat-textiles.jpg',
            banner: '/images/hero.jpg',
            description: '',
            status: 'Active',
            order: categories.length + 2,
            featured: true,
            commission: 10,
            seoTitle: '',
            seoDesc: '',
            subcategories: [],
            subcatInput: '',
            showSeoFields: false
        });
    };

    // 3. Move Order (Up / Down)
    const handleMoveOrder = (catId, direction) => {
        setCategories(prev => {
            const index = prev.findIndex(c => (c.id === catId || c.name === catId));
            if (index === -1) return prev;
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= prev.length) return prev;
            const newArr = [...prev];
            const temp = newArr[index];
            newArr[index] = newArr[targetIndex];
            newArr[targetIndex] = temp;
            return newArr.map((item, idx) => ({ ...item, order: idx + 1 }));
        });
    };

    // 4. Toggle Status Active / Inactive
    const handleToggleCategoryStatus = (catId) => {
        setCategories(prev => prev.map(c => {
            if (c.id === catId || c.name === catId) {
                const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
                return { ...c, status: nextStatus };
            }
            return c;
        }));
    };

    // 5. Toggle Featured
    const handleToggleFeatured = (catId) => {
        setCategories(prev => prev.map(c => {
            if (c.id === catId || c.name === catId) {
                return { ...c, featured: !c.featured };
            }
            return c;
        }));
    };

    // 6. Delete Category with Safety Delete Guard (Blocks delete if products exist!)
    const handleDeleteCategoryWithGuard = (cat) => {
        if (cat.count && cat.count > 0) {
            setDeleteGuardModal({
                category: cat,
                count: cat.count,
                message: `"${cat.name}" ক্যাটাগরির অধীনে বর্তমানে ${cat.count} টি সক্রিয় পণ্য রয়েছে। পণ্য থাকা অবস্থায় ক্যাটাগরি ডিলিট করলে মার্কেটপ্লেসের পণ্যের ডেটাবেজ ও লিংক ক্ষতিগ্রস্ত হবে। ডিলিট করার পূর্বে পণ্যগুলোকে অন্য কোনো ক্যাটাগরিতে স্থানান্তর করুন।`
            });
            return;
        }

        if (!confirm(`আপনি কি "${cat.name}" ক্যাটাগরিটি মুছে ফেলতে চান? এর সকল সাব-ক্যাটাগরিও মুছে যাবে।`)) return;
        setCategories(prev => prev.filter(c => (c.id ? c.id !== cat.id : c.name !== cat.name)));
        alert(`"${cat.name}" ক্যাটাগরি মুছে ফেলা হয়েছে।`);
    };

    // 7. Add Subcategory inline to existing Category
    const handleAddSubcatToExisting = (catName, e) => {
        if (e) e.preventDefault();
        const tag = inlineSubcatName.trim();
        if (!tag) return;

        setCategories(prev => prev.map(c => {
            if (c.name === catName) {
                const existingSubs = c.subcategories || [];
                if (existingSubs.includes(tag)) {
                    alert('এই সাব-ক্যাটাগরি ইতিমধ্যে এই ক্যাটাগরিতে অন্তর্ভুক্ত আছে!');
                    return c;
                }
                return {
                    ...c,
                    subcategories: [...existingSubs, tag]
                };
            }
            return c;
        }));

        setInlineSubcatName('');
        setActiveInlineAddCat(null);
        alert(`"${catName}"-এ "${tag}" সাব-ক্যাটাগরি সফলভাবে যোগ করা হয়েছে!`);
    };

    // 8. Remove Subcategory from existing Category
    const handleRemoveSubcatFromExisting = (catName, subcatToRemove) => {
        if (!confirm(`আপনি কি "${subcatToRemove}" সাব-ক্যাটাগরি মুছে ফেলতে চান?`)) return;
        setCategories(prev => prev.map(c => {
            if (c.name === catName) {
                return {
                    ...c,
                    subcategories: (c.subcategories || []).filter(s => s !== subcatToRemove)
                };
            }
            return c;
        }));
    };

    // 9. Update Category in Edit Modal
    const handleSaveEditedCategory = (e) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.name.trim()) return;

        setCategories(prev => prev.map(c => (c.id && editingCategory.id ? c.id === editingCategory.id : c.name === editingCategory.originalName) ? {
            ...c,
            name: editingCategory.name.trim(),
            slug: editingCategory.slug || generateSlug(editingCategory.name),
            icon: editingCategory.icon || c.icon || 'Shirt',
            image: editingCategory.image,
            banner: editingCategory.banner || c.banner || '/images/hero.jpg',
            description: editingCategory.description || c.description,
            status: editingCategory.status || 'Active',
            order: Number(editingCategory.order) || c.order,
            featured: Boolean(editingCategory.featured),
            commission: Number(editingCategory.commission) || 10,
            seoTitle: editingCategory.seoTitle || c.seoTitle,
            seoDesc: editingCategory.seoDesc || c.seoDesc,
            subcategories: editingCategory.subcategories
        } : c));

        alert(`"${editingCategory.name}" ক্যাটাগরি আপডেট সম্পন্ন হয়েছে!`);
        setEditingCategory(null);
    };

    // 10. Vendor Category Request Handlers
    const handleApproveCategoryRequest = (req) => {
        const newCatName = req.requestedCategory;
        if (req.parentCategory) {
            setCategories(prev => prev.map(c => {
                if (c.name === req.parentCategory) {
                    return {
                        ...c,
                        subcategories: [...(c.subcategories || []), newCatName]
                    };
                }
                return c;
            }));
        } else {
            const newCat = {
                id: 'cat-' + Date.now(),
                name: newCatName,
                parentId: null,
                slug: generateSlug(newCatName) || 'requested-category',
                icon: 'Sparkles',
                image: '/images/cat-textiles.jpg',
                banner: '/images/hero.jpg',
                description: req.reason,
                status: 'Active',
                order: categories.length + 1,
                featured: true,
                count: 0,
                commission: 10,
                subcategories: []
            };
            setCategories(prev => [...prev, newCat]);
        }

        setCategoryRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
        alert(`"${newCatName}" ক্যাটাগরি অনুমোদন করে সাইটে যোগ করা হয়েছে এবং ${req.vendorName}-কে ইমেইলে কনফার্মেশন পাঠানো হয়েছে!`);
    };

    const handleRejectCategoryRequest = (reqId) => {
        setCategoryRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r));
        alert('ভেন্ডরের ক্যাটাগরি রিকোয়েস্ট বাতিল করা হয়েছে।');
    };

    // Navigation items
    const adminNav = [
        { icon: LayoutDashboard, label: isBn ? 'সার্বিক চিত্র (Overview)' : 'Overview' },
        { icon: Layers, label: isBn ? 'অ্যাট্রিবিউট ও ইউনিট' : 'Attributes & Units' },
        { icon: Users, label: isBn ? 'ভেন্ডর আবেদন ও অনুমোদন' : 'Vendor Applications' },
        { icon: FolderTree, label: isBn ? 'ক্যাটাগরি হাব (Categories)' : 'Category Hub' },
        { icon: Sliders, label: isBn ? 'ডাইনামিক ফিল্ড কনফিগারেশন' : 'Dynamic Fields' },
        { icon: Percent, label: isBn ? 'কমিশন ও আর্থিক পে-আউট' : 'Commission & Payouts' },
        { icon: ShoppingCart, label: isBn ? 'মার্কেটপ্লেস অর্ডার' : 'Marketplace Orders' },
        { icon: ImageIcon, label: isBn ? 'হিরো ব্যানার ও স্লাইডার' : 'Hero Banners & Slider' },
    ];

    const vendorNav = [
        { icon: LayoutDashboard, label: isBn ? 'স্টোর পরিচিতি (Store Profile)' : 'Store Profile' },
        { icon: Package, label: isBn ? 'পণ্য ও ৯-ধাপের উইজার্ড' : 'Products & Wizard' },
        { icon: ShoppingCart, label: isBn ? 'অর্ডার ট্র্যাকিং ও ডেলিভারি' : 'Orders & Delivery' },
        { icon: Wallet, label: isBn ? 'আয় ও উইথড্রয়াল রিকোয়েস্ট' : 'Earnings & Payouts' },
        { icon: Settings, label: isBn ? 'স্টোর সেটিংস' : 'Store Settings' },
    ];

    const currentNav = panelType === 'admin' ? adminNav : vendorNav;

    return (
        <CartProvider>
            <Head>
                <title>{`${panelType === 'admin' ? (isBn ? 'সুপার অ্যাডমিন' : 'Super Admin') : (isBn ? 'অনুমোদিত ভেন্ডর' : 'Vendor')} ড্যাশবোর্ড — অর্গানিক বাজার চাই`}</title>
            </Head>

            <div className="flex min-h-screen bg-background text-foreground">
                {/* Left Sidebar */}
                <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-card md:flex">
                    {/* Brand header */}
                    <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                        <img 
                            src="/images/logo.png" 
                            alt="অর্গানিক বাজার চাই" 
                            className="size-10 object-contain rounded-xl bg-white p-1 border border-border shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="font-display text-base leading-tight font-bold text-foreground truncate">
                                {isBn ? 'অর্গানিক বাজার চাই' : 'Organic Bazar Chai'}
                            </p>
                            <p className="text-[10px] tracking-wider text-accent uppercase font-bold">
                                {panelType === 'admin' ? (isBn ? 'সুপার অ্যাডমিন পোর্টাল' : 'Super Admin Portal') : (isBn ? 'ভেন্ডর পোর্টাল' : 'Vendor Portal')}
                            </p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
                        {currentNav.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = activeTab === index;
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setActiveTab(index)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all cursor-pointer text-left ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Storefront return link */}
                    <div className="border-t border-border p-4 bg-secondary/20">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-forest-deep transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                            <span>{isBn ? 'মূল মার্কেটপ্লেসে ফিরে যান' : 'Back to Marketplace'}</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header Bar */}
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-8">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
                                <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    {panelType === 'admin' 
                                        ? (isBn ? 'সুপার অ্যাডমিন কেন্দ্রীয় নিয়ন্ত্রণ' : 'Super Admin Control Center') 
                                        : (isBn ? 'ভেন্ডর কন্ট্রোল প্যানেল' : 'Vendor Control Panel')}
                                </h1>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {panelType === 'admin' 
                                    ? (isBn ? 'ভেন্ডর অনুমোদন, ক্যাটাগরি, ডাইনামিক ফিল্ডস ও আর্থিক পে-আউট নিয়ন্ত্রণ' : 'Manage vendors, categories, dynamic fields, and financial payouts') 
                                    : (isBn ? 'পণ্য আপলোড উইজার্ড, ইনভেন্টরি, অর্ডার ডেলিভারি ও ওয়ালেট উইথড্রয়াল' : 'Product wizard, inventory, order tracking, and wallet payouts')}
                            </p>
                        </div>

                        {/* Right header: Language Switcher & Role Switcher Pill */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Dashboard Language Switcher */}
                            <LanguageSwitcher variant="pill" />

                            <div className="flex rounded-full border border-border bg-muted p-1 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPanelType('admin');
                                        setActiveTab(0);
                                    }}
                                    className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                        panelType === 'admin'
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {isBn ? 'সুপার অ্যাডমিন' : 'Admin'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPanelType('vendor');
                                        setActiveTab(0);
                                    }}
                                    className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                        panelType === 'vendor'
                                            ? 'bg-primary text-primary-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {isBn ? 'পাহাড়ি ভেন্ডর' : 'Vendor'}
                                </button>
                            </div>

                            <Link
                                href="/"
                                className="md:hidden rounded-full border border-border p-2 text-primary"
                                title={isBn ? "মূল মার্কেটপ্লেস" : "Storefront"}
                            >
                                <ArrowLeft className="size-4" />
                            </Link>
                        </div>
                    </header>

                    {/* Tab Body */}
                    <main className="p-4 sm:p-8 space-y-8 flex-1 overflow-y-auto">
                        {/* ================= SUPER ADMIN PANELS ================= */}
                        {panelType === 'admin' && (
                            <>
                                {/* TAB 0: OVERVIEW */}
                                {activeTab === 0 && (
                                    <div className="space-y-8">
                                        {/* KPI Cards */}
                                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                                            {stats.map((stat) => (
                                                <div 
                                                    key={stat.label}
                                                    className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
                                                >
                                                    <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
                                                    <div className="mt-2 flex items-end justify-between gap-2">
                                                        <p className="font-display text-2xl font-bold sm:text-3xl text-foreground">
                                                            {stat.value}
                                                        </p>
                                                        <span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                                            <ArrowUpRight className="size-3" />
                                                            {stat.delta}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Grid: Pending Actions */}
                                        <div className="grid gap-6 lg:grid-cols-2">
                                            {/* Vendor approvals notification */}
                                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                                <div className="flex items-center justify-between pb-3 border-b border-border">
                                                    <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                                                        <Users className="size-4 text-accent" /> অপেক্ষারত ভেন্ডর আবেদন ({vendorApplications.filter(a => a.status === 'Pending').length})
                                                    </h3>
                                                    <button onClick={() => setActiveTab(1)} className="text-xs text-primary font-bold hover:underline cursor-pointer">
                                                        সব দেখুন →
                                                    </button>
                                                </div>
                                                <div className="mt-4 space-y-3">
                                                    {vendorApplications.filter(a => a.status === 'Pending').slice(0, 2).map(app => (
                                                        <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                                                            <div>
                                                                <p className="text-sm font-semibold text-foreground">{app.name}</p>
                                                                <p className="text-xs text-muted-foreground">{app.location} · কারিগর: {app.artisanCount} জন</p>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                                <button 
                                                                    onClick={() => handleApproveVendor(app.id)}
                                                                    className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold hover:bg-forest-deep"
                                                                >
                                                                    অনুমোদন
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Financial payouts notification */}
                                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                                <div className="flex items-center justify-between pb-3 border-b border-border">
                                                    <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                                                        <Wallet className="size-4 text-primary" /> পেন্ডিং পে-আউট রিকোয়েস্ট ({withdrawalRequests.filter(w => w.status === 'Pending').length})
                                                    </h3>
                                                    <button onClick={() => setActiveTab(4)} className="text-xs text-primary font-bold hover:underline cursor-pointer">
                                                        আর্থিক হিসাব →
                                                    </button>
                                                </div>
                                                <div className="mt-4 space-y-3">
                                                    {withdrawalRequests.filter(w => w.status === 'Pending').map(w => (
                                                        <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                                                            <div>
                                                                <p className="text-sm font-semibold text-foreground">{w.vendor} · <span className="text-primary font-bold">{w.amount}</span></p>
                                                                <p className="text-xs text-muted-foreground">{w.method}</p>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleApproveWithdrawal(w.id)}
                                                                className="px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold hover:bg-terracotta-deep"
                                                            >
                                                                পেমেন্ট অনুমোদন
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 1: ATTRIBUTE & UNIT MANAGEMENT */}
                                {activeTab === 1 && (
                                    <AdminAttributeStudio
                                        initialUnits={initialUnits}
                                        initialAttributes={initialAttributes}
                                        initialMappings={initialCategoryAttributes}
                                        initialRequests={initialDbAttributeRequests}
                                        categories={categories}
                                    />
                                )}

                                {/* TAB 2: VENDOR APPLICATIONS */}
                                {activeTab === 2 && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h2 className="font-display text-xl font-bold">পাহাড়ি ভেন্ডর আবেদন যাচাই ও অনুমোদন (Vendor Review)</h2>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    আবেদনকারীদের কারুশিল্প সত্যতা, এনআইডি, কভার ছবি এবং পেমেন্ট একাউন্ট যাচাই করে অনুমোদন বা বাতিল করুন।
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                                                    অপেক্ষারত: {vendorApplications.filter(a => a.status === 'Pending').length} টি
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                                    অনুমোদিত: {vendorApplications.filter(a => a.status === 'Approved').length} টি
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {vendorApplications.map((app) => (
                                                <div key={app.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40">
                                                    <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">
                                                        {/* Left info with logo & details */}
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                                                                <img 
                                                                    src={app.logo || '/images/cat-textiles.jpg'} 
                                                                    alt={app.name} 
                                                                    className="size-full object-cover" 
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h3 className="font-display text-lg font-bold text-foreground">{app.name}</h3>
                                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                                        app.status === 'Approved' ? 'bg-primary/15 text-primary' : app.status === 'Rejected' ? 'bg-destructive/15 text-destructive' : 'bg-accent/15 text-accent'
                                                                    }`}>
                                                                        {app.status === 'Approved' ? 'অনুমোদিত (Approved)' : app.status === 'Rejected' ? 'বাতিলকৃত (Rejected)' : 'বিচারাধীন (Pending)'}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground font-mono">
                                                                        ID: {app.id}
                                                                    </span>
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                                                                    <span>প্রতিনিধি: <strong className="text-foreground">{app.owner}</strong></span>
                                                                    <span>জেলা: <strong className="text-foreground">{app.location}</strong></span>
                                                                    <span>পণ্যশ্রেণী: <strong className="text-foreground">{app.specialty}</strong></span>
                                                                    <span>কারিগর: <strong className="text-primary font-bold">{app.artisanCount} পরিবার</strong></span>
                                                                </div>

                                                                {/* Phone, Email & NID */}
                                                                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                                                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-foreground font-mono">
                                                                        <Phone className="size-3 text-muted-foreground" /> {app.phone || '01712-XXXXXX'}
                                                                        {app.phoneVerified && <CheckCircle2 className="size-3 text-primary ml-0.5" title="OTP Verified" />}
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-foreground font-mono">
                                                                        <Mail className="size-3 text-muted-foreground" /> {app.email || 'vendor@example.com'}
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-foreground font-mono">
                                                                        NID: {app.nidNumber || app.nidOrTrade}
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-foreground">
                                                                        পেমেন্ট: {app.paymentMethod || 'bKash'}
                                                                    </span>
                                                                </div>

                                                                {/* Optional docs reminder banner */}
                                                                <div className="pt-1 text-[11px] text-muted-foreground">
                                                                    <span>ব্যবসায়িক নথি: </span>
                                                                    <span className="font-medium text-foreground">
                                                                        {app.businessDocs || 'ট্রেড লাইসেন্স দেওয়া হয়নি (ঐচ্ছিক)'}
                                                                    </span>
                                                                </div>

                                                                {/* Rejection reason if rejected */}
                                                                {app.status === 'Rejected' && app.rejectionReason && (
                                                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive flex items-center gap-2 mt-2">
                                                                        <AlertCircle className="size-4 shrink-0" />
                                                                        <span><strong>বাতিলের কারণ:</strong> {app.rejectionReason} (ভেন্ডরকে ইমেইল প্রেরিত)</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Actions */}
                                                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                                                            <button 
                                                                onClick={() => setSelectedAppForReview(app)}
                                                                className="px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted text-foreground flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <Eye className="size-3.5" /> বিস্তারিত আবেদন দেখুন
                                                            </button>

                                                            {app.status === 'Pending' && (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleOpenApproveModal(app)}
                                                                        className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep flex items-center gap-1.5 shadow-sm cursor-pointer"
                                                                    >
                                                                        <CheckCircle2 className="size-4" /> অনুমোদন দিন (Approve)
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => setSelectedAppForReject(app)}
                                                                        className="px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-destructive/10 text-destructive flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <XCircle className="size-4" /> বাতিল
                                                                    </button>
                                                                </>
                                                            )}

                                                            {app.status === 'Approved' && (
                                                                <button 
                                                                    onClick={() => setSelectedAppForApprove(app)}
                                                                    className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <Lock className="size-3.5" /> লগইন তথ্য
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: CATEGORY & SUB-CATEGORY MANAGEMENT HUB */}
                                {activeTab === 3 && (
                                    <div className="space-y-6">
                                        {/* Top Header & Sub-Tab Switcher */}
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border pb-5">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                        <FolderTree className="size-5" />
                                                    </span>
                                                    <h2 className="font-display text-xl font-bold text-foreground">
                                                        ক্যাটাগরি ও সাব-ক্যাটাগরি হাব (Category Management)
                                                    </h2>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    পাহাড়ের পণ্যের শ্রেণীবিন্যাস, সাব-ক্যাটাগরি ম্যাপিং, ইউআরএল স্লাগ, আইকন ও ভেন্ডর ক্যাটাগরি রিকোয়েস্ট নিয়ন্ত্রণ করুন।
                                                </p>
                                            </div>

                                            {/* Sub-Tab Navigation Pill */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex rounded-2xl border border-border bg-card p-1 shadow-2xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCategoryStudioTab('tree')}
                                                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                                            categoryStudioTab === 'tree'
                                                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                    >
                                                        <FolderTree className="size-3.5" />
                                                        <span>হায়ারার্কি ট্রি (Tree View)</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCategoryStudioTab('cards')}
                                                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                                            categoryStudioTab === 'cards'
                                                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                    >
                                                        <Layers className="size-3.5" />
                                                        <span>কার্ড গ্রিড (Cards)</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCategoryStudioTab('requests')}
                                                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                                            categoryStudioTab === 'requests'
                                                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                    >
                                                        <Mail className="size-3.5" />
                                                        <span>ভেন্ডর রিকোয়েস্ট</span>
                                                        {categoryRequests.filter(r => r.status === 'Pending').length > 0 && (
                                                            <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                                                                {categoryRequests.filter(r => r.status === 'Pending').length}
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            try {
                                                                localStorage.removeItem('paharika_custom_categories_v2');
                                                                localStorage.removeItem('paharika_custom_categories');
                                                            } catch (e) {}
                                                            setCategories(initialCategories);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                                                        title="ডিফল্ট ১০টি পাহাড়ি ক্যাটাগরিতে ফেরত যান"
                                                    >
                                                        <RotateCcw className="size-3.5" /> ডিফল্ট ১০টি ক্যাটাগরি
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCategoryFormOpen(!isCategoryFormOpen)}
                                                        className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-xs transition-all cursor-pointer"
                                                    >
                                                        <Plus className="size-4" /> {isCategoryFormOpen ? 'ফর্ম লুকান' : 'নতুন ক্যাটাগরি যোগ'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metrics & Filter Bar */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            {/* Search input */}
                                            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 max-w-md w-full shadow-2xs">
                                                <Search className="size-4 text-muted-foreground shrink-0" />
                                                <input 
                                                    type="text" 
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    placeholder="ক্যাটাগরি, সাব-ক্যাটাগরি বা স্লাগ লিখে খুঁজুন..."
                                                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground text-foreground"
                                                />
                                                {categorySearch && (
                                                    <button onClick={() => setCategorySearch('')} className="text-xs text-muted-foreground hover:text-foreground">
                                                        <X className="size-3.5" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Badges Count */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-semibold text-primary">
                                                    সক্রিয়: {categories.filter(c => c.status !== 'Inactive').length} টি
                                                </span>
                                                <span className="rounded-full bg-muted border border-border px-3 py-1 font-semibold text-muted-foreground">
                                                    নিষ্ক্রিয়: {categories.filter(c => c.status === 'Inactive').length} টি
                                                </span>
                                                <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-1 font-semibold text-accent">
                                                    সাব-ক্যাটাগরি: {categories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)} টি
                                                </span>
                                            </div>
                                        </div>

                                        {/* COMPREHENSIVE CATEGORY CREATION FORM (10 Core Fields) */}
                                        {isCategoryFormOpen && (
                                            <div className="rounded-3xl border border-primary/25 bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in slide-in-from-top-2 duration-200">
                                                <div className="flex items-center justify-between border-b border-border pb-4">
                                                    <div className="flex items-center gap-2">
                                                        <FolderPlus className="size-5 text-primary" />
                                                        <div>
                                                            <h3 className="font-display text-base font-bold text-foreground">
                                                                নতুন পাহাড়ি ক্যাটাগরি ও সাব-ক্যাটাগরি তৈরি করুন
                                                            </h3>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                প্যারেন্ট ক্যাটাগরি খালি রাখলে মূল ক্যাটাগরি হবে, সিলেক্ট করলে সাব-ক্যাটাগরি তৈরি হবে।
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                                        Slug & URL Auto-Sync
                                                    </span>
                                                </div>

                                                <form onSubmit={handleCreateCategorySubmit} className="space-y-6">
                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                        {/* Left Form Column (7 cols) */}
                                                        <div className="lg:col-span-7 space-y-4">
                                                            {/* 1. Category Name & Parent Category */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                                        ১. ক্যাটাগরির নাম <span className="text-destructive">*</span>
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        value={catForm.name}
                                                                        onChange={(e) => handleCatNameChange(e.target.value)}
                                                                        placeholder="যেমন: Tribal Musical Instruments"
                                                                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                                                                        required
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                                        ২. Parent Category (অভিভাবক ক্যাটাগরি)
                                                                    </label>
                                                                    <select
                                                                        value={catForm.parentId}
                                                                        onChange={(e) => setCatForm({ ...catForm, parentId: e.target.value })}
                                                                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium outline-none focus:border-primary cursor-pointer"
                                                                    >
                                                                        <option value="">মূল ক্যাটাগরি (Root Category — কোনো প্যারেন্ট নেই)</option>
                                                                        {categories.map((c) => (
                                                                            <option key={c.id || c.name} value={c.name}>
                                                                                সাব-ক্যাটাগরি হিসেবে যোগ হবে অধীনে: {c.name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <p className="text-[10px] text-muted-foreground mt-1">
                                                                        {catForm.parentId ? `⚠️ এটি "${catForm.parentId}"-এর অধীনে সাব-ক্যাটাগরি হবে` : '✅ এটি প্রধান ক্যাটাগরি হিসেবে থাকবে'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* 2. Slug & Display Order */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                                <div className="sm:col-span-2">
                                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                                        ৩. URL Slug (রিয়েল-টাইমে তৈরি হচ্ছে)
                                                                    </label>
                                                                    <div className="flex items-center rounded-xl border border-input bg-background px-3 py-1.5 text-xs">
                                                                        <span className="text-muted-foreground font-mono text-[11px] shrink-0">/category/</span>
                                                                        <input 
                                                                            type="text" 
                                                                            value={catForm.slug}
                                                                            onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                                                                            placeholder="handloom-shawls"
                                                                            className="w-full bg-transparent font-mono text-primary outline-none px-1 text-xs"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                                        ৪. Display Order (সিরিয়াল)
                                                                    </label>
                                                                    <input 
                                                                        type="number" 
                                                                        min="1"
                                                                        value={catForm.order}
                                                                        onChange={(e) => setCatForm({ ...catForm, order: e.target.value })}
                                                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold outline-none focus:border-primary text-center"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* 3. Status & Featured Toggle */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-secondary/30 p-3.5 border border-border">
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-foreground mb-1">
                                                                        ৫. স্ট্যাটাস (Status)
                                                                    </label>
                                                                    <select
                                                                        value={catForm.status}
                                                                        onChange={(e) => setCatForm({ ...catForm, status: e.target.value })}
                                                                        className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                                                                    >
                                                                        <option value="Active">Active (সক্রিয় - সাইটে দৃশ্যমান)</option>
                                                                        <option value="Inactive">Inactive (নিষ্ক্রিয় - ড্রপডাউন ও সাইট থেকে লুকানো)</option>
                                                                    </select>
                                                                </div>

                                                                <div className="flex items-center justify-between sm:justify-start sm:gap-3 pt-4 sm:pt-6">
                                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={catForm.featured}
                                                                            onChange={(e) => setCatForm({ ...catForm, featured: e.target.checked })}
                                                                            className="sr-only peer"
                                                                        />
                                                                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                                    </label>
                                                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                                                                        <Star className="size-3.5 text-amber-500 fill-amber-500" />
                                                                        ৬. হোমপেজে ফিচার্ড হিসেবে প্রদর্শন
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* 4. Complete eCommerce Category Icon Library */}
                                                            <div className="space-y-3 p-4 rounded-2xl bg-secondary/20 border border-border">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                    <div>
                                                                        <label className="block text-xs font-semibold text-foreground">
                                                                            ৭. ক্যাটাগরি আইকন নির্বাচন করুন (৫০+ টি আইকন লাইব্রেরি):
                                                                        </label>
                                                                        <p className="text-[10px] text-muted-foreground">
                                                                            ই-কমার্সের যেকোনো ধরণের পণ্যের জন্য উপযুক্ত আইকন বেছে নিন
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    {/* Selected Icon Pill */}
                                                                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-primary/10 border border-primary/25 text-primary px-3 py-1 rounded-full text-xs font-bold shrink-0">
                                                                        <span className="text-[11px] font-normal text-muted-foreground">নির্বাচিত:</span>
                                                                        {renderCategoryIcon(catForm.icon, "size-3.5")}
                                                                        <span>{ALL_CATEGORY_ICONS.find(i => i.id === catForm.icon)?.label || catForm.icon}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Popular Quick-Select Icons */}
                                                                <div className="space-y-1.5">
                                                                    <span className="text-[11px] font-medium text-muted-foreground">জনপ্রিয় আইকনসমূহ:</span>
                                                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                                                                        {[
                                                                            { id: 'Shirt', label: 'বস্ত্র' },
                                                                            { id: 'Coffee', label: 'চা/কফি' },
                                                                            { id: 'Flame', label: 'পাহাড়ি মসলা' },
                                                                            { id: 'TreePine', label: 'বাঁশ ও বেত' },
                                                                            { id: 'Flower2', label: 'মৃৎশিল্প' },
                                                                            { id: 'Gem', label: 'জুয়েলারি' },
                                                                            { id: 'ShoppingBag', label: 'ব্যাগ' },
                                                                            { id: 'Sparkles', label: 'রূপচর্চা' },
                                                                        ].map((item) => {
                                                                            const isSelected = catForm.icon === item.id;
                                                                            return (
                                                                                <button
                                                                                    type="button"
                                                                                    key={item.id}
                                                                                    onClick={() => setCatForm({ ...catForm, icon: item.id })}
                                                                                    className={`flex flex-col items-center justify-center rounded-xl p-2 border transition-all cursor-pointer ${
                                                                                        isSelected 
                                                                                            ? 'border-primary bg-primary text-primary-foreground shadow-xs font-bold' 
                                                                                            : 'border-border bg-background hover:bg-muted text-muted-foreground'
                                                                                    }`}
                                                                                >
                                                                                    {renderCategoryIcon(item.id, "size-4")}
                                                                                    <span className="mt-1 text-[10px] truncate w-full text-center">{item.label}</span>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* Toggle Full Library Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setIsIconLibraryOpen(!isIconLibraryOpen)}
                                                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-primary/40 bg-background/80 hover:bg-primary/5 text-primary text-xs font-bold transition-all cursor-pointer"
                                                                >
                                                                    <Search className="size-3.5" />
                                                                    <span>{isIconLibraryOpen ? 'আইকন লাইব্রেরি সংক্ষেপ করুন' : '🔍 সম্পূর্ণ ৫০+ টি ই-কমার্স আইকন ব্রাউজ ও সার্চ করুন'}</span>
                                                                    <ChevronDown className={`size-3.5 transition-transform ${isIconLibraryOpen ? 'rotate-180' : ''}`} />
                                                                </button>

                                                                {/* Full Expandable Icon Library */}
                                                                {isIconLibraryOpen && (
                                                                    <div className="space-y-3 pt-2 border-t border-border animate-in fade-in duration-200">
                                                                        {/* Search Box */}
                                                                        <div className="relative">
                                                                            <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
                                                                            <input 
                                                                                type="text" 
                                                                                value={iconSearchQuery}
                                                                                onChange={(e) => setIconSearchQuery(e.target.value)}
                                                                                placeholder="আইকন খুঁজুন (যেমন: শার্ট, মসলা, বই, ফল, জুতো, ঘড়ি, honey, bag...)"
                                                                                className="w-full pl-9 pr-8 py-2 rounded-xl border border-input bg-background text-xs outline-none focus:border-primary"
                                                                            />
                                                                            {iconSearchQuery && (
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => setIconSearchQuery('')}
                                                                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                                                                >
                                                                                    <X className="size-3.5" />
                                                                                </button>
                                                                            )}
                                                                        </div>

                                                                        {/* Category Filter Pills */}
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {CATEGORY_ICON_GROUPS.map((grp) => (
                                                                                <button
                                                                                    type="button"
                                                                                    key={grp.id}
                                                                                    onClick={() => setIconActiveGroup(grp.id)}
                                                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                                                                                        iconActiveGroup === grp.id 
                                                                                            ? 'bg-primary text-primary-foreground shadow-xs' 
                                                                                            : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                                                                                    }`}
                                                                                >
                                                                                    {grp.label}
                                                                                </button>
                                                                            ))}
                                                                        </div>

                                                                        {/* Filtered Icons Grid */}
                                                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
                                                                            {ALL_CATEGORY_ICONS
                                                                                .filter((item) => {
                                                                                    const matchesGroup = iconActiveGroup === 'all' || item.group === iconActiveGroup;
                                                                                    const q = iconSearchQuery.toLowerCase().trim();
                                                                                    const matchesSearch = !q || 
                                                                                        item.id.toLowerCase().includes(q) || 
                                                                                        item.label.toLowerCase().includes(q) || 
                                                                                        item.tags.toLowerCase().includes(q);
                                                                                    return matchesGroup && matchesSearch;
                                                                                })
                                                                                .map((item) => {
                                                                                    const isSelected = catForm.icon === item.id;
                                                                                    return (
                                                                                        <button
                                                                                            type="button"
                                                                                            key={item.id}
                                                                                            onClick={() => {
                                                                                                setCatForm({ ...catForm, icon: item.id });
                                                                                            }}
                                                                                            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                                                                                isSelected 
                                                                                                    ? 'border-primary bg-primary text-primary-foreground ring-2 ring-primary/30 font-bold' 
                                                                                                    : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5 text-foreground'
                                                                                            }`}
                                                                                        >
                                                                                            <span className="p-1">
                                                                                                {renderCategoryIcon(item.id, "size-4")}
                                                                                            </span>
                                                                                            <span className="text-[10px] font-medium truncate w-full mt-0.5">
                                                                                                {item.label}
                                                                                            </span>
                                                                                        </button>
                                                                                    );
                                                                                })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* 5. Cover Image & Banner Image */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-secondary/20 border border-border">
                                                                {/* Cover Image with URL + Upload options */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <label className="block text-xs font-semibold text-foreground">
                                                                            ৮. কভার ছবি (Cover Image):
                                                                        </label>
                                                                        {/* Toggle URL vs Upload */}
                                                                        <div className="inline-flex rounded-lg border border-border bg-background p-0.5 text-[10px] font-bold">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setCoverImageMode('url')}
                                                                                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${coverImageMode === 'url' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                                                            >
                                                                                URL / প্রিসেট
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setCoverImageMode('upload')}
                                                                                className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${coverImageMode === 'upload' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                                                            >
                                                                                <Upload className="size-2.5" /> ফাইল আপলোড
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {coverImageMode === 'url' ? (
                                                                        <div className="space-y-2">
                                                                            <div className="flex gap-1.5">
                                                                                {[
                                                                                    { label: 'তাঁত', url: '/images/cat-textiles.jpg' },
                                                                                    { label: 'বাঁশ', url: '/images/cat-bamboo.jpg' },
                                                                                    { label: 'প্যান্ট্রি', url: '/images/cat-pantry.jpg' },
                                                                                    { label: 'মাটি', url: '/images/cat-pottery.jpg' },
                                                                                ].map((preset) => (
                                                                                    <button
                                                                                        type="button"
                                                                                        key={preset.url}
                                                                                        onClick={() => setCatForm({ ...catForm, image: preset.url, uploadedFileName: '' })}
                                                                                        className={`flex-1 py-1 rounded-lg border text-[10px] font-semibold text-center cursor-pointer ${
                                                                                            catForm.image === preset.url ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border bg-background'
                                                                                        }`}
                                                                                    >
                                                                                        {preset.label}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                            <input 
                                                                                type="text" 
                                                                                value={catForm.image?.startsWith('data:') ? '' : (catForm.image || '')}
                                                                                onChange={(e) => setCatForm({ ...catForm, image: e.target.value, uploadedFileName: '' })}
                                                                                placeholder="https://... বা /images/custom-cover.jpg"
                                                                                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-2">
                                                                            <label className="relative flex flex-col items-center justify-center p-3 border-2 border-dashed border-primary/30 hover:border-primary rounded-xl bg-background/60 hover:bg-primary/5 cursor-pointer transition-colors group">
                                                                                <input 
                                                                                    type="file" 
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleImageFileUpload(e.target.files?.[0], 'image', false)}
                                                                                    className="sr-only"
                                                                                />
                                                                                <Upload className="size-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                                                                                <span className="text-xs font-semibold text-foreground text-center">
                                                                                    ডিভাইস থেকে কভার ছবি নির্বাচন করুন
                                                                                </span>
                                                                                <span className="text-[10px] text-muted-foreground">
                                                                                    JPG, PNG, WEBP (সর্বোচ্চ 5MB)
                                                                                </span>
                                                                            </label>
                                                                            {catForm.image && catForm.image.startsWith('data:') && (
                                                                                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                                        <img src={catForm.image} alt="Upload thumb" className="size-7 rounded object-cover border" />
                                                                                        <span className="truncate text-[11px] font-medium text-foreground">
                                                                                            {catForm.uploadedFileName || 'ফাইল আপলোড হয়েছে'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => setCatForm({ ...catForm, image: '/images/cat-pantry.jpg', uploadedFileName: '' })}
                                                                                        className="text-[10px] font-bold text-destructive hover:underline ml-2 cursor-pointer"
                                                                                    >
                                                                                        মুছুন
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Header Banner with URL + Upload options */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <label className="block text-xs font-semibold text-foreground">
                                                                            ৯. হেডার ব্যানার (Banner):
                                                                        </label>
                                                                        <div className="inline-flex rounded-lg border border-border bg-background p-0.5 text-[10px] font-bold">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setBannerImageMode('url')}
                                                                                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${bannerImageMode === 'url' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                                                            >
                                                                                URL দিন
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setBannerImageMode('upload')}
                                                                                className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${bannerImageMode === 'upload' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                                                            >
                                                                                <Upload className="size-2.5" /> আপলোড
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {bannerImageMode === 'url' ? (
                                                                        <div className="space-y-2">
                                                                            <p className="text-[10px] text-muted-foreground">
                                                                                ক্যাটাগরি পেজের শীর্ষ ব্যানার URL
                                                                            </p>
                                                                            <input 
                                                                                type="text" 
                                                                                value={catForm.banner?.startsWith('data:') ? '' : (catForm.banner || '')}
                                                                                onChange={(e) => setCatForm({ ...catForm, banner: e.target.value, bannerFileName: '' })}
                                                                                placeholder="/images/hero.jpg বা https://..."
                                                                                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-2">
                                                                            <label className="relative flex flex-col items-center justify-center p-3 border-2 border-dashed border-border hover:border-primary rounded-xl bg-background/60 hover:bg-primary/5 cursor-pointer transition-colors group">
                                                                                <input 
                                                                                    type="file" 
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleImageFileUpload(e.target.files?.[0], 'banner', false)}
                                                                                    className="sr-only"
                                                                                />
                                                                                <Upload className="size-4 text-muted-foreground group-hover:text-primary mb-1 group-hover:scale-110 transition-transform" />
                                                                                <span className="text-xs font-semibold text-foreground text-center">
                                                                                    ব্যানার ছবি নির্বাচন করুন
                                                                                </span>
                                                                                <span className="text-[10px] text-muted-foreground">
                                                                                    ওয়াইড রেশিও ব্যানার (1920x600)
                                                                                </span>
                                                                            </label>
                                                                            {catForm.banner && catForm.banner.startsWith('data:') && (
                                                                                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                                        <img src={catForm.banner} alt="Banner thumb" className="size-7 rounded object-cover border" />
                                                                                        <span className="truncate text-[11px] font-medium text-foreground">
                                                                                            {catForm.bannerFileName || 'ব্যানার আপলোড হয়েছে'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => setCatForm({ ...catForm, banner: '/images/hero.jpg', bannerFileName: '' })}
                                                                                        className="text-[10px] font-bold text-destructive hover:underline ml-2 cursor-pointer"
                                                                                    >
                                                                                        মুছুন
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* 6. Short Description */}
                                                            <div>
                                                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                                    ১০. সংক্ষিপ্ত বিবরণ (Short Description):
                                                                </label>
                                                                <textarea 
                                                                    rows={2}
                                                                    value={catForm.description}
                                                                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                                                                    placeholder="পাহাড়ি পণ্যের ঐতিহ্য ও কারিগরির সংক্ষিপ্ত বিবরণ..."
                                                                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
                                                                />
                                                            </div>

                                                            {/* Sub-categories tags (if root category) */}
                                                            {!catForm.parentId && (
                                                                <div className="space-y-2 border-t border-border pt-3">
                                                                    <label className="block text-xs font-semibold text-foreground">
                                                                        সাব-ক্যাটাগরি ট্যাগ যোগ করুন (একাধিক যোগ করা যাবে):
                                                                    </label>
                                                                    <div className="flex gap-2">
                                                                        <input 
                                                                            type="text" 
                                                                            value={catForm.subcatInput}
                                                                            onChange={(e) => setCatForm({ ...catForm, subcatInput: e.target.value })}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault();
                                                                                    handleAddSubcatTag();
                                                                                }
                                                                            }}
                                                                            placeholder="সাব-ক্যাটাগরির নাম লিখে Enter চাপুন..."
                                                                            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                                                        />
                                                                        <button 
                                                                            type="button" 
                                                                            onClick={handleAddSubcatTag}
                                                                            className="px-4 py-2 rounded-xl bg-secondary text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all cursor-pointer"
                                                                        >
                                                                            + যোগ
                                                                        </button>
                                                                    </div>

                                                                    {/* Tags preview */}
                                                                    <div className="flex flex-wrap gap-1.5 pt-1 min-h-8">
                                                                        {catForm.subcategories.map((sc, i) => (
                                                                            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                                                {sc}
                                                                                <button type="button" onClick={() => handleRemoveSubcatTag(i)} className="hover:text-destructive cursor-pointer">
                                                                                    <X className="size-3" />
                                                                                </button>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Collapsible SEO Section */}
                                                            <div className="border border-border rounded-2xl overflow-hidden">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCatForm({ ...catForm, showSeoFields: !catForm.showSeoFields })}
                                                                    className="w-full flex items-center justify-between p-3.5 bg-secondary/30 text-xs font-bold text-foreground cursor-pointer text-left"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <Globe className="size-4 text-accent" />
                                                                        SEO মেটা সেটিংস (SEO Meta Title & Description — ঐচ্ছিক)
                                                                    </span>
                                                                    <ChevronDown className={`size-4 transition-transform ${catForm.showSeoFields ? 'rotate-180' : ''}`} />
                                                                </button>

                                                                {catForm.showSeoFields && (
                                                                    <div className="p-4 space-y-3 bg-card border-t border-border">
                                                                        <div>
                                                                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                                                                SEO Meta Title:
                                                                            </label>
                                                                            <input 
                                                                                type="text" 
                                                                                value={catForm.seoTitle}
                                                                                onChange={(e) => setCatForm({ ...catForm, seoTitle: e.target.value })}
                                                                                placeholder="যেমন: Traditional Handloom Textiles of CHT | Paharika"
                                                                                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                                                                                SEO Meta Description:
                                                                            </label>
                                                                            <textarea 
                                                                                rows={2}
                                                                                value={catForm.seoDesc}
                                                                                onChange={(e) => setCatForm({ ...catForm, seoDesc: e.target.value })}
                                                                                placeholder="গুগল সার্চে প্রদর্শিত সংক্ষিপ্ত মেটা বর্ণনা..."
                                                                                className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Column: Live Marketplace Preview (5 cols) */}
                                                        <div className="lg:col-span-5 flex flex-col justify-between">
                                                            <div className="space-y-3">
                                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                                    লাইভ কার্ড ও লিঙ্ক প্রিভিউ (Live Preview):
                                                                </p>

                                                                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
                                                                    <div className="relative h-40 overflow-hidden">
                                                                        <img 
                                                                            src={catForm.image || '/images/cat-textiles.jpg'} 
                                                                            alt="Preview" 
                                                                            className="size-full object-cover"
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                                                        
                                                                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                                                            <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white">
                                                                                Order: #{catForm.order}
                                                                            </span>
                                                                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${catForm.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                                                {catForm.status}
                                                                            </span>
                                                                        </div>

                                                                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                                                                            <div>
                                                                                <div className="flex items-center gap-1.5 text-sand text-[11px] font-bold">
                                                                                    {renderCategoryIcon(catForm.icon, "size-3.5")}
                                                                                    <span>{catForm.parentId ? `Parent: ${catForm.parentId}` : 'Root Category'}</span>
                                                                                </div>
                                                                                <h4 className="font-display text-lg font-bold text-white drop-shadow-sm">
                                                                                    {catForm.name || 'ক্যাটাগরির নাম...'}
                                                                                </h4>
                                                                            </div>
                                                                            {catForm.featured && (
                                                                                <span className="flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-2 py-0.5 text-[10px] font-bold">
                                                                                    <Star className="size-3 fill-white" /> Featured
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="p-4 space-y-2.5 text-xs">
                                                                        <p className="text-muted-foreground line-clamp-2">
                                                                            {catForm.description || 'পাহাড়ি পণ্যের ঐতিহ্যবাহী কারিগরি সংগ্রহ।'}
                                                                        </p>

                                                                        <div className="flex items-center gap-2 font-mono text-[11px] text-primary bg-secondary/40 p-2 rounded-xl">
                                                                            <Globe className="size-3.5 shrink-0" />
                                                                            <span className="truncate">paharika.com/category/{catForm.slug || 'slug'}</span>
                                                                        </div>

                                                                        {!catForm.parentId && (
                                                                            <div>
                                                                                <span className="text-[11px] font-semibold text-muted-foreground">সাব-ক্যাটাগরি সমূহ ({catForm.subcategories.length}):</span>
                                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                                    {catForm.subcategories.map((s, idx) => (
                                                                                        <span key={idx} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground">
                                                                                            {s}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setCatForm({
                                                                            name: '',
                                                                            parentId: '',
                                                                            slug: '',
                                                                            icon: 'Shirt',
                                                                            image: '/images/cat-textiles.jpg',
                                                                            banner: '/images/hero.jpg',
                                                                            description: '',
                                                                            status: 'Active',
                                                                            order: categories.length + 1,
                                                                            featured: true,
                                                                            commission: 10,
                                                                            seoTitle: '',
                                                                            seoDesc: '',
                                                                            subcategories: [],
                                                                            subcatInput: '',
                                                                            showSeoFields: false
                                                                        });
                                                                    }}
                                                                    className="px-4 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted text-muted-foreground cursor-pointer"
                                                                >
                                                                    রিসেট
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                                                                >
                                                                    <Check className="size-4" /> ক্যাটাগরি সংরক্ষণ করুন
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {/* VIEW 1: HIERARCHICAL TREE VIEW */}
                                        {categoryStudioTab === 'tree' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                                        <FolderTree className="size-4 text-primary" /> ক্যাটাগরি ও সাব-ক্যাটাগরি হায়ারার্কি ট্রি (Tree Structure)
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground">
                                                        ক্রমবিন্যাস পরিবর্তন করতে আপ/ডাউন বাটনে ক্লিক করুন
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {categories
                                                        .filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()) || (c.subcategories || []).some(s => s.toLowerCase().includes(categorySearch.toLowerCase())))
                                                        .map((c, index) => {
                                                            const isExpanded = expandedTreeNodes[c.id || c.name] !== false;
                                                            return (
                                                                <div 
                                                                    key={c.id || c.name} 
                                                                    className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden transition-all hover:border-primary/40"
                                                                >
                                                                    {/* Parent Row */}
                                                                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card">
                                                                        <div className="flex items-center gap-3">
                                                                            {/* Up/Down order re-arrangers */}
                                                                            <div className="flex flex-col gap-0.5">
                                                                                <button
                                                                                    type="button"
                                                                                    disabled={index === 0}
                                                                                    onClick={() => handleMoveOrder(c.id || c.name, 'up')}
                                                                                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                                                                                    title="উপরে স্থানান্তর"
                                                                                >
                                                                                    <ArrowUp className="size-3" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    disabled={index === categories.length - 1}
                                                                                    onClick={() => handleMoveOrder(c.id || c.name, 'down')}
                                                                                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                                                                                    title="নিচে স্থানান্তর"
                                                                                >
                                                                                    <ArrowDown className="size-3" />
                                                                                </button>
                                                                            </div>

                                                                            {/* Expand / Collapse Chevron */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setExpandedTreeNodes(prev => ({ ...prev, [c.id || c.name]: !isExpanded }))}
                                                                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                                                                            >
                                                                                {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                                                            </button>

                                                                            {/* Icon & Thumbnail */}
                                                                            <div className="relative flex size-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold overflow-hidden border border-border">
                                                                                {c.image ? (
                                                                                    <img src={c.image} alt={c.name} className="size-full object-cover" />
                                                                                ) : (
                                                                                    renderCategoryIcon(c.icon, "size-5")
                                                                                )}
                                                                            </div>

                                                                            {/* Category Info */}
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <h4 className="font-display font-bold text-sm text-foreground">
                                                                                        {c.name}
                                                                                    </h4>
                                                                                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                                                        /{c.slug || 'category'}
                                                                                    </span>
                                                                                    {c.featured && (
                                                                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                                                            <Star className="size-2.5 fill-amber-500" /> Featured
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                                                                    {c.description || 'পাহাড়ি খাঁটি পণ্য শ্রেণীবিন্যাস।'}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Right Action & Status Pills */}
                                                                        <div className="flex items-center gap-2.5">
                                                                            {/* Product count pill */}
                                                                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                                                                {c.count || 0} টি পণ্য
                                                                            </span>

                                                                            {/* Subcategories count */}
                                                                            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                                                                {c.subcategories?.length || 0} টি সাব-ক্যাটাগরি
                                                                            </span>

                                                                            {/* 1-Click Status Toggle */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleToggleCategoryStatus(c.id || c.name)}
                                                                                className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                                                                                    c.status === 'Active' 
                                                                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25' 
                                                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                                                }`}
                                                                                title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                                                                            >
                                                                                ● {c.status || 'Active'}
                                                                            </button>

                                                                            {/* Add Subcategory Trigger */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setActiveInlineAddCat(activeInlineAddCat === c.name ? null : c.name);
                                                                                    setInlineSubcatName('');
                                                                                }}
                                                                                className="rounded-xl border border-border p-2 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary cursor-pointer"
                                                                                title="সাব-ক্যাটাগরি যুক্ত করুন"
                                                                            >
                                                                                <Plus className="size-3.5" />
                                                                            </button>

                                                                            {/* Edit Modal Button */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setEditingCategory({
                                                                                    originalName: c.name,
                                                                                    id: c.id,
                                                                                    name: c.name,
                                                                                    slug: c.slug || generateSlug(c.name),
                                                                                    icon: c.icon || 'Shirt',
                                                                                    image: c.image || '/images/cat-textiles.jpg',
                                                                                    banner: c.banner || '/images/hero.jpg',
                                                                                    description: c.description || '',
                                                                                    status: c.status || 'Active',
                                                                                    order: c.order || 1,
                                                                                    featured: c.featured !== false,
                                                                                    commission: c.commission || 10,
                                                                                    subcategories: [...(c.subcategories || [])]
                                                                                })}
                                                                                className="rounded-xl border border-border p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                                                                                title="ক্যাটাগরি এডিট"
                                                                            >
                                                                                <Edit2 className="size-3.5" />
                                                                            </button>

                                                                            {/* Safe Delete Guard Button */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleDeleteCategoryWithGuard(c)}
                                                                                className="rounded-xl border border-border p-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                                                                                title="ক্যাটাগরি ডিলিট (সুরক্ষিত)"
                                                                            >
                                                                                <Trash2 className="size-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Nested Children Tree Branches */}
                                                                    {isExpanded && (
                                                                        <div className="border-t border-border/60 bg-secondary/15 px-6 py-4 space-y-3">
                                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                                <span className="font-semibold flex items-center gap-1.5">
                                                                                    <CornerDownRight className="size-3.5 text-primary" />
                                                                                    অধীনস্থ সাব-ক্যাটাগরি শাখা সমূহ ({c.subcategories?.length || 0} টি):
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setActiveInlineAddCat(activeInlineAddCat === c.name ? null : c.name)}
                                                                                    className="text-primary hover:underline font-bold text-[11px] cursor-pointer"
                                                                                >
                                                                                    + দ্রুত সাব-ক্যাটাগরি যোগ করুন
                                                                                </button>
                                                                            </div>

                                                                            {/* Inline input */}
                                                                            {activeInlineAddCat === c.name && (
                                                                                <form 
                                                                                    onSubmit={(e) => handleAddSubcatToExisting(c.name, e)}
                                                                                    className="flex items-center gap-2 p-2 rounded-xl bg-card border border-primary/40 shadow-xs"
                                                                                >
                                                                                    <input 
                                                                                        type="text"
                                                                                        autoFocus
                                                                                        value={inlineSubcatName}
                                                                                        onChange={(e) => setInlineSubcatName(e.target.value)}
                                                                                        placeholder="নতুন সাব-ক্যাটাগরির নাম লিখে Enter চাপুন..."
                                                                                        className="flex-1 bg-background px-3 py-1.5 rounded-lg border border-input text-xs outline-none"
                                                                                    />
                                                                                    <button 
                                                                                        type="submit"
                                                                                        className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep cursor-pointer"
                                                                                    >
                                                                                        যুক্ত করুন
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => setActiveInlineAddCat(null)}
                                                                                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                                                                                    >
                                                                                        <X className="size-3.5" />
                                                                                    </button>
                                                                                </form>
                                                                            )}

                                                                            {/* Sub-category badges list */}
                                                                            <div className="flex flex-wrap gap-2 pt-1 pl-4 border-l-2 border-primary/30">
                                                                                {(c.subcategories || []).map((sc) => (
                                                                                    <span 
                                                                                        key={sc} 
                                                                                        className="group inline-flex items-center gap-2 rounded-full bg-card border border-border px-3.5 py-1.5 text-xs font-medium text-foreground shadow-2xs hover:border-primary/50"
                                                                                    >
                                                                                        <span className="size-1.5 rounded-full bg-primary" />
                                                                                        <span>{sc}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleRemoveSubcatFromExisting(c.name, sc)}
                                                                                            className="text-muted-foreground hover:text-destructive opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                                            title={`"${sc}" সাব-ক্যাটাগরি মুছুন`}
                                                                                        >
                                                                                            <X className="size-3" />
                                                                                        </button>
                                                                                    </span>
                                                                                ))}
                                                                                {(c.subcategories || []).length === 0 && (
                                                                                    <p className="text-xs text-muted-foreground italic">
                                                                                        এখনও কোনো সাব-ক্যাটাগরি যুক্ত করা হয়নি।
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        )}

                                        {/* VIEW 2: GRID CARDS VIEW */}
                                        {categoryStudioTab === 'cards' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-display text-base font-bold text-foreground">
                                                        ক্যাটাগরি কার্ড গ্রিড ({categories.length} টি ক্যাটাগরি)
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {categories
                                                        .filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()) || (c.subcategories || []).some(s => s.toLowerCase().includes(categorySearch.toLowerCase())))
                                                        .map((c) => (
                                                            <div key={c.name} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
                                                                {/* Card Header with Image */}
                                                                <div>
                                                                    <div className="relative h-40 overflow-hidden">
                                                                        <img 
                                                                            src={c.image || '/images/cat-textiles.jpg'} 
                                                                            alt={c.name} 
                                                                            className="size-full object-cover transition-transform duration-500 hover:scale-105" 
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                                                                        
                                                                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                                                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                                                c.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                                                            }`}>
                                                                                {c.status || 'Active'}
                                                                            </span>
                                                                            <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-sand shadow-xs">
                                                                                {c.count || 0} products
                                                                            </span>
                                                                        </div>

                                                                        <div className="absolute bottom-3 left-4 right-4">
                                                                            <div className="flex items-center gap-1.5 text-sand text-xs font-semibold mb-1">
                                                                                {renderCategoryIcon(c.icon, "size-4")}
                                                                                <span>Order: #{c.order}</span>
                                                                                {c.featured && (
                                                                                    <span className="flex items-center gap-0.5 text-amber-400 font-bold ml-1">
                                                                                        <Star className="size-3 fill-amber-400" /> Featured
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <h4 className="font-display text-xl font-bold text-white drop-shadow-sm">
                                                                                {c.name}
                                                                            </h4>
                                                                        </div>
                                                                    </div>

                                                                    {/* Subcategories Container */}
                                                                    <div className="p-5 space-y-3">
                                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                                            {c.description || 'পাহাড়ের খাঁটি আদিবাসী কারিগরদের ঐতিহ্যবাহী কালেকশন।'}
                                                                        </p>

                                                                        <div className="flex items-center justify-between pt-1">
                                                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                                                সাব-ক্যাটাগরি সমূহ ({c.subcategories?.length || 0} টি):
                                                                            </span>
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setActiveInlineAddCat(activeInlineAddCat === c.name ? null : c.name);
                                                                                    setInlineSubcatName('');
                                                                                }}
                                                                                className="text-xs font-bold text-primary hover:text-forest-deep flex items-center gap-1 cursor-pointer"
                                                                            >
                                                                                <Plus className="size-3.5" /> যোগ করুন
                                                                            </button>
                                                                        </div>

                                                                        {/* Inline Subcategory Add Input */}
                                                                        {activeInlineAddCat === c.name && (
                                                                            <form 
                                                                                onSubmit={(e) => handleAddSubcatToExisting(c.name, e)}
                                                                                className="flex items-center gap-2 p-2.5 rounded-2xl bg-secondary/50 border border-primary/30 animate-in fade-in duration-150"
                                                                            >
                                                                                <input 
                                                                                    type="text"
                                                                                    autoFocus
                                                                                    value={inlineSubcatName}
                                                                                    onChange={(e) => setInlineSubcatName(e.target.value)}
                                                                                    placeholder="নতুন সাব-ক্যাটাগরির নাম লিখে Enter দিন..."
                                                                                    className="flex-1 bg-background px-3 py-1.5 rounded-xl border border-input text-xs outline-none focus:border-primary text-foreground"
                                                                                />
                                                                                <button 
                                                                                    type="submit"
                                                                                    className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep cursor-pointer"
                                                                                >
                                                                                    যোগ করুন
                                                                                </button>
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => setActiveInlineAddCat(null)}
                                                                                    className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                                                                                >
                                                                                    <X className="size-4" />
                                                                                </button>
                                                                            </form>
                                                                        )}

                                                                        {/* Subcategory Pills */}
                                                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                                                            {(c.subcategories || []).map((sc) => (
                                                                                <span 
                                                                                    key={sc} 
                                                                                    className="group inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground transition-all hover:bg-secondary/80"
                                                                                >
                                                                                    {sc}
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleRemoveSubcatFromExisting(c.name, sc)}
                                                                                        className="text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                                        title={`"${sc}" সাব-ক্যাটাগরি মুছুন`}
                                                                                    >
                                                                                        <X className="size-3" />
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                            {(c.subcategories || []).length === 0 && (
                                                                                <span className="text-xs text-muted-foreground italic">
                                                                                    কোনো সাব-ক্যাটাগরি নেই।
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Card Footer Actions */}
                                                                <div className="flex items-center justify-between border-t border-border px-5 py-3.5 bg-muted/20">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setEditingCategory({
                                                                            originalName: c.name,
                                                                            id: c.id,
                                                                            name: c.name,
                                                                            slug: c.slug || generateSlug(c.name),
                                                                            icon: c.icon || 'Shirt',
                                                                            image: c.image || '/images/cat-textiles.jpg',
                                                                            banner: c.banner || '/images/hero.jpg',
                                                                            description: c.description || '',
                                                                            status: c.status || 'Active',
                                                                            order: c.order || 1,
                                                                            featured: c.featured !== false,
                                                                            commission: c.commission || 10,
                                                                            subcategories: [...(c.subcategories || [])]
                                                                        })}
                                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                                                                    >
                                                                        <Edit2 className="size-3.5" /> ক্যাটাগরি এডিট
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteCategoryWithGuard(c)}
                                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-destructive/80 hover:text-destructive cursor-pointer"
                                                                    >
                                                                        <Trash2 className="size-3.5" /> মুছুন
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* VIEW 3: VENDOR CATEGORY REQUESTS INBOX */}
                                        {categoryStudioTab === 'requests' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                                            <Mail className="size-4 text-accent" /> ভেন্ডরদের ক্যাটাগরি রিকোয়েস্ট ইনবক্স
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            পাহাড়ি কারিগররা নতুন পণ্য আপলোডের সময় উপযুক্ত ক্যাটাগরি না পেলে অ্যাডমিনের অনুমোদনের জন্য আবেদন পাঠাতে পারেন।
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left text-xs">
                                                            <thead className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border">
                                                                <tr>
                                                                    <th className="px-5 py-3.5">ভেন্ডরের নাম</th>
                                                                    <th className="px-5 py-3.5">অনুরোধকৃত নতুন ক্যাটাগরি</th>
                                                                    <th className="px-5 py-3.5">প্রস্তাবিত প্যারেন্ট ক্যাটাগরি</th>
                                                                    <th className="px-5 py-3.5">আবেদনের কারণ ও যৌক্তিকতা</th>
                                                                    <th className="px-5 py-3.5">স্ট্যাটাস</th>
                                                                    <th className="px-5 py-3.5 text-right">সিদ্ধান্ত / অ্যাকশন</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-border">
                                                                {categoryRequests.map((req) => (
                                                                    <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                                                                        <td className="px-5 py-3.5 font-semibold text-foreground">{req.vendorName}</td>
                                                                        <td className="px-5 py-3.5 font-bold text-primary">{req.requestedCategory}</td>
                                                                        <td className="px-5 py-3.5 text-muted-foreground">{req.parentCategory || 'রুট ক্যাটাগরি (Root)'}</td>
                                                                        <td className="px-5 py-3.5 text-muted-foreground max-w-xs">{req.reason}</td>
                                                                        <td className="px-5 py-3.5">
                                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                                                req.status === 'Approved' ? 'bg-primary/10 text-primary' :
                                                                                req.status === 'Rejected' ? 'bg-destructive/10 text-destructive' :
                                                                                'bg-accent/10 text-accent'
                                                                            }`}>
                                                                                {req.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-5 py-3.5 text-right space-x-2">
                                                                            {req.status === 'Pending' && (
                                                                                <>
                                                                                    <button 
                                                                                        type="button"
                                                                                        onClick={() => handleApproveCategoryRequest(req)}
                                                                                        className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold hover:bg-forest-deep cursor-pointer"
                                                                                    >
                                                                                        অনুমোদন
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button"
                                                                                        onClick={() => handleRejectCategoryRequest(req.id)}
                                                                                        className="px-3 py-1 rounded-full border border-border text-destructive hover:bg-destructive/10 text-[11px] font-semibold cursor-pointer"
                                                                                    >
                                                                                        বাতিল
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 4: DYNAMIC FIELD CONFIGURATION */}
                                {activeTab === 4 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="font-display text-xl font-bold">ক্যাটাগরি-ভিত্তিক ডাইনামিক ফিল্ড কনফিগারেশন</h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">ভেন্ডরদের পণ্য আপলোডের সময় ক্যাটাগরি অনুযায়ী বাধ্যতামূলক ফিল্ডসমূহ।</p>
                                        </div>

                                        <div className="grid gap-6">
                                            {dynamicFields && Object.entries(dynamicFields).map(([catName, fields]) => (
                                                <div key={catName} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                                                    <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                                                        <Sliders className="size-4 text-primary" /> {catName}
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {fields.map((fld, idx) => (
                                                            <div key={idx} className="p-3 rounded-xl bg-secondary/30 border border-border space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="font-semibold text-xs text-foreground">{fld.label}</p>
                                                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{fld.type}</span>
                                                                </div>
                                                                {fld.options && (
                                                                    <p className="text-[11px] text-muted-foreground truncate">
                                                                        অপশন: {fld.options.join(', ')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* TAB 5: COMMISSION & FINANCIALS */}
                                {activeTab === 5 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="font-display text-xl font-bold">কমিশন ব্যবস্থাপনা ও সার্বিক আর্থিক হিসাব</h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">প্ল্যাটফর্ম কমিশন রেট ও ভেন্ডর উইথড্রয়াল অনুমোদন।</p>
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                                <p className="text-xs font-semibold text-muted-foreground">মোট মার্কেটপ্লেস সেলস</p>
                                                <p className="font-display text-3xl font-bold text-foreground mt-2">৳ ৪,৮২,৫০০</p>
                                            </div>
                                            <div className="rounded-2xl border border-border bg-primary/10 p-5 shadow-sm">
                                                <p className="text-xs font-semibold text-primary">প্ল্যাটফর্ম নিট কমিশন আয় ({commissionRate}%)</p>
                                                <p className="font-display text-3xl font-bold text-primary mt-2">৳ ৪৮,২৫০</p>
                                            </div>
                                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                                <p className="text-xs font-semibold text-muted-foreground">ভেন্ডরদের মোট পে-আউট প্রদান</p>
                                                <p className="font-display text-3xl font-bold text-foreground mt-2">৳ ৩,৮০,০০০</p>
                                            </div>
                                        </div>

                                        {/* Commission Slider */}
                                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                                            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                                <Percent className="size-4 text-accent" /> গ্লোবাল প্ল্যাটফর্ম কমিশন রেট নির্ধারণ
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="range" 
                                                    min="5" 
                                                    max="25" 
                                                    value={commissionRate}
                                                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <span className="font-display text-xl font-bold text-primary w-16 text-right">
                                                    {commissionRate}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                বর্তমানে প্রতি সফল অর্ডারে ভেন্ডরের কাছ থেকে {commissionRate}% ফি কাটা হচ্ছে এবং বাকি {100 - commissionRate}% সরাসরি ভেন্ডর ওয়ালেটে জমা হচ্ছে।
                                            </p>
                                        </div>

                                        {/* Withdrawal Requests Table */}
                                        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                            <div className="px-6 py-4 border-b border-border bg-secondary/20">
                                                <h3 className="font-display font-bold text-base text-foreground">
                                                    ভেন্ডর উইথড্রয়াল রিকোয়েস্ট তালিকা
                                                </h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-muted text-muted-foreground uppercase text-left">
                                                        <tr>
                                                            <th className="px-5 py-3">রিকোয়েস্ট আইডি</th>
                                                            <th className="px-5 py-3">ভেন্ডর</th>
                                                            <th className="px-5 py-3">উত্তোলন পরিমাণ</th>
                                                            <th className="px-5 py-3">পেমেন্ট মেথড</th>
                                                            <th className="px-5 py-3">তারিখ</th>
                                                            <th className="px-5 py-3">স্ট্যাটাস ও অ্যাকশন</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {withdrawalRequests.map((req) => (
                                                            <tr key={req.id} className="hover:bg-muted/30">
                                                                <td className="px-5 py-3.5 font-mono font-bold">{req.id}</td>
                                                                <td className="px-5 py-3.5 font-semibold text-foreground">{req.vendor}</td>
                                                                <td className="px-5 py-3.5 font-bold text-primary">{req.amount}</td>
                                                                <td className="px-5 py-3.5 text-muted-foreground">{req.method}</td>
                                                                <td className="px-5 py-3.5 text-muted-foreground">{req.date}</td>
                                                                <td className="px-5 py-3.5">
                                                                    {req.status === 'Pending' ? (
                                                                        <button 
                                                                            onClick={() => handleApproveWithdrawal(req.id)}
                                                                            className="px-3 py-1 rounded-full bg-accent text-white font-bold text-[11px] hover:bg-terracotta-deep cursor-pointer"
                                                                        >
                                                                            অনুমোদন করুন
                                                                        </button>
                                                                    ) : (
                                                                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                                                                            সম্পন্ন (Paid)
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 6: ORDERS */}
                                {activeTab === 6 && (
                                    <div className="space-y-6">
                                        <h2 className="font-display text-xl font-bold">মার্কেটপ্লেস অর্ডার তালিকা</h2>
                                        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-muted text-muted-foreground uppercase text-left">
                                                        <tr>
                                                            <th className="px-5 py-3">অর্ডার আইডি</th>
                                                            <th className="px-5 py-3">গ্রাহক ও জেলা</th>
                                                            <th className="px-5 py-3">পণ্য</th>
                                                            <th className="px-5 py-3">মোট টাকা</th>
                                                            <th className="px-5 py-3">পেমেন্ট মেথড</th>
                                                            <th className="px-5 py-3">স্ট্যাটাস</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {orders.map((ord) => (
                                                            <tr key={ord.id} className="hover:bg-muted/30">
                                                                <td className="px-5 py-3.5 font-mono font-bold text-foreground">{ord.id}</td>
                                                                <td className="px-5 py-3.5">
                                                                    <p className="font-semibold">{ord.customer}</p>
                                                                    <p className="text-[11px] text-muted-foreground">{ord.district}</p>
                                                                </td>
                                                                <td className="px-5 py-3.5 font-medium">{ord.product}</td>
                                                                <td className="px-5 py-3.5 font-bold text-primary">{ord.total}</td>
                                                                <td className="px-5 py-3.5 text-muted-foreground">{ord.payment}</td>
                                                                <td className="px-5 py-3.5">
                                                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${statusBadgeStyles[ord.status] || 'bg-muted'}`}>
                                                                        {ord.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 7: HERO SLIDER STUDIO */}
                                {activeTab === 7 && (
                                    <AdminHeroStudio initialSlides={initialHeroSlides} />
                                )}
                            </>
                        )}

                        {/* ================= VENDOR PANELS ================= */}
                        {panelType === 'vendor' && (
                            <>
                                {/* VENDOR TAB 0: STORE PROFILE */}
                                {activeTab === 0 && (
                                    <div className="space-y-6">
                                        {/* Store Header Banner Card */}
                                        <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                                            <div className="h-44 bg-gradient-to-r from-forest-deep via-[#234E2A] to-accent/80 p-6 flex items-end">
                                                <span className="text-white text-xs font-semibold tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full backdrop-blur-xs">
                                                    Verified Hill Cooperative Store
                                                </span>
                                            </div>
                                            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center -mt-12 sm:-mt-16">
                                                <img 
                                                    src="/images/cat-textiles.jpg" 
                                                    alt="Rangamati Weaves" 
                                                    className="size-24 sm:size-28 rounded-2xl border-4 border-card object-cover shadow-md shrink-0"
                                                />
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="font-display text-2xl font-bold text-foreground">Rangamati Weaves</h2>
                                                        <ShieldCheck className="size-5 text-primary" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        রাঙ্গামাটি সদর · ১২০ জন আদিবাসী তাঁতি পরিবার · ৪.৯ ★ রেটিং (১৩২+ রিভিউ)
                                                    </p>
                                                    <p className="text-xs text-foreground/80 pt-1 leading-relaxed">
                                                        কাপ্তাই হ্রদের তীরে ঐতিহ্যবাহী কোমর তাঁত ও প্রাকৃতিক রঙে বোনা চাকমা ও তঞ্চঙ্গ্যা টেক্সটাইল সমবায়।
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => setIsWizardOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold text-accent-foreground hover:bg-terracotta-deep shadow-md cursor-pointer shrink-0"
                                                >
                                                    <Sparkles className="size-4" /> ৮-ধাপের পণ্য আপলোড
                                                </button>
                                            </div>
                                        </div>

                                        {/* Vendor Quick Metrics */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="rounded-2xl border border-border bg-card p-5">
                                                <p className="text-xs text-muted-foreground font-semibold">লাইভ পণ্য</p>
                                                <p className="font-display text-2xl font-bold text-foreground mt-1">{products.length} টি</p>
                                            </div>
                                            <div className="rounded-2xl border border-border bg-card p-5">
                                                <p className="text-xs text-muted-foreground font-semibold">চলতি মাসের অর্ডার</p>
                                                <p className="font-display text-2xl font-bold text-foreground mt-1">৪৮ টি</p>
                                            </div>
                                            <div className="rounded-2xl border border-border bg-card p-5">
                                                <p className="text-xs text-muted-foreground font-semibold">উত্তোলনযোগ্য আয়</p>
                                                <p className="font-display text-2xl font-bold text-primary mt-1">৳ {vendorBalance.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="rounded-2xl border border-border bg-card p-5">
                                                <p className="text-xs text-muted-foreground font-semibold">গ্রাহক সন্তুষ্টি</p>
                                                <p className="font-display text-2xl font-bold text-foreground mt-1">৯৯.২%</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* VENDOR TAB 1: PRODUCTS & 8-STEP WIZARD */}
                                {activeTab === 1 && (
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <h2 className="font-display text-xl font-bold">পাহাড়ি পণ্য তালিকা ও ইনভেন্টরি (Product Studio)</h2>
                                                <p className="text-xs text-muted-foreground mt-0.5">আপনার স্টোরের সমস্ত সাধারণ ও ভেরিয়েশন পণ্য, স্টক এবং মূল্য নিয়ন্ত্রণ করুন।</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsCsvModalOpen(true)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer shadow-2xs"
                                                >
                                                    <Download className="size-3.5 text-primary" /> Excel / CSV বাল্ক আপলোড
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsAttrRequestOpen(true)}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 cursor-pointer shadow-2xs"
                                                >
                                                    <Plus className="size-3.5" /> নতুন Attribute/Unit অনুরোধ
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsWizardOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-sm cursor-pointer"
                                                >
                                                    <Sparkles className="size-4" /> ৯-ধাপের পণ্য উইজার্ড
                                                </button>
                                            </div>
                                        </div>

                                        {/* Low stock warning banner */}
                                        {products.filter(p => (Number(p.stock) || 0) <= 5).length > 0 && (
                                            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                                                <div className="flex items-center gap-2.5">
                                                    <AlertCircle className="size-5 text-amber-600 shrink-0" />
                                                    <div>
                                                        <p className="font-bold">লো-স্টক সতর্কতা (Low Stock Alert):</p>
                                                        <p>আপনার {products.filter(p => (Number(p.stock) || 0) <= 5).length} টি পণ্যের স্টক ৫ বা তার নিচে নেমে গেছে! দ্রুত রি-স্টক করুন।</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[11px] font-bold">জরুরী মনোযোগ প্রয়োজন</span>
                                            </div>
                                        )}

                                        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-muted text-muted-foreground uppercase text-left">
                                                        <tr>
                                                            <th className="px-5 py-3">পণ্য</th>
                                                            <th className="px-5 py-3">ধরন (Type)</th>
                                                            <th className="px-5 py-3">SKU</th>
                                                            <th className="px-5 py-3">মূল্য (Price)</th>
                                                            <th className="px-5 py-3">মজুদ স্টক (Stock)</th>
                                                            <th className="px-5 py-3">স্ট্যাটাস</th>
                                                            <th className="px-5 py-3 text-right">অ্যাকশন (Actions)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {products.map((p) => {
                                                            const isEditing = editingProductId === p.id;
                                                            return (
                                                                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                                                    <td className="px-5 py-3.5">
                                                                        <div className="flex items-center gap-3">
                                                                            <img src={p.image} alt="" className="size-10 rounded-lg object-cover border border-border" />
                                                                            <div>
                                                                                <p className="font-semibold text-foreground">{p.name}</p>
                                                                                <p className="text-[11px] text-muted-foreground">{p.category}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        {p.product_type === 'variable' ? (
                                                                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold text-[10px]">
                                                                                ভেরিয়েশন ({p.variations?.length || 0})
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px]">
                                                                                সাধারণ (Simple)
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-5 py-3.5 font-mono text-muted-foreground">{p.sku || 'N/A'}</td>
                                                                    <td className="px-5 py-3.5 font-bold text-primary">
                                                                        {isEditing ? (
                                                                            <input 
                                                                                type="number"
                                                                                value={inlinePrice}
                                                                                onChange={(e) => setInlinePrice(e.target.value)}
                                                                                className="w-24 px-2 py-1 rounded-lg border border-primary text-xs bg-background"
                                                                                placeholder="মূল্য"
                                                                            />
                                                                        ) : (
                                                                            `৳ ${(Number(p.price) || 0).toLocaleString('en-IN')}`
                                                                        )}
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        {isEditing ? (
                                                                            <input 
                                                                                type="number"
                                                                                value={inlineStock}
                                                                                onChange={(e) => setInlineStock(e.target.value)}
                                                                                className="w-20 px-2 py-1 rounded-lg border border-primary text-xs bg-background"
                                                                                placeholder="স্টক"
                                                                            />
                                                                        ) : (
                                                                            <span className={`px-2.5 py-0.5 rounded-md font-bold ${
                                                                                (Number(p.stock) || 0) <= 5 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                                                                            }`}>
                                                                                {Number(p.stock) || 0} টি
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                                                                            {p.status || 'Active'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-right">
                                                                        <div className="inline-flex items-center gap-1.5">
                                                                            {isEditing ? (
                                                                                <>
                                                                                    <button 
                                                                                        type="button"
                                                                                        onClick={() => handleSaveInline(p.id)}
                                                                                        className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-forest-deep cursor-pointer"
                                                                                    >
                                                                                        সংরক্ষণ
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button"
                                                                                        onClick={() => setEditingProductId(null)}
                                                                                        className="px-2 py-1 rounded-lg border border-border text-[10px] hover:bg-muted cursor-pointer"
                                                                                    >
                                                                                        বাতিল
                                                                                    </button>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <button 
                                                                                        type="button"
                                                                                        title="দ্রুত মূল্য/স্টক এডিট"
                                                                                        onClick={() => {
                                                                                            setEditingProductId(p.id);
                                                                                            setInlinePrice(p.price);
                                                                                            setInlineStock(p.stock !== undefined ? p.stock : 10);
                                                                                        }}
                                                                                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                                                                    >
                                                                                        <Edit2 className="size-3.5" />
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button"
                                                                                        title="অনুলিপি (Duplicate)"
                                                                                        onClick={() => handleDuplicateProduct(p.id)}
                                                                                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                                                                    >
                                                                                        <Copy className="size-3.5" />
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button"
                                                                                        title="মুছে ফেলুন"
                                                                                        onClick={() => {
                                                                                            if (confirm(`আপনি কি "${p.name}" পণ্যটি মুছে ফেলতে চান?`)) {
                                                                                                setProducts(prev => prev.filter(x => x.id !== p.id));
                                                                                            }
                                                                                        }}
                                                                                        className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                                                                                    >
                                                                                        <Trash2 className="size-3.5" />
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* VENDOR TAB 2: ORDER FULFILLMENT */}
                                {activeTab === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="font-display text-xl font-bold">অর্ডার ট্র্যাকিং ও ডেলিভারি হ্যান্ডওভার</h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">অর্ডার প্রসেস করুন এবং কুরিয়ারে শিপমেন্ট স্ট্যাটাস দিন।</p>
                                        </div>

                                        <div className="space-y-4">
                                            {orders.map((ord) => (
                                                <div key={ord.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                                                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                                                        <div>
                                                            <span className="font-mono font-bold text-sm text-foreground">{ord.id}</span>
                                                            <span className="ml-3 text-xs text-muted-foreground">তারিখ: {ord.date}</span>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeStyles[ord.status] || 'bg-muted'}`}>
                                                            {ord.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                                        <div>
                                                            <p className="text-muted-foreground font-semibold">গ্রাহকের ঠিকানা:</p>
                                                            <p className="font-bold text-foreground mt-0.5">{ord.customer}</p>
                                                            <p className="text-muted-foreground">{ord.address}, {ord.district}</p>
                                                            <p className="text-muted-foreground">ফোন: {ord.phone}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground font-semibold">পণ্য ও পরিমাণ:</p>
                                                            <p className="font-bold text-foreground mt-0.5">{ord.product}</p>
                                                            <p className="text-muted-foreground">পরিমাণ: {ord.quantity || 1} পিস</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground font-semibold">পেমেন্ট মেথড:</p>
                                                            <p className="font-bold text-primary text-sm mt-0.5">{ord.total}</p>
                                                            <p className="text-muted-foreground">{ord.payment}</p>
                                                        </div>
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border">
                                                        {ord.status === 'Pending' && (
                                                            <button 
                                                                onClick={() => handleUpdateOrderStatus(ord.id, 'Processing')}
                                                                className="px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold hover:bg-terracotta-deep cursor-pointer"
                                                            >
                                                                প্যাক করা শুরু করুন (Processing)
                                                            </button>
                                                        )}
                                                        {ord.status === 'Processing' && (
                                                            <button 
                                                                onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                                                                className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-forest-deep cursor-pointer"
                                                            >
                                                                কুরিয়ারে দিন (Mark Shipped)
                                                            </button>
                                                        )}
                                                        {ord.status === 'Shipped' && (
                                                            <button 
                                                                onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                                                                className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-forest-deep cursor-pointer"
                                                            >
                                                                ডেলিভারি সম্পন্ন (Mark Delivered)
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* VENDOR TAB 3: EARNINGS & WITHDRAWAL */}
                                {activeTab === 3 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="font-display text-xl font-bold">ভেন্ডর আয় ও উইথড্রয়াল রিকোয়েস্ট (Wallet)</h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">আপনার বিক্রির নিট আয় নিরাপদে ব্যাংক বা বিকাশে উত্তোলন করুন।</p>
                                        </div>

                                        {/* Balance Card */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                                <p className="text-xs font-semibold text-muted-foreground">মোট বিক্রি (Gross Sales)</p>
                                                <p className="font-display text-3xl font-bold text-foreground mt-2">৳ ৮৬,৫০০</p>
                                            </div>
                                            <div className="rounded-2xl border border-border bg-secondary/50 p-6 shadow-sm">
                                                <p className="text-xs font-semibold text-accent">প্ল্যাটফর্ম কমিশন কর্তন ({commissionRate}%)</p>
                                                <p className="font-display text-3xl font-bold text-accent mt-2">- ৳ ৮,৬৫০</p>
                                            </div>
                                            <div className="rounded-2xl border border-primary bg-primary/10 p-6 shadow-sm">
                                                <p className="text-xs font-bold text-primary">উত্তোলনযোগ্য বর্তমান ব্যালেন্স</p>
                                                <p className="font-display text-3xl font-bold text-primary mt-2">
                                                    ৳ {vendorBalance.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Withdrawal Request Form */}
                                        <form onSubmit={handleVendorWithdrawSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
                                            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                                                <CreditCard className="size-4 text-primary" /> নতুন উইথড্রয়াল রিকোয়েস্ট পাঠান
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                        টাকার পরিমাণ (৳)
                                                    </label>
                                                    <input 
                                                        type="number"
                                                        value={withdrawAmount}
                                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                                        placeholder="যেমন: ১৫০০০"
                                                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-bold outline-none focus:border-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                        পেমেন্ট মেথড
                                                    </label>
                                                    <select 
                                                        value={withdrawMethod}
                                                        onChange={(e) => setWithdrawMethod(e.target.value)}
                                                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-semibold outline-none focus:border-primary"
                                                    >
                                                        <option value="bKash">bKash (বিকাশ মার্চেন্ট/পার্সোনাল)</option>
                                                        <option value="Nagad">Nagad (নগদ)</option>
                                                        <option value="Bank Account">Bank Account (ব্যাংক অ্যাকাউন্ট)</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                                        অ্যাকাউন্ট নম্বর / বিবরণ
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        value={withdrawAccount}
                                                        onChange={(e) => setWithdrawAccount(e.target.value)}
                                                        placeholder="017XXXXXXXX"
                                                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-mono outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                type="submit"
                                                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold text-primary-foreground hover:bg-forest-deep shadow-sm cursor-pointer"
                                            >
                                                <Check className="size-4" /> উইথড্রয়াল রিকোয়েস্ট সাবমিট করুন
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* 1. VENDOR APPLICATION REVIEW MODAL */}
            {selectedAppForReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl my-8 text-foreground max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-border pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-accent">ID: {selectedAppForReview.id}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        selectedAppForReview.status === 'Approved' ? 'bg-primary/15 text-primary' : selectedAppForReview.status === 'Rejected' ? 'bg-destructive/15 text-destructive' : 'bg-accent/15 text-accent'
                                    }`}>
                                        {selectedAppForReview.status}
                                    </span>
                                </div>
                                <h3 className="font-display text-2xl font-bold mt-1">{selectedAppForReview.name}</h3>
                                <p className="text-xs text-muted-foreground">{selectedAppForReview.specialty} · {selectedAppForReview.location}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedAppForReview(null)}
                                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Store Cover & Logo Preview */}
                        <div className="mt-5 relative h-36 w-full rounded-2xl overflow-hidden border border-border bg-muted">
                            <img 
                                src={selectedAppForReview.cover || '/images/hero.jpg'} 
                                alt="Store Cover Banner" 
                                className="size-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-4 flex items-center gap-3">
                                <div className="size-14 rounded-xl border-2 border-white overflow-hidden shadow-md bg-card">
                                    <img 
                                        src={selectedAppForReview.logo || '/images/cat-textiles.jpg'} 
                                        alt={selectedAppForReview.name} 
                                        className="size-full object-cover" 
                                    />
                                </div>
                                <div className="text-white drop-shadow-sm">
                                    <p className="font-display text-base font-bold leading-tight">{selectedAppForReview.name}</p>
                                    <p className="text-xs opacity-90">{selectedAppForReview.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Accordion / Sections */}
                        <div className="mt-6 space-y-5 text-xs">
                            {/* Section 1: Personal Info */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                                <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                                    <Users className="size-4 text-primary" /> ১. ব্যক্তিগত তথ্য ও এনআইডি (Personal & NID)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-muted-foreground">মালিকের নাম:</span>
                                        <p className="font-semibold text-foreground text-sm mt-0.5">{selectedAppForReview.owner}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">মোবাইল নম্বর (OTP Verified):</span>
                                        <p className="font-semibold text-foreground text-sm mt-0.5 flex items-center gap-1.5 font-mono">
                                            {selectedAppForReview.phone || '01712-449102'}
                                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                                <CheckCircle2 className="size-2.5" /> Verified
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">ইমেইল ঠিকানা:</span>
                                        <p className="font-semibold text-foreground font-mono mt-0.5">{selectedAppForReview.email || 'vendor@example.com'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">জাতীয় পরিচয়পত্র (NID):</span>
                                        <p className="font-semibold text-foreground font-mono mt-0.5">{selectedAppForReview.nidNumber || selectedAppForReview.nidOrTrade}</p>
                                    </div>
                                </div>

                                {/* NID Previews */}
                                <div>
                                    <span className="text-muted-foreground block mb-2">সংযুক্ত এনআইডি কপি (Front & Back):</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-border overflow-hidden bg-background p-2 text-center">
                                            <img src="/images/prod-shawl.jpg" alt="NID Front" className="h-20 w-full object-cover rounded-lg" />
                                            <span className="text-[10px] text-muted-foreground mt-1 block">NID Front Side</span>
                                        </div>
                                        <div className="rounded-xl border border-border overflow-hidden bg-background p-2 text-center">
                                            <img src="/images/cat-bamboo.jpg" alt="NID Back" className="h-20 w-full object-cover rounded-lg" />
                                            <span className="text-[10px] text-muted-foreground mt-1 block">NID Back Side</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Store Info */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                                <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                                    <Store className="size-4 text-primary" /> ২. স্টোরের তথ্য ও গল্প
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-muted-foreground">কারিগর পরিবার সংখ্যা:</span>
                                        <p className="font-bold text-primary mt-0.5">{selectedAppForReview.artisanCount} পরিবার</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">আবেদনের তারিখ:</span>
                                        <p className="font-semibold text-foreground mt-0.5">{selectedAppForReview.appliedDate}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">স্টোর বর্ণনা / গল্প:</span>
                                    <p className="text-foreground/90 leading-relaxed mt-0.5 bg-background p-3 rounded-xl border border-border">
                                        {selectedAppForReview.description}
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Business Documents (OPTIONAL) */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                                        <FileText className="size-4 text-primary" /> ৩. ব্যবসায়িক ডকুমেন্ট
                                    </h4>
                                    <span className="bg-sand/30 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                        দিলে হবে না দিলে হবে (ঐচ্ছিক)
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    স্ট্যাটাস: <strong className="text-foreground">{selectedAppForReview.businessDocs || 'ট্রেড লাইসেন্স দেওয়া হয়নি (ঐচ্ছিক)'}</strong>
                                </p>
                            </div>

                            {/* Section 4: Payment Details */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                                <h4 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                                    <Wallet className="size-4 text-primary" /> ৪. পেমেন্ট অ্যাকাউন্ট তথ্য
                                </h4>
                                <p className="text-foreground font-mono bg-background p-3 rounded-xl border border-border font-semibold">
                                    {selectedAppForReview.paymentMethod || 'bKash Merchant: 01712-449102'}
                                </p>
                            </div>
                        </div>

                        {/* Footer Action Buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
                            <button 
                                onClick={() => setSelectedAppForReview(null)}
                                className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted text-foreground cursor-pointer"
                            >
                                বন্ধ করুন
                            </button>

                            {selectedAppForReview.status === 'Pending' && (
                                <>
                                    <button 
                                        onClick={() => {
                                            const appToReject = selectedAppForReview;
                                            setSelectedAppForReview(null);
                                            setSelectedAppForReject(appToReject);
                                        }}
                                        className="px-5 py-2.5 rounded-full border border-destructive/30 text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                                    >
                                        বাতিল করুন
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const appToApprove = selectedAppForReview;
                                            setSelectedAppForReview(null);
                                            handleOpenApproveModal(appToApprove);
                                        }}
                                        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-sm cursor-pointer flex items-center gap-1.5"
                                    >
                                        <CheckCircle2 className="size-4" /> অনুমোদন চূড়ান্ত করুন
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. REJECTION REASON MODAL */}
            {selectedAppForReject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground">
                        <div className="flex items-start justify-between border-b border-border pb-4">
                            <div>
                                <h3 className="font-display text-xl font-bold text-destructive flex items-center gap-2">
                                    <XCircle className="size-5" /> ভেন্ডর আবেদন বাতিল করুন
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    স্টোর: <strong>{selectedAppForReject.name}</strong> ({selectedAppForReject.owner})
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedAppForReject(null)}
                                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmReject} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-2">
                                    বাতিলের মূল কারণ নির্বাচন করুন:
                                </label>
                                <div className="space-y-2">
                                    {[
                                        'NID ডকুমেন্ট অস্পষ্ট বা অসম্পূর্ণ',
                                        'পাহাড়ি ঐতিহ্যবাহী কারুশিল্পের সাথে অসামঞ্জস্যপূর্ণ',
                                        'যোগাযোগের মোবাইল বা ইমেইল ভুল/অকার্যকর',
                                        'অন্যান্য তথ্যে গরমিল'
                                    ].map((reason) => (
                                        <button
                                            type="button"
                                            key={reason}
                                            onClick={() => setRejectReasonText(reason)}
                                            className={`w-full text-left rounded-xl border p-2.5 text-xs font-medium transition-all ${
                                                rejectReasonText === reason 
                                                    ? 'border-destructive bg-destructive/10 text-destructive font-bold' 
                                                    : 'border-border bg-background hover:bg-muted text-foreground'
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    বিস্তারিত মন্তব্য বা নির্দেশনা (ভেন্ডরের ইমেইলে যাবে):
                                </label>
                                <textarea 
                                    rows="3"
                                    value={rejectReasonText}
                                    onChange={(e) => setRejectReasonText(e.target.value)}
                                    placeholder="ভেন্ডর কী সংশোধন করে পুনরায় আবেদন করতে পারবেন..."
                                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-destructive"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                                <button 
                                    type="button"
                                    onClick={() => setSelectedAppForReject(null)}
                                    className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted cursor-pointer"
                                >
                                    ফিরে যান
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 shadow-sm cursor-pointer"
                                >
                                    বাতিল চূড়ান্ত করুন ও ইমেইল পাঠান
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. APPROVAL & CREDENTIALS MODAL */}
            {selectedAppForApprove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle2 className="size-10" />
                        </div>

                        <span className="mt-4 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                            অ্যাকাউন্ট প্রস্তুত (Account Activated)
                        </span>

                        <h3 className="mt-2 font-display text-2xl font-bold">
                            ভেন্ডর অ্যাকাউন্ট অনুমোদিত হয়েছে!
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            <strong>{selectedAppForApprove.name}</strong>-এর জন্য নতুন ভেন্ডর পোর্টাল অ্যাকাউন্ট তৈরি করা হয়েছে।
                        </p>

                        {/* Credentials Card */}
                        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5 text-left space-y-3 text-xs">
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                                <span className="text-muted-foreground font-semibold">লগইন পোর্টাল:</span>
                                <span className="font-mono font-bold text-primary">paharika.com/dashboard</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                                <span className="text-muted-foreground font-semibold">ভেন্ডর ইমেইল:</span>
                                <span className="font-mono font-bold text-foreground">{selectedAppForApprove.email || 'vendor@example.com'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-semibold">অস্থায়ী পাসওয়ার্ড:</span>
                                <span className="font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                                    {selectedAppForApprove.tempPassword || 'paharika_vendor_2026'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-foreground/80 flex items-center gap-2 text-left">
                            <Mail className="size-4 text-primary shrink-0" />
                            <span>লগইন এক্সেস ও পাসওয়ার্ড স্বয়ংক্রিয়ভাবে আবেদনকারীর ইমেইলে পাঠিয়ে দেওয়া হয়েছে।</span>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <button 
                                onClick={() => {
                                    navigator.clipboard?.writeText(`Email: ${selectedAppForApprove.email}\nPassword: ${selectedAppForApprove.tempPassword}`);
                                    alert('লগইন তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!');
                                }}
                                className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted cursor-pointer"
                            >
                                তথ্য কপি করুন
                            </button>
                            <button 
                                onClick={() => {
                                    setSelectedAppForApprove(null);
                                    setPanelType('vendor');
                                }}
                                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-sm cursor-pointer"
                            >
                                ভেন্ডর হিসেবে প্যানেল দেখুন
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. EDIT CATEGORY MODAL */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setEditingCategory(null)} />
                    <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-2">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Edit2 className="size-4" />
                                </span>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-foreground">
                                        ক্যাটাগরি সম্পাদনা (Edit Category & Subcategories)
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        /category/{editingCategory.slug || 'slug'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setEditingCategory(null)}
                                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditedCategory} className="space-y-4">
                            {/* 1. Name & Display Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        ক্যাটাগরির নাম <span className="text-destructive">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ 
                                            ...editingCategory, 
                                            name: e.target.value,
                                            slug: generateSlug(e.target.value)
                                        })}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        সিরিয়াল (Order)
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={editingCategory.order || 1}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs font-bold outline-none focus:border-primary text-center"
                                    />
                                </div>
                            </div>

                            {/* 2. Slug & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        URL Slug (কাস্টম লিঙ্ক)
                                    </label>
                                    <div className="flex items-center rounded-xl border border-input bg-background px-3 py-1.5 text-xs">
                                        <span className="text-muted-foreground font-mono text-[11px] shrink-0">/category/</span>
                                        <input 
                                            type="text" 
                                            value={editingCategory.slug || ''}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                            className="w-full bg-transparent font-mono text-primary outline-none px-1 text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                                        স্ট্যাটাস (Status)
                                    </label>
                                    <select
                                        value={editingCategory.status || 'Active'}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value })}
                                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                                    >
                                        <option value="Active">Active (সক্রিয়)</option>
                                        <option value="Inactive">Inactive (নিষ্ক্রিয়)</option>
                                    </select>
                                </div>
                            </div>

                            {/* 3. Featured & Commission */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-secondary/30 p-3 border border-border">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox"
                                        id="edit-featured"
                                        checked={Boolean(editingCategory.featured)}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, featured: e.target.checked })}
                                        className="size-4 rounded text-primary focus:ring-primary cursor-pointer"
                                    />
                                    <label htmlFor="edit-featured" className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-1">
                                        <Star className="size-3.5 text-amber-500 fill-amber-500" />
                                        হোমপেজে ফিচার্ড ক্যাটাগরি
                                    </label>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold">
                                    <span>কমিশন রেট:</span>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="50"
                                        value={editingCategory.commission || 10}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, commission: Number(e.target.value) })}
                                        className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-xs font-bold text-center"
                                    />
                                    <span>%</span>
                                </div>
                            </div>

                            {/* 4. Icon Selector with 50+ eCommerce Icons */}
                            <div className="space-y-2 p-3.5 rounded-2xl bg-secondary/20 border border-border">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-semibold text-foreground">
                                        আইকন পরিবর্তন (৫০+ টি আইকন):
                                    </label>
                                    <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        {renderCategoryIcon(editingCategory.icon, "size-3.5")}
                                        <span>{ALL_CATEGORY_ICONS.find(i => i.id === editingCategory.icon)?.label || editingCategory.icon}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { id: 'Shirt', label: 'বস্ত্র' },
                                        { id: 'Coffee', label: 'চা/কফি' },
                                        { id: 'Flame', label: 'মসলা' },
                                        { id: 'TreePine', label: 'বাঁশ' },
                                        { id: 'Flower2', label: 'মাটি' },
                                        { id: 'Gem', label: 'জুয়েলারি' },
                                        { id: 'ShoppingBag', label: 'ব্যাগ' },
                                        { id: 'Sparkles', label: 'রূপচর্চা' },
                                    ].map((item) => (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => setEditingCategory({ ...editingCategory, icon: item.id })}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                                                editingCategory.icon === item.id ? 'border-primary bg-primary text-primary-foreground font-bold shadow-xs' : 'border-border bg-background text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {renderCategoryIcon(item.id, "size-3.5")}
                                            <span className="text-[11px]">{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsEditIconLibraryOpen(!isEditIconLibraryOpen)}
                                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl border border-dashed border-primary/40 bg-background/80 hover:bg-primary/5 text-primary text-xs font-bold transition-all cursor-pointer"
                                >
                                    <Search className="size-3" />
                                    <span>{isEditIconLibraryOpen ? 'আইকন লাইব্রেরি লুকান' : '🔍 আরও ৫০+ টি আইকন দেখুন ও সার্চ করুন'}</span>
                                    <ChevronDown className={`size-3 transition-transform ${isEditIconLibraryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isEditIconLibraryOpen && (
                                    <div className="space-y-2 pt-2 border-t border-border animate-in fade-in duration-200">
                                        <input 
                                            type="text" 
                                            value={iconSearchQuery}
                                            onChange={(e) => setIconSearchQuery(e.target.value)}
                                            placeholder="আইকন খুঁজুন (যেমন: ফল, বই, ঘড়ি, জুতো, tea, honey, bag...)"
                                            className="w-full px-3 py-1.5 rounded-xl border border-input bg-background text-xs outline-none focus:border-primary"
                                        />

                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
                                            {ALL_CATEGORY_ICONS
                                                .filter((item) => {
                                                    const q = iconSearchQuery.toLowerCase().trim();
                                                    return !q || 
                                                        item.id.toLowerCase().includes(q) || 
                                                        item.label.toLowerCase().includes(q) || 
                                                        item.tags.toLowerCase().includes(q);
                                                })
                                                .map((item) => {
                                                    const isSelected = editingCategory.icon === item.id;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={item.id}
                                                            onClick={() => setEditingCategory({ ...editingCategory, icon: item.id })}
                                                            className={`flex flex-col items-center justify-center p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                                                                isSelected 
                                                                    ? 'border-primary bg-primary text-primary-foreground font-bold shadow-xs' 
                                                                    : 'border-border bg-background hover:border-primary/50 text-foreground'
                                                            }`}
                                                        >
                                                            {renderCategoryIcon(item.id, "size-3.5")}
                                                            <span className="text-[9px] font-medium truncate w-full mt-0.5">
                                                                {item.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 5. Cover Image & Banner */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-secondary/20 border border-border">
                                {/* Cover Image */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-foreground">
                                            কভার ছবি (Cover Image):
                                        </label>
                                        <div className="inline-flex rounded-lg border border-border bg-background p-0.5 text-[10px] font-bold">
                                            <button
                                                type="button"
                                                onClick={() => setEditCoverImageMode('url')}
                                                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${editCoverImageMode === 'url' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditCoverImageMode('upload')}
                                                className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${editCoverImageMode === 'upload' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <Upload className="size-2.5" /> আপলোড
                                            </button>
                                        </div>
                                    </div>

                                    {editCoverImageMode === 'url' ? (
                                        <div className="space-y-1.5">
                                            <div className="flex gap-1.5">
                                                {[
                                                    { label: 'তাঁত', url: '/images/cat-textiles.jpg' },
                                                    { label: 'বাঁশ', url: '/images/cat-bamboo.jpg' },
                                                    { label: 'প্যান্ট্রি', url: '/images/cat-pantry.jpg' },
                                                    { label: 'মাটি', url: '/images/cat-pottery.jpg' },
                                                ].map((preset) => (
                                                    <button
                                                        type="button"
                                                        key={preset.url}
                                                        onClick={() => setEditingCategory({ ...editingCategory, image: preset.url, uploadedFileName: '' })}
                                                        className={`flex-1 py-1 rounded-lg border text-[10px] font-semibold text-center cursor-pointer ${
                                                            editingCategory.image === preset.url ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border'
                                                        }`}
                                                    >
                                                        {preset.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <input 
                                                type="text" 
                                                value={editingCategory.image?.startsWith('data:') ? '' : (editingCategory.image || '')}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value, uploadedFileName: '' })}
                                                placeholder="https://... বা /images/cat.jpg"
                                                className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-mono outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <label className="relative flex flex-col items-center justify-center p-3 border-2 border-dashed border-primary/30 hover:border-primary rounded-xl bg-background/60 hover:bg-primary/5 cursor-pointer transition-colors group">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageFileUpload(e.target.files?.[0], 'image', true)}
                                                    className="sr-only"
                                                />
                                                <Upload className="size-4 text-primary mb-1 group-hover:scale-110 transition-transform" />
                                                <span className="text-xs font-semibold text-foreground text-center">
                                                    ছবি আপলোড করুন
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    JPG, PNG, WEBP (সর্বোচ্চ 5MB)
                                                </span>
                                            </label>
                                            {editingCategory.image && editingCategory.image.startsWith('data:') && (
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <img src={editingCategory.image} alt="Upload thumb" className="size-7 rounded object-cover border" />
                                                        <span className="truncate text-[11px] font-medium text-foreground">
                                                            {editingCategory.uploadedFileName || 'নতুন ফাইল আপলোড হয়েছে'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setEditingCategory({ ...editingCategory, image: '/images/cat-pantry.jpg', uploadedFileName: '' })}
                                                        className="text-[10px] font-bold text-destructive hover:underline ml-2 cursor-pointer"
                                                    >
                                                        মুছুন
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Banner */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-foreground">
                                            হেডার ব্যানার (Banner):
                                        </label>
                                        <div className="inline-flex rounded-lg border border-border bg-background p-0.5 text-[10px] font-bold">
                                            <button
                                                type="button"
                                                onClick={() => setEditBannerImageMode('url')}
                                                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${editBannerImageMode === 'url' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditBannerImageMode('upload')}
                                                className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${editBannerImageMode === 'upload' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <Upload className="size-2.5" /> আপলোড
                                            </button>
                                        </div>
                                    </div>

                                    {editBannerImageMode === 'url' ? (
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] text-muted-foreground">ক্যাটাগরি পেজের হেডার ব্যানার URL</p>
                                            <input 
                                                type="text" 
                                                value={editingCategory.banner?.startsWith('data:') ? '' : (editingCategory.banner || '')}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, banner: e.target.value, bannerFileName: '' })}
                                                placeholder="/images/hero.jpg"
                                                className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-mono outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <label className="relative flex flex-col items-center justify-center p-3 border-2 border-dashed border-border hover:border-primary rounded-xl bg-background/60 hover:bg-primary/5 cursor-pointer transition-colors group">
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageFileUpload(e.target.files?.[0], 'banner', true)}
                                                    className="sr-only"
                                                />
                                                <Upload className="size-4 text-muted-foreground group-hover:text-primary mb-1 group-hover:scale-110 transition-transform" />
                                                <span className="text-xs font-semibold text-foreground text-center">
                                                    ব্যানার ফাইল নির্বাচন করুন
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    ওয়াইড রেশিও ব্যানার (1920x600)
                                                </span>
                                            </label>
                                            {editingCategory.banner && editingCategory.banner.startsWith('data:') && (
                                                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <img src={editingCategory.banner} alt="Banner thumb" className="size-7 rounded object-cover border" />
                                                        <span className="truncate text-[11px] font-medium text-foreground">
                                                            {editingCategory.bannerFileName || 'ব্যানার আপলোড হয়েছে'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setEditingCategory({ ...editingCategory, banner: '/images/hero.jpg', bannerFileName: '' })}
                                                        className="text-[10px] font-bold text-destructive hover:underline ml-2 cursor-pointer"
                                                    >
                                                        মুছুন
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 6. Short Description */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1">
                                    সংক্ষিপ্ত বিবরণ:
                                </label>
                                <textarea 
                                    rows={2}
                                    value={editingCategory.description || ''}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none"
                                />
                            </div>

                            {/* 7. Subcategories Management */}
                            <div className="space-y-2 border-t border-border pt-3">
                                <label className="block text-xs font-semibold text-foreground">
                                    সাব-ক্যাটাগরি সমূহ ({editingCategory.subcategories?.length || 0} টি):
                                </label>

                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={editSubcatInput}
                                        onChange={(e) => setEditSubcatInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = editSubcatInput.trim();
                                                if (val && !editingCategory.subcategories.includes(val)) {
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        subcategories: [...editingCategory.subcategories, val]
                                                    });
                                                    setEditSubcatInput('');
                                                }
                                            }
                                        }}
                                        placeholder="নতুন সাব-ক্যাটাগরি লিখে Enter দিন..."
                                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const val = editSubcatInput.trim();
                                            if (val && !editingCategory.subcategories.includes(val)) {
                                                setEditingCategory({
                                                    ...editingCategory,
                                                    subcategories: [...editingCategory.subcategories, val]
                                                });
                                                setEditSubcatInput('');
                                            }
                                        }}
                                        className="px-4 py-2 rounded-xl bg-secondary text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold cursor-pointer"
                                    >
                                        + যোগ
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-muted/30 border border-border min-h-12">
                                    {(editingCategory.subcategories || []).map((sub, i) => (
                                        <span 
                                            key={i} 
                                            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                                        >
                                            {sub}
                                            <button 
                                                type="button"
                                                onClick={() => setEditingCategory({
                                                    ...editingCategory,
                                                    subcategories: editingCategory.subcategories.filter((_, idx) => idx !== i)
                                                })}
                                                className="hover:text-destructive text-muted-foreground cursor-pointer"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingCategory(null)}
                                    className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted cursor-pointer"
                                >
                                    বাতিল
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-md cursor-pointer flex items-center gap-1.5"
                                >
                                    <Check className="size-4" /> পরিবর্তন সংরক্ষণ করুন
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Safety Delete Guard Modal (Blocks deletion if products exist) */}
            {deleteGuardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setDeleteGuardModal(null)} />
                    <div className="relative z-10 w-full max-w-md rounded-3xl border border-destructive/30 bg-card p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3.5">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/15 text-destructive border border-destructive/20">
                                <AlertTriangle className="size-6" />
                            </div>
                            <div>
                                <h3 className="font-display text-lg font-bold text-foreground">
                                    ক্যাটাগরি ডিলিট সুরক্ষিত (Delete Guard)
                                </h3>
                                <p className="text-xs text-muted-foreground font-semibold">
                                    অ্যাকশনটি সাময়িকভাবে ব্লক করা হয়েছে
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                                    ক্যাটাগরি: {deleteGuardModal.category.name}
                                </span>
                                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                                    {deleteGuardModal.count} টি সক্রিয় পণ্য
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                                {deleteGuardModal.message}
                            </p>
                        </div>

                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground">নিরাপদ করণীয় ধাপসমূহ:</p>
                            <ol className="list-decimal pl-4 space-y-1">
                                <li>ড্যাশবোর্ডের পণ্য তালিকা থেকে এই ক্যাটাগরির পণ্যগুলোকে অন্য কোনো সক্রিয় ক্যাটাগরিতে স্থানান্তর করুন।</li>
                                <li>অথবা সংশ্লিষ্ট পণ্যগুলো মুছে ফেলুন যদি সেগুলো বিক্রির অযোগ্য হয়।</li>
                                <li>পণ্য সংখ্যা ০ (শূন্য) হলে তবেই এই ক্যাটাগরিটি স্থায়ীভাবে মুছে ফেলা যাবে।</li>
                            </ol>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteGuardModal(null)}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-sm cursor-pointer"
                            >
                                বুঝেছি, বন্ধ করুন
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 9-Step Vendor Product Wizard Modal */}
            <VendorProductWizardModal 
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                categories={categories}
                units={initialUnits}
                attributes={initialAttributes}
                categoryAttributes={initialCategoryAttributes}
                dynamicFields={dynamicFields}
                onProductCreated={(newProd) => {
                    setProducts([newProd, ...products]);
                }}
                onCategoryRequest={(newReq) => {
                    setCategoryRequests(prev => [newReq, ...prev]);
                }}
                onRequestAttribute={() => {
                    setIsWizardOpen(false);
                    setIsAttrRequestOpen(true);
                }}
            />

            {/* Vendor Attribute / Unit Request Modal */}
            <VendorAttributeRequestModal
                isOpen={isAttrRequestOpen}
                onClose={() => setIsAttrRequestOpen(false)}
                units={initialUnits}
                attributes={initialAttributes}
            />

            {/* Excel / CSV Bulk Upload Modal */}
            {isCsvModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsCsvModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div className="flex items-center gap-2.5">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Download className="size-5" />
                                </span>
                                <div>
                                    <h3 className="font-display text-lg font-bold text-foreground">Excel / CSV বাল্ক আপলোড</h3>
                                    <p className="text-xs text-muted-foreground">একসাথে একাধিক পণ্য সহজে আপলোড করুন</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCsvModalOpen(false)} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
                            <p className="font-bold text-primary flex items-center gap-1.5">
                                <Info className="size-4 shrink-0" /> ব্যবহারের নিয়মাবলী:
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                প্রথমে আমাদের তৈরি স্ট্যান্ডার্ড নমুনা CSV টেমপ্লেটটি ডাউনলোড করে পণ্যের তথ্য (নাম, ক্যাটাগরি, মূল্য, স্টক, জেলা, বিবরণ) পূরণ করুন।
                            </p>
                            <a 
                                href="/vendor/products/template"
                                download="paharika_products_template.csv"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-1"
                            >
                                <Download className="size-3.5" /> নমুনা CSV টেমপ্লেট ডাউনলোড করুন (.csv)
                            </a>
                        </div>

                        <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-foreground mb-1.5">CSV ফাইল নির্বাচন করুন</label>
                                <input 
                                    id="vendor_csv_file"
                                    type="file" 
                                    accept=".csv,text/csv" 
                                    required
                                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-dashed border-border rounded-xl p-3"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCsvModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted cursor-pointer"
                                >
                                    বাতিল
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={csvUploading}
                                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-forest-deep shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {csvUploading ? 'আপলোড হচ্ছে...' : 'বাল্ক আপলোড নিশ্চিত করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CartProvider>
    );
}
