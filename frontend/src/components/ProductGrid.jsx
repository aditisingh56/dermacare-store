// src/components/ProductGrid.jsx
import React, { useState } from 'react';
import { Search, SlidersHorizontal, Info } from 'lucide-react';

function ProductGrid({ products = [], onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 1. Extract unique categories dynamically for navigation pills
  const categories = ['All', ...new Set(products.map(p => p.category || 'Skincare'))];

  // 2. Filter products based on search term and selected category pill
  const filteredProducts = products.filter(product => {
    const productName = product.productName || product.product_name || '';
    const brandName = product.brand || '';
    const descriptionText = product.description || '';
    const categoryName = product.category || 'Skincare';

    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          descriptionText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* Search and Filter Panel */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Bar wrapper */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by product, brand, or skin concern..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '44px',
              height: '46px',
              borderRadius: 'var(--radius-sm)'
            }}
          />
        </div>

        {/* Category Pills Navigation */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
            <SlidersHorizontal size={14} /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                border: 'none',
                background: selectedCategory === cat ? 'var(--primary-light)' : 'transparent',
                color: selectedCategory === cat ? 'var(--primary-hover)' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Display List */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>No formulations match your search query.</p>
        </div>
      ) : (
        <div className="product-grid" style={{ marginTop: 0 }}>
          {filteredProducts.map((p, idx) => {
            const isLowStock = p.stock < 10;
            const isOutOfStock = p.stock === 0;

            return (
              <div key={idx} className="product-card">
                {/* Product Card Header */}
                <div style={{ padding: '24px 24px 10px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {p.brand}
                    </span>
                    {isLowStock && !isOutOfStock && (
                      <span style={{ fontSize: '10px', backgroundColor: 'var(--warning-light)', color: 'var(--warning-dark)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                        Low Stock: {p.stock} left
                      </span>
                    )}
                    {isOutOfStock && (
                      <span style={{ fontSize: '10px', backgroundColor: 'var(--error-light)', color: 'var(--error-dark)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                        Out of Stock
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.3' }}>
                    {p.productName || p.product_name}
                  </h3>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineThickness: '1.5', flexGrow: 1, margin: 0 }}>
                    {p.description}
                  </p>
                </div>

                {/* Card Footer Divider */}
                <div style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fafafb'
                }}>
                  <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--text-main)' }}>
                    ₹{p.price}
                  </span>
                  
                  <button
                    className="btn-primary"
                    onClick={() => onAddToCart(p)}
                    disabled={isOutOfStock}
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      backgroundColor: isOutOfStock ? '#cbd5e1' : 'var(--primary)'
                    }}
                  >
                    {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
