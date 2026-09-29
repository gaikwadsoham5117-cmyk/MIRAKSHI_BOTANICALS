import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductBottleImage } from '../../assets/images';
import { 
  BOTANICAL_IMAGE_PRESETS, 
  compressImageFile 
} from '../../utils/imageUtils';
import { 
  Edit2, 
  Plus, 
  Trash2, 
  Copy, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink, 
  Package, 
  Tag, 
  Eye
} from 'lucide-react';

type ImageInputTab = 'upload' | 'url' | 'presets';

export const AdminProducts: React.FC = () => {
  const { products, updateProduct, addProduct, deleteProduct, showToast } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  
  // Image handling states
  const [imageTab, setImageTab] = useState<ImageInputTab>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [imageSizeNote, setImageSizeNote] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsCreatingNew(false);
    setFormData({ ...p });
    setUrlInput(p.imageUrl && !p.imageUrl.startsWith('data:') ? p.imageUrl : '');
    setBenefitsInput(Array.isArray(p.benefits) ? p.benefits.join('\n') : (p.benefits || ''));
    setImageSizeNote(p.imageUrl ? (p.imageUrl.startsWith('data:') ? 'Stored as compressed database photo' : 'Web URL') : '');
  };

  const handleStartCreate = () => {
    setEditingProduct(null);
    setIsCreatingNew(true);
    const newId = 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const randomSku = 'MB-OIL-' + Math.floor(100 + Math.random() * 900);
    
    // Default preset image to start with
    const defaultPreset = BOTANICAL_IMAGE_PRESETS[0];

    setFormData({
      id: newId,
      name: '',
      brand: 'Mirakshi Botanicals',
      previousBrand: 'Meera Herbal Hair Oil',
      size: '100ml',
      price: 349,
      codCharge: 50,
      codTotal: 399,
      inStock: true,
      stockCount: 100,
      description: 'Handmade Ayurvedic hair oil prepared using 100% natural herbs and cold-pressed botanical oils.',
      badge: '🌿 100% Natural Hair Care',
      benefits: [
        'Helps reduce hair fall with regular gentle scalp nourishment',
        'Helps soothe dry scalp itching and dandruff discomfort',
        'Supports healthy hair growth and natural thickness'
      ],
      imageUrl: defaultPreset.url,
      sku: randomSku,
      category: 'Herbal Hair Care'
    });
    setUrlInput('');
    setBenefitsInput(
      'Helps reduce hair fall with regular gentle scalp nourishment\nHelps soothe dry scalp itching and dandruff discomfort\nSupports healthy hair growth and natural thickness'
    );
    setImageSizeNote('Preset photo selected');
    setImageTab('upload');
  };

  const handleDuplicate = (p: Product) => {
    const newId = 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    const duplicated: Product = {
      ...p,
      id: newId,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-CPY`,
      inStock: true
    };
    addProduct(duplicated);
    showToast(`Duplicated variant created: "${duplicated.name}"`, 'success');
  };

  // Image Upload handler with client-side compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const res = await compressImageFile(file, 800, 0.82);
      setFormData(prev => ({ ...prev, imageUrl: res.dataUrl }));
      setImageSizeNote(`✓ Compressed & Ready: ${res.sizeKb} KB (${res.width}×${res.height}px)`);
      showToast(`Image uploaded & optimized (${res.sizeKb} KB) for database storage!`, 'success');
    } catch (err: any) {
      console.error('Image compression error:', err);
      showToast(err.message || 'Failed to process image file.', 'error');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      showToast('Please enter an image URL.', 'error');
      return;
    }
    setFormData(prev => ({ ...prev, imageUrl: trimmed }));
    setImageSizeNote('✓ External Web Image URL applied');
    showToast('Image URL applied to product!', 'success');
  };

  const handleSelectPreset = (presetUrl: string, presetName: string) => {
    setFormData(prev => ({ ...prev, imageUrl: presetUrl }));
    setImageSizeNote(`✓ Botanical Preset: ${presetName}`);
    showToast(`Preset "${presetName}" selected!`, 'success');
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: ProductBottleImage }));
    setImageSizeNote('Default bottle image restored');
    setUrlInput('');
    showToast('Image reset to default.', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      showToast('Please specify product name.', 'error');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      showToast('Please enter a valid price.', 'error');
      return;
    }

    const price = Number(formData.price) || 349;
    const codCharge = Number(formData.codCharge) || 50;

    // Parse benefits
    const benefitsArray = benefitsInput
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const productPayload: Product = {
      id: formData.id || ('prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6)),
      name: formData.name.trim(),
      brand: formData.brand?.trim() || 'Mirakshi Botanicals',
      previousBrand: formData.previousBrand?.trim() || 'Meera Herbal Hair Oil',
      size: formData.size?.trim() || '100ml',
      price,
      codCharge,
      codTotal: price + codCharge,
      inStock: formData.inStock !== false,
      stockCount: Number(formData.stockCount) ?? 100,
      description: formData.description?.trim() || 'Handmade Ayurvedic hair oil prepared using 100% natural herbs.',
      badge: formData.badge?.trim() || '🌿 100% Natural Hair Care',
      benefits: benefitsArray.length > 0 ? benefitsArray : ['Helps reduce hair fall', 'Supports hair growth'],
      imageUrl: formData.imageUrl?.trim() || ProductBottleImage,
      sku: formData.sku?.trim() || ('MB-' + Date.now().toString().slice(-4)),
      category: formData.category?.trim() || 'Herbal Hair Care'
    };

    if (isCreatingNew) {
      await addProduct(productPayload);
    } else {
      await updateProduct(productPayload);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const inStockCount = products.filter(p => p.inStock).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-[#174A3A] to-[#2F6B4F] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C49A4A]" />
              <span>Catalog Management & Storage</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Product Catalog & Multi-Product Display
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Register new product variants, upload high-resolution product photos, and store them permanently in the database. All products appear simultaneously on the website catalog.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/#products"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View On Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            <button
              onClick={handleStartCreate}
              className="px-5 py-3 rounded-xl bg-[#C49A4A] hover:bg-[#d4a856] active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Catalog quick KPI pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-white/70 block font-medium">Total Products</span>
            <span className="text-xl sm:text-2xl font-bold">{products.length} Products</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-white/70 block font-medium">Active In Stock</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-300">{inStockCount} Active</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-white/70 block font-medium">Website Layout</span>
            <span className="text-xl sm:text-2xl font-bold text-[#C49A4A]">Multi-Product Grid</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-white/70 block font-medium">Database Sync</span>
            <span className="text-xl sm:text-2xl font-bold text-teal-200">Firestore Cloud</span>
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#174A3A] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2F6B4F]" />
            <span>Store Products ({products.length})</span>
          </h2>
          <span className="text-xs text-[#24312B]/60">
            All variants below are visible to customers on the live website.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod, index) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-[#EEE8D8] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
            >
              {/* Variant Index Badge */}
              <div className="absolute top-3 right-3 bg-[#F8F5EC] border border-[#EEE8D8] text-[10px] font-bold text-[#174A3A] px-2 py-0.5 rounded-full z-10">
                #{index + 1}
              </div>

              {/* Product Header & Image */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl bg-[#F8F5EC] overflow-hidden border border-[#EEE8D8] flex items-center justify-center">
                  <img 
                    src={prod.imageUrl || ProductBottleImage} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ProductBottleImage;
                    }}
                  />
                  {/* Badge */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-[#174A3A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {prod.size || '100ml'}
                    </span>
                    {prod.badge && (
                      <span className="bg-[#C49A4A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs truncate max-w-[140px]">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">
                    {prod.brand} • {prod.category || 'Herbal Hair Care'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#174A3A] line-clamp-1 mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#24312B]/70 line-clamp-2 mt-1">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Pricing & Stock Details */}
              <div className="pt-3 border-t border-[#EEE8D8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-[#24312B]/60 block">Online Price</span>
                    <span className="font-bold text-base text-[#174A3A]">₹{prod.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#24312B]/60 block">COD Price</span>
                    <span className="font-semibold text-xs text-[#24312B]/80">₹{prod.price + prod.codCharge}</span>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#24312B]/60 pt-1">
                  <span className="font-mono">SKU: {prod.sku}</span>
                  <span>Stock: <strong>{prod.stockCount ?? 100} units</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#EEE8D8] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#EEE8D8] hover:bg-[#F8F5EC] text-[#174A3A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>

                <button
                  onClick={() => handleDuplicate(prod)}
                  className="p-2 rounded-xl border border-[#EEE8D8] hover:bg-[#F8F5EC] text-[#24312B]/70 hover:text-[#174A3A]"
                  title="Duplicate as new variant"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {products.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove "${prod.name}" from the store?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration & Edit Modal */}
      {(editingProduct || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 border border-[#EEE8D8] shadow-2xl my-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-[#EEE8D8]">
              <div>
                <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">
                  {isCreatingNew ? 'New Variant Registration' : 'Edit Variant Details'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#174A3A]">
                  {isCreatingNew ? 'Register New Product' : `Edit: ${editingProduct?.name}`}
                </h3>
              </div>
              <button
                onClick={() => { setEditingProduct(null); setIsCreatingNew(false); }}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">

              {/* ---------------- PRODUCT IMAGE MANAGEMENT SECTION ---------------- */}
              <div className="bg-[#F8F5EC] p-4 sm:p-5 rounded-2xl border border-[#EEE8D8] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-sm text-[#174A3A] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#2F6B4F]" />
                      <span>Product Image (Stored in Database) *</span>
                    </label>
                    <p className="text-[11px] text-[#24312B]/70 mt-0.5">
                      Upload from device, paste a web URL, or choose a botanical bottle preset.
                    </p>
                  </div>
                  {imageSizeNote && (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {imageSizeNote}
                    </span>
                  )}
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EEE8D8]">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      imageTab === 'upload' 
                        ? 'bg-[#174A3A] text-white shadow-xs' 
                        : 'text-[#24312B]/70 hover:bg-[#F8F5EC]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      imageTab === 'presets' 
                        ? 'bg-[#174A3A] text-white shadow-xs' 
                        : 'text-[#24312B]/70 hover:bg-[#F8F5EC]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C49A4A]" />
                    <span>Botanical Presets</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      imageTab === 'url' 
                        ? 'bg-[#174A3A] text-white shadow-xs' 
                        : 'text-[#24312B]/70 hover:bg-[#F8F5EC]'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Web Image URL</span>
                  </button>
                </div>

                {/* Tab 1: Upload from device */}
                {imageTab === 'upload' && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="product-file-upload"
                    />
                    <label
                      htmlFor="product-file-upload"
                      className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#8FAF8F]/50 hover:border-[#174A3A] bg-white rounded-2xl cursor-pointer transition-all hover:bg-[#8FAF8F]/5 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#174A3A]/10 group-hover:bg-[#174A3A]/20 flex items-center justify-center text-[#174A3A] mb-2 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-[#174A3A] text-xs sm:text-sm">
                        {isCompressing ? 'Compressing & Optimizing Photo...' : 'Click to Upload Product Photo from Computer or Mobile'}
                      </span>
                      <span className="text-[11px] text-[#24312B]/60 mt-1">
                        PNG, JPG, WEBP. Automatically optimized client-side for cloud database storage.
                      </span>
                    </label>
                  </div>
                )}

                {/* Tab 2: Botanical Presets */}
                {imageTab === 'presets' && (
                  <div className="space-y-2">
                    <span className="text-[11px] text-[#24312B]/70 font-semibold block">
                      Select one of our high-resolution Ayurvedic bottle photography presets:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BOTANICAL_IMAGE_PRESETS.map((preset) => {
                        const isSelected = formData.imageUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset.url, preset.name)}
                            className={`p-2 rounded-xl bg-white border text-left flex items-center gap-2.5 transition-all group ${
                              isSelected 
                                ? 'border-[#174A3A] ring-2 ring-[#174A3A]/30 bg-[#8FAF8F]/10' 
                                : 'border-[#EEE8D8] hover:border-[#8FAF8F]'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#EEE8D8]"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-[#174A3A] text-[11px] block truncate group-hover:text-[#2F6B4F]">
                                {preset.name}
                              </span>
                              <span className="text-[9px] text-[#24312B]/60 block truncate">
                                {preset.tag}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#174A3A] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: External URL */}
                {imageTab === 'url' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder="https://example.com/images/herbal-oil.jpg"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-[#EEE8D8] bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="px-4 py-2.5 rounded-xl bg-[#174A3A] text-white font-bold text-xs hover:bg-[#2F6B4F] shrink-0"
                      >
                        Apply URL
                      </button>
                    </div>
                    <span className="text-[10px] text-[#24312B]/60 block">
                      Tip: You can use direct image links from Unsplash, Cloudinary, AWS S3, or Shopify.
                    </span>
                  </div>
                )}

                {/* Live Image Preview Card */}
                {formData.imageUrl && (
                  <div className="p-3 bg-white rounded-xl border border-[#EEE8D8] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-[#F8F5EC] overflow-hidden shrink-0 border border-[#EEE8D8]">
                        <img 
                          src={formData.imageUrl} 
                          alt="Product preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-[#174A3A] text-xs block">Current Selected Photo</span>
                        <span className="text-[10px] text-[#2F6B4F] font-medium block">
                          Will be stored in database and shown on website.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold"
                    >
                      Reset Image
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Product Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mira Herbal Hair Oil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    Bottle Volume / Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.size || ''}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 100ml Bottle, 200ml Family Pack"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    Online Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price ?? 349}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] font-bold text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    COD Handling Charge (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.codCharge ?? 50}
                    onChange={e => setFormData({ ...formData, codCharge: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.stockCount ?? 100}
                    onChange={e => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs focus:bg-white"
                  />
                </div>
              </div>

              {/* Category, SKU & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category || 'Herbal Hair Care'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Herbal Hair Care"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. MB-MIRA-100"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#174A3A] mb-1">
                    Badge Overlay
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 🌿 100% Natural Hair Care"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#174A3A] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the botanical ingredients, preparation method, and hair wellness properties..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] resize-none text-xs"
                />
              </div>

              {/* Key Benefits */}
              <div>
                <label className="block font-semibold text-[#174A3A] mb-1">
                  Key Benefits (one per line)
                </label>
                <textarea
                  rows={3}
                  value={benefitsInput}
                  onChange={e => setBenefitsInput(e.target.value)}
                  placeholder="Helps reduce hair fall&#10;Supports healthy hair growth&#10;Soothes itchy scalp and dandruff"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] font-mono text-xs resize-none"
                />
              </div>

              {/* Active Stock Availability */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock !== false}
                  onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                  className="accent-[#174A3A] w-4 h-4 rounded-sm"
                />
                <label htmlFor="inStockCheck" className="font-semibold text-[#174A3A] cursor-pointer">
                  Mark Product Active & Available for Customers to Purchase Online
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#EEE8D8]">
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Save & Register Product to Database' : 'Update Product Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingProduct(null); setIsCreatingNew(false); }}
                  className="px-5 py-3.5 rounded-xl text-xs font-semibold border border-[#EEE8D8] text-[#24312B]/80 hover:bg-[#F8F5EC] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
