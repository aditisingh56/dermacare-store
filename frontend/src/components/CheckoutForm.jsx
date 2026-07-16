// src/components/CheckoutForm.jsx
import React, { useState } from 'react';
import ErrorAlert from './ErrorAlert';

function CheckoutForm({ cartItems = [], username, onOrderPlaced, onBackToCart }) {
  const [shippingData, setShippingData] = useState({
    customerName: username || 'ThanushriAdi', 
    email: username ? `${username.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'thanushriadi@gmail.com',
    phone: '9876543267',
    address: 'Hyderabad, India'
  });
  const [error, setError] = useState('');

  // Calculate standard price values dynamically
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price || item.product?.price || 599) * Number(item.quantity || 1)), 0);
  const deliveryCharges = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + deliveryCharges;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (shippingData.phone.trim().length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Wrap both form metadata and item sets to prevent server constraints dropping data
    const payload = {
      ...shippingData,
      items: cartItems,
      totalAmount: grandTotal
    };

    fetch('http://localhost:8080/api/orders/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error("Server failed to process the order context.");
      return res.json();
    })
    .then(data => {
      alert(data.message || "Order Placed Successfully!");
      // FIXED: Passing the real form input data back to the dashboard layout state loop
      onOrderPlaced(shippingData); 
    })
    .catch(err => {
      setError("Failed to place order. Unable to connect to the backend server.");
    });
  };

  return (
    <div style={{ display: 'flex', gap: '25px', maxWidth: '950px', margin: '20px auto', alignItems: 'flex-start' }}>
      
      {/* LEFT ELEMENT: Delivery details form */}
      <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', flex: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <h3 style={{ color: '#00897b', margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Delivery Details</h3>
        
        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Customer Name</label>
            <input type="text" value={shippingData.customerName} onChange={(e) => setShippingData({...shippingData, customerName: e.target.value})} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Email Address</label>
            <input type="email" value={shippingData.email} onChange={(e) => setShippingData({...shippingData, email: e.target.value})} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Phone Number</label>
            <input type="text" value={shippingData.phone} onChange={(e) => setShippingData({...shippingData, phone: e.target.value})} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Delivery Address</label>
            <textarea rows="3" value={shippingData.address} onChange={(e) => setShippingData({...shippingData, address: e.target.value})} required style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'none' }}></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '15px', marginTop: '10px' }}>
            Place Order
          </button>
        </form>

        <span onClick={onBackToCart} style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#00897b', cursor: 'pointer', fontWeight: '600', fontSize: '13px', textDecoration: 'underline' }}>
          ← Return to Review Cart
        </span>
      </div>

      {/* RIGHT ELEMENT: Added dynamic totals breakdown billing panel */}
      <div style={{ width: '350px', backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Order Summary</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#475569' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Items Subtotal:</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Charges:</span>
            <span style={{ color: deliveryCharges === 0 ? '#16a34a' : '#0f172a', fontWeight: '500' }}>
              {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
            </span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#00897b' }}>
            <span>Total Amount:</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CheckoutForm;