// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import ErrorAlert from './ErrorAlert'; // Imported our inline error handler!

function ProductForm({ productToEdit, onProductSaved, onCancel }) {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  });
  const [error, setError] = useState(''); // Tracking state hook for form/API failures

  // Populates form fields instantly if an edit target is passed down
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        productId: productToEdit.product_id || productToEdit.productId || '',
        productName: productToEdit.product_name || productToEdit.productName || '',
        brand: productToEdit.brand || '',
        category: productToEdit.category || '',
        price: productToEdit.price || '',
        stock: productToEdit.stock || '',
        description: productToEdit.description || ''
      });
    }
  }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear past errors on form submission

    const isEdit = window.Boolean(formData.productId);
    const url = isEdit 
      ? 'http://localhost:8080/api/products/update' 
      : 'http://localhost:8080/api/products/save';
    
    const method = isEdit ? 'PUT' : 'POST';

    // Simple client-side data validations before execution
    if (parseFloat(formData.price) <= 0) {
      setError("Product valuation price must be a positive integer greater than zero.");
      return;
    }

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("API transaction processing context failure.");
      return res.json();
    })
    .then(data => {
      alert(data.message || `Product ${isEdit ? 'Updated' : 'Saved'} Successfully!`);
      if (!isEdit) {
        setFormData({ productId: '', productName: '', brand: '', category: '', price: '', stock: '', description: '' });
      }
      onProductSaved(); 
    })
    .catch(err => {
      // Gracefully pipe connectivity failures to inline UI warning
      setError(`Failed to synchronize item details. Verify your backend controller endpoints and MySQL server are operational.`);
    });
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '750px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <h3 style={{ color: '#00897b', margin: '0 0 25px 0', fontSize: '18px', fontWeight: '600' }}>
        {formData.productId ? '📝 Edit Inventory Product' : '✨ Add New Skincare Formulation'}
      </h3>

      {/* Dynamic alert banner rendering right here */}
      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Row 1: Name & Brand */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Product Name</label>
            <input type="text" value={formData.productName} onChange={(e) => { setError(''); setFormData({...formData, productName: e.target.value}); }} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Brand</label>
            <input type="text" value={formData.brand} onChange={(e) => { setError(''); setFormData({...formData, brand: e.target.value}); }} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
        </div>

        {/* Row 2: Category, Price, & Stock */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Category</label>
            <input type="text" value={formData.category} onChange={(e) => { setError(''); setFormData({...formData, category: e.target.value}); }} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Price (₹)</label>
            <input type="number" step="0.01" value={formData.price} onChange={(e) => { setError(''); setFormData({...formData, price: e.target.value}); }} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Stock Units</label>
            <input type="number" value={formData.stock} onChange={(e) => { setError(''); setFormData({...formData, stock: e.target.value}); }} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>
        </div>

        {/* Row 3: Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Formulation Description</label>
          <textarea rows="4" value={formData.description} onChange={(e) => { setError(''); setFormData({...formData, description: e.target.value}); }} style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'none' }}></textarea>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 2, padding: '12px', fontSize: '15px' }}>
            {formData.productId ? 'Update Existing Record' : 'Save Product to Catalog'}
          </button>
          {formData.productId && onCancel && (
            <button type="button" onClick={onCancel} style={{ flex: 1, backgroundColor: '#64748b', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;