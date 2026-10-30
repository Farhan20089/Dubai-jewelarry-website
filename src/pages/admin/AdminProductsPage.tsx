import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  SlidersHorizontal,
  X,
  Check,
  Gem,
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { Product, GoldPurity, GenderCategory } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, collections, addProduct, updateProduct, deleteProduct, duplicateProduct } = useStoreData();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [purityFilter, setPurityFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: categories[0]?.name || 'Gold Rings',
    collection: collections[0]?.name || 'Dubai Collection',
    gender: 'Women' as GenderCategory,
    description: '',
    price: 5000,
    goldPurity: '22K' as GoldPurity,
    weight: 15.0,
    makingCharge: 450,
    stoneCharge: 0,
    discountPercent: 0,
    stock: 5,
    sizes: '6, 7, 8, 9',
    imageUrl: '/src/assets/images/craftsmanship_artisan_1790862790908.jpg',
    tags: 'Handcrafted, Dubai Souk, 22K',
    badge: '' as any,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isExclusive: false,
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (purityFilter !== 'All' && p.goldPurity !== purityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, purityFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `DGJ-${Date.now().toString().slice(-4)}`,
      category: categories[0]?.name || 'Gold Rings',
      collection: collections[0]?.name || 'Dubai Collection',
      gender: 'Women',
      description: '',
      price: 6500,
      goldPurity: '22K',
      weight: 18.0,
      makingCharge: 550,
      stoneCharge: 0,
      discountPercent: 0,
      stock: 5,
      sizes: '6, 7, 8, 9',
      imageUrl: '/src/assets/images/craftsmanship_artisan_1790862790908.jpg',
      tags: 'Handcrafted, Dubai Souk',
      badge: null,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      isExclusive: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      collection: p.collection,
      gender: p.gender,
      description: p.description,
      price: p.price,
      goldPurity: p.goldPurity,
      weight: p.weight,
      makingCharge: p.makingCharge,
      stoneCharge: p.stoneCharge,
      discountPercent: p.discountPercent,
      stock: p.stock,
      sizes: p.availableSizes ? p.availableSizes.join(', ') : '',
      imageUrl: p.images[0] || '/src/assets/images/craftsmanship_artisan_1790862790908.jpg',
      tags: p.tags.join(', '),
      badge: p.badge || '',
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      isExclusive: p.isExclusive,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalogue?`)) {
      deleteProduct(id);
      showToast('Product removed successfully', 'info');
    }
  };

  const handleDuplicateProduct = (id: string) => {
    const copy = duplicateProduct(id);
    showToast(`Created duplicate: "${copy.name}"`, 'success');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) return;

    const parsedSizes = formData.sizes
      ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const parsedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Jewellery'];

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        collection: formData.collection,
        gender: formData.gender,
        description: formData.description,
        price: Number(formData.price),
        goldPurity: formData.goldPurity,
        weight: Number(formData.weight),
        makingCharge: Number(formData.makingCharge),
        stoneCharge: Number(formData.stoneCharge),
        discountPercent: Number(formData.discountPercent),
        stock: Number(formData.stock),
        availableSizes: parsedSizes,
        images: [formData.imageUrl],
        tags: parsedTags,
        badge: (formData.badge as any) || null,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        isExclusive: formData.isExclusive,
      });
      showToast('Product updated successfully.', 'success');
    } else {
      addProduct({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        collection: formData.collection,
        gender: formData.gender,
        description: formData.description,
        price: Number(formData.price),
        goldPurity: formData.goldPurity,
        weight: Number(formData.weight),
        makingCharge: Number(formData.makingCharge),
        stoneCharge: Number(formData.stoneCharge),
        discountPercent: Number(formData.discountPercent),
        stock: Number(formData.stock),
        availableSizes: parsedSizes,
        images: [formData.imageUrl],
        tags: parsedTags,
        badge: (formData.badge as any) || null,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        isExclusive: formData.isExclusive,
        rating: 5.0,
        reviewsCount: 0,
        hallmarked: true,
      });
      showToast('New product added to catalogue.', 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Jewellery Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
            Product Management ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Jewellery Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={purityFilter}
            onChange={(e) => setPurityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Purities</option>
            <option value="24K">24K Gold</option>
            <option value="22K">22K Gold</option>
            <option value="21K">21K Gold</option>
            <option value="18K">18K Gold</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Purity</th>
                <th className="p-4 font-semibold">Weight</th>
                <th className="p-4 font-semibold">Base Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-stone-950 overflow-hidden shrink-0 border border-stone-800">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-100 block max-w-[200px] truncate">
                        {p.name}
                      </span>
                      {p.badge && (
                        <span className="text-[10px] font-bold text-amber-400 uppercase">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-stone-400">{p.sku}</td>
                  <td className="p-4 text-stone-300">{p.category}</td>
                  <td className="p-4 font-bold text-amber-400">{p.goldPurity}</td>
                  <td className="p-4 text-stone-300 tabular-nums">{p.weight}g</td>
                  <td className="p-4 font-bold text-amber-300 tabular-nums">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.stock === 0
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : p.stock <= 3
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(p.id)}
                        className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                        title="Duplicate product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif-luxury font-bold text-stone-100 mb-4 pb-2 border-b border-stone-800">
              {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-200"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Collection</label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-200"
                  >
                    {collections.map((col) => (
                      <option key={col.id} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Purity</label>
                  <select
                    value={formData.goldPurity}
                    onChange={(e) => setFormData({ ...formData, goldPurity: e.target.value as GoldPurity })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-200"
                  >
                    <option value="24K">24K</option>
                    <option value="22K">22K</option>
                    <option value="21K">21K</option>
                    <option value="18K">18K</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Price (AED)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Weight (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Making Charge</label>
                  <input
                    type="number"
                    value={formData.makingCharge}
                    onChange={(e) => setFormData({ ...formData, makingCharge: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-semibold">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Image URL or Local Asset Path</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded text-stone-100"
                />
              </div>

              {/* Badges / Checkboxes */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExclusive}
                    onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Exclusive</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
