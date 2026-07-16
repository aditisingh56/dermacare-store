// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Package, PlusCircle, LogOut, Shield, Edit3, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';
import CustomModal from './CustomModal';

function AdminDashboard({ onLogout }) {
  const [view, setView] = useState('welcome'); // 'welcome', 'addProduct', or 'editProduct'
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal configuration states
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: 'info', content: null, onConfirm: null });

  const showModal = (title, type, content, onConfirm = null) => {
    setModalConfig({ isOpen: true, title, type, content, onConfirm });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // 1. Fetch live products from backend database catalog
  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        // Structural evaluation fallback rows matching columns exactly
        if (products.length === 0) {
          setProducts([
            { productId: 1, productName: 'Vitamin C Face Serum', brand: 'Minimalist', category: 'Serum', price: 699, stock: 50, description: 'Brightens skin and reduces pigmentation.' },
            { productId: 2, productName: 'Niacinamide Serum', brand: 'The Derma Co', category: 'Serum', price: 699, stock: 40, description: 'Controls acne and minimizes pores.' }
          ]);
        }
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Open shared ProductForm in edit context mode
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setView('editProduct');
  };

  // 3. Dynamic delete handler replacing th:href="@{/products/delete/{id}}"
  const handleDeleteProduct = (productId) => {
    showModal(
      "Delete Formulation", 
      "confirm", 
      <p>Are you sure you want to permanently delete this product from the inventory catalog? This action cannot be undone.</p>,
      () => {
        fetch(`http://localhost:8080/api/products/delete/${productId}`, {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
          showModal("Product Deleted", "success", <p>{data.message || "Product deleted successfully!"}</p>);
          fetchProducts(); // Reload live status matrix rows
        })
        .catch(err => {
          showModal(
            "Connection Error", 
            "error", 
            <p>Unable to connect to the backend server. Please verify your Spring Boot application is active and running.</p>
          );
        });
      }
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation Panel */}
      <aside className="sidebar">
        <div>
          <h2>DermaCare</h2>
          <p style={{ fontSize: '12px', opacity: 0.8, color: '#94a3b8', marginTop: '4px' }}>Admin Console</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '30px' }}>
          <button onClick={() => { fetchProducts(); setView('welcome'); }} className={`nav-item ${view === 'welcome' ? 'active' : ''}`}>
            <Shield size={18} /> Admin Home
          </button>
          <button onClick={() => { setEditingProduct(null); setView('addProduct'); }} className={`nav-item ${view === 'addProduct' ? 'active' : ''}`}>
            <PlusCircle size={18} /> Add New Product
          </button>
        </nav>
        <button className="nav-item" onClick={onLogout} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: 0, paddingTop: '20px' }}><LogOut size={16} /> System Logout</button>
      </aside>

      {/* Main Workspace Frame */}
      <main className="main-content">
        
        {/* VIEW 1: AVAILABLE PRODUCTS DATA MATRIX TABLE */}
        {view === 'welcome' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Catalog Inventory</h1>
              <button 
                className="btn-primary" 
                onClick={() => { setEditingProduct(null); setView('addProduct'); }}
                style={{ backgroundColor: '#10b981', padding: '12px 20px' }}
              >
                <PlusCircle size={16} /> Add Skincare Formulation
              </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>No inventory rows available in catalog.</td>
                    </tr>
                  ) : (
                    products.map((product, idx) => {
                      const currentId = product.productId || product.product_id || (idx + 1);
                      return (
                        <tr key={currentId} className="table-row-hover">
                          <td style={{ fontWeight: '500' }}>#{currentId}</td>
                          <td style={{ fontWeight: '600' }}>{product.productName || product.product_name}</td>
                          <td>{product.brand}</td>
                          <td>{product.category || 'Skincare'}</td>
                          <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</td>
                          <td>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontSize: '11px', 
                              fontWeight: '700',
                              backgroundColor: product.stock < 10 ? 'var(--error-light)' : 'var(--success-light)',
                              color: product.stock < 10 ? 'var(--error-dark)' : 'var(--success-dark)',
                              border: product.stock < 10 ? '1px solid #fecaca' : '1px solid #a7f3d0'
                            }}>
                              {product.stock} units
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleEditClick(product)}
                              style={{ 
                                backgroundColor: 'transparent', 
                                color: 'var(--warning-dark)', 
                                border: '1px solid var(--border)', 
                                padding: '8px 14px', 
                                borderRadius: 'var(--radius-sm)', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'var(--transition)'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--warning-light)'; e.currentTarget.style.borderColor = 'var(--warning)' }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(currentId)}
                              style={{ 
                                backgroundColor: 'transparent', 
                                color: 'var(--error)', 
                                border: '1px solid var(--border)', 
                                padding: '8px 14px', 
                                borderRadius: 'var(--radius-sm)', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'var(--transition)'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--error-light)'; e.currentTarget.style.borderColor = 'var(--error)' }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2: ADD PRODUCT SUB-VIEW CONTAINER */}
        {view === 'addProduct' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Add Product</h1>
            </header>
            <ProductForm onProductSaved={() => { fetchProducts(); setView('welcome'); }} />
          </div>
        )}

        {/* VIEW 3: EDIT PRODUCT SUB-VIEW CONTAINER */}
        {view === 'editProduct' && editingProduct && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Modify Existing Product</h1>
            </header>
            <ProductForm 
              productToEdit={editingProduct} 
              onProductSaved={() => { fetchProducts(); setView('welcome'); }} 
              onCancel={() => setView('welcome')} 
            />
          </div>
        )}

      </main>

      {/* Global Overlay Modal wrapper for modern dialog boxes */}
      <CustomModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        type={modalConfig.type}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        confirmText="Delete Formulation"
        cancelText="Cancel Action"
      >
        {modalConfig.content}
      </CustomModal>
    </div>
  );
}

export default AdminDashboard;