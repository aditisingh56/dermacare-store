// src/components/HomeLanding.jsx
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

function HomeLanding({ onShopNow }) {
  const featuredProducts = [
    { image: '/niacinamide.jpg', name: 'Niacinamide 10% Serum', price: '599' },
    { image: '/sunscreen.jpg', name: 'Aqualogica SPF 50 Sunscreen', price: '499' },
    { image: '/moisturizer.jpg', name: 'Ceramide Moisturizer Cream', price: '799' }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* HERO BANNER SECTION */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
        padding: '50px 40px', 
        backgroundColor: '#ffffff', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border)', 
        marginBottom: '40px', 
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap-reverse'
      }}>
        {/* Left Column Content */}
        <div style={{ flex: '1.2', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-hover)', padding: '8px 18px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', marginBottom: '20px', border: '1px solid var(--primary-border)' }}>
            <Sparkles size={14} /> Dermatologist Recommended Formulations
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', letterSpacing: '-1px', lineHeight: '1.2' }}>
            Healthy Skin Starts Here
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16.5px', margin: '0 0 30px 0', maxWidth: '550px', lineHeight: '1.6' }}>
            Discover advanced, clinical skin treatments optimized for your daily routine. Designed to restore, nourish, and protect your skin barrier.
          </p>
          <button className="btn-primary" onClick={onShopNow} style={{ padding: '14px 32px', fontSize: '15px' }}>
            Shop Collection Now <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Column Hero Image */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/hero.jpg" 
            alt="Premium Skincare Products Line" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '280px',
              objectFit: 'cover', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)',
              transition: 'var(--transition)'
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </div>

      {/* FEATURED INLINE GRID SECTION */}
      <h3 style={{ fontSize: '22px', color: 'var(--text-main)', marginBottom: '25px', fontWeight: '800', letterSpacing: '-0.5px' }}>Trending Formulations</h3>
      <div className="product-grid">
        {featuredProducts.map((p, idx) => (
          <div key={idx} className="product-card" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '220px', overflow: 'hidden', borderBottom: '1px solid var(--border)', backgroundColor: '#fafafb' }}>
              <img 
                src={p.image} 
                alt={p.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <h4 style={{ fontSize: '16px', color: 'var(--text-main)', margin: '0 0 6px 0', fontWeight: '700' }}>{p.name}</h4>
              <p style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: '800', margin: '0 0 20px 0' }}>₹{p.price}</p>
              <button className="btn-primary" onClick={onShopNow} style={{ width: '100%', padding: '12px' }}>
                View Formulation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeLanding;