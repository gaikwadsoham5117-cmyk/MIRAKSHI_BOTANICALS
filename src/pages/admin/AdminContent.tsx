import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Ingredient, Review } from '../../types';
import { Plus, Trash2, Edit2, Star, Sparkles, Check, X } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const { 
    ingredients, 
    saveIngredient, 
    deleteIngredient, 
    reviews, 
    saveReview, 
    deleteReview,
    settings,
    updateSettings,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'ingredients' | 'reviews' | 'hero'>('ingredients');

  // Ingredient state
  const [editingIng, setEditingIng] = useState<Partial<Ingredient> | null>(null);
  // Review state
  const [editingRev, setEditingRev] = useState<Partial<Review> | null>(null);
  // Hero text state
  const [heroForm, setHeroForm] = useState({
    heroHeading: settings.heroHeading,
    heroSubheading: settings.heroSubheading,
    ctaText: settings.ctaText
  });

  const handleSaveIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIng?.name || !editingIng?.description) {
      showToast('Name and description required.', 'error');
      return;
    }
    const ing: Ingredient = {
      id: editingIng.id || 'ing-' + Date.now().toString(36),
      name: editingIng.name,
      description: editingIng.description,
      benefits: editingIng.benefits || '',
      active: editingIng.active !== false,
      order: editingIng.order || ingredients.length + 1
    };
    await saveIngredient(ing);
    setEditingIng(null);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRev?.customerName || !editingRev?.review) {
      showToast('Customer name and review text required.', 'error');
      return;
    }
    const rev: Review = {
      id: editingRev.id || 'rev-' + Date.now().toString(36),
      customerName: editingRev.customerName,
      rating: editingRev.rating || 5,
      review: editingRev.review,
      verifiedPurchase: editingRev.verifiedPurchase !== false,
      active: editingRev.active !== false,
      createdAt: editingRev.createdAt || new Date().toISOString()
    };
    await saveReview(rev);
    setEditingRev(null);
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      heroHeading: heroForm.heroHeading,
      heroSubheading: heroForm.heroSubheading,
      ctaText: heroForm.ctaText
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
            Content, Botanical Ingredients & Reviews
          </h1>
          <p className="text-xs sm:text-sm text-[#24312B]/75 mt-0.5">
            Administer website copy, verified customer testimonials, and authentic ingredients.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EEE8D8] text-xs">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'ingredients' ? 'bg-[#174A3A] text-white' : 'text-[#24312B]/70 hover:text-[#174A3A]'
            }`}
          >
            Ingredients ({ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'reviews' ? 'bg-[#174A3A] text-white' : 'text-[#24312B]/70 hover:text-[#174A3A]'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'hero' ? 'bg-[#174A3A] text-white' : 'text-[#24312B]/70 hover:text-[#174A3A]'
            }`}
          >
            Hero Text
          </button>
        </div>
      </div>

      {/* TAB 1: INGREDIENTS */}
      {activeTab === 'ingredients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#F8F5EC] p-4 rounded-2xl border border-[#EEE8D8]">
            <p className="text-xs text-[#24312B]/80">
              Only authentic botanicals verified by Mirakshi Botanicals should be listed.
            </p>
            <button
              onClick={() => setEditingIng({ name: '', description: '', benefits: '', active: true })}
              className="px-3 py-1.5 bg-[#174A3A] hover:bg-[#2F6B4F] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Botanical Ingredient
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="bg-white p-5 rounded-2xl border border-[#EEE8D8] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#EEE8D8]">
                    <h3 className="font-serif font-bold text-base text-[#174A3A]">
                      {ing.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ing.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ing.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-[#24312B]/80 mt-2 leading-relaxed">
                    {ing.description}
                  </p>
                  {ing.benefits && (
                    <p className="text-xs text-[#2F6B4F] font-medium mt-2">
                      <strong>Benefit:</strong> {ing.benefits}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#EEE8D8] flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setEditingIng(ing)}
                    className="p-1.5 text-[#174A3A] hover:bg-[#F8F5EC] rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteIngredient(ing.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ingredient Edit Modal */}
          {editingIng && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#EEE8D8] shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-[#EEE8D8]">
                  <h3 className="font-serif text-lg font-bold text-[#174A3A]">
                    {editingIng.id ? 'Edit Ingredient' : 'New Ingredient'}
                  </h3>
                  <button onClick={() => setEditingIng(null)}>✕</button>
                </div>

                <form onSubmit={handleSaveIngredient} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#174A3A] mb-1">Ingredient Name *</label>
                    <input
                      type="text"
                      required
                      value={editingIng.name || ''}
                      onChange={e => setEditingIng({ ...editingIng, name: e.target.value })}
                      placeholder="e.g. Bhringraj (Eclipta Alba)"
                      className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#174A3A] mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingIng.description || ''}
                      onChange={e => setEditingIng({ ...editingIng, description: e.target.value })}
                      placeholder="Traditional Ayurvedic significance and extraction details..."
                      className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#174A3A] mb-1">Key Benefit</label>
                    <input
                      type="text"
                      value={editingIng.benefits || ''}
                      onChange={e => setEditingIng({ ...editingIng, benefits: e.target.value })}
                      placeholder="e.g. Supports hair roots and natural strength"
                      className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="ingActive"
                      checked={editingIng.active !== false}
                      onChange={e => setEditingIng({ ...editingIng, active: e.target.checked })}
                      className="accent-[#174A3A]"
                    />
                    <label htmlFor="ingActive" className="font-semibold text-[#174A3A]">Show on Public Website</label>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[#EEE8D8]">
                    <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#174A3A]">
                      Save Ingredient
                    </button>
                    <button type="button" onClick={() => setEditingIng(null)} className="px-4 py-2.5 border rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#F8F5EC] p-4 rounded-2xl border border-[#EEE8D8]">
            <p className="text-xs text-[#24312B]/80">
              Only publish genuine, verified customer testimonials. No auto-generated or fake reviews.
            </p>
            <button
              onClick={() => setEditingRev({ customerName: '', rating: 5, review: '', verifiedPurchase: true, active: true })}
              className="px-3 py-1.5 bg-[#174A3A] hover:bg-[#2F6B4F] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Customer Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl border border-[#EEE8D8] text-xs text-[#24312B]/60">
              No customer reviews published yet. Currently showing the authentic "Customer reviews coming soon" banner on the frontend.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#EEE8D8] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#EEE8D8]">
                      <div>
                        <h4 className="font-bold text-sm text-[#174A3A]">{rev.customerName}</h4>
                        <div className="flex text-[#C49A4A] gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-[#C49A4A]' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rev.active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-[#24312B]/80 italic mt-3">"{rev.review}"</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#EEE8D8] flex justify-end gap-2 text-xs">
                    <button onClick={() => setEditingRev(rev)} className="p-1 text-[#174A3A] hover:bg-[#F8F5EC]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteReview(rev.id)} className="p-1 text-rose-600 hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Modal */}
          {editingRev && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#EEE8D8] shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-[#EEE8D8]">
                  <h3 className="font-serif text-lg font-bold text-[#174A3A]">
                    {editingRev.id ? 'Edit Review' : 'Add Real Customer Review'}
                  </h3>
                  <button onClick={() => setEditingRev(null)}>✕</button>
                </div>

                <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#174A3A] mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={editingRev.customerName || ''}
                      onChange={e => setEditingRev({ ...editingRev, customerName: e.target.value })}
                      placeholder="e.g. Priya K."
                      className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#174A3A] mb-1">Star Rating (1-5)</label>
                    <select
                      value={editingRev.rating || 5}
                      onChange={e => setEditingRev({ ...editingRev, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#174A3A] mb-1">Review Text *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingRev.review || ''}
                      onChange={e => setEditingRev({ ...editingRev, review: e.target.value })}
                      placeholder="Customer words about fragrance, hair softness, or scalp care..."
                      className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="revActive"
                      checked={editingRev.active !== false}
                      onChange={e => setEditingRev({ ...editingRev, active: e.target.checked })}
                      className="accent-[#174A3A]"
                    />
                    <label htmlFor="revActive" className="font-semibold text-[#174A3A]">Publish on Website</label>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[#EEE8D8]">
                    <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#174A3A]">
                      Save Review
                    </button>
                    <button type="button" onClick={() => setEditingRev(null)} className="px-4 py-2.5 border rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HERO TEXT */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE8D8] shadow-xs max-w-2xl">
          <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#174A3A] mb-1">Hero Main Heading *</label>
              <input
                type="text"
                required
                value={heroForm.heroHeading}
                onChange={e => setHeroForm({ ...heroForm, heroHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-sm font-serif font-bold text-[#174A3A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#174A3A] mb-1">Hero Subheading Description *</label>
              <textarea
                rows={3}
                required
                value={heroForm.heroSubheading}
                onChange={e => setHeroForm({ ...heroForm, heroSubheading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#174A3A] mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={heroForm.ctaText}
                onChange={e => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F]"
            >
              Update Hero Copy
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
