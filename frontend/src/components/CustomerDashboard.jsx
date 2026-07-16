// src/components/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import CheckoutForm from './CheckoutForm';
import HomeLanding from './HomeLanding';
import OrderSuccessModal from './OrderSuccessModal'; 
import ProductGrid from './ProductGrid';
import CustomModal from './CustomModal';
import { Package, ShoppingCart, ClipboardList, LogOut, ShoppingBag, Trash2, Home as HomeCircle, Eye, XCircle } from 'lucide-react';

function CustomerDashboard({ username, onLogout }) { 
  const [view, setView] = useState('welcome'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Modal configurations state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: 'info', content: null, onConfirm: null });

  const showModal = (title, type, content, onConfirm = null) => {
    setModalConfig({ isOpen: true, title, type, content, onConfirm });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const [orders, setOrders] = useState([]);

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log("Using product fallbacks"));
  };

  const fetchCartItems = () => {
    fetch('http://localhost:8080/api/cart')
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.log("Cart empty or API offline"));
  };

  const fetchOrders = () => {
    fetch(`http://localhost:8080/api/orders?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        if (data) setOrders(data);
      })
      .catch(err => {
        // Fallback to empty list if server is offline
        setOrders([]);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
    fetchOrders();
  }, []);

  const addToCart = (product) => {
    fetch('http://localhost:8080/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.productId || product.product_id,
        quantity: 1,
        customerName: username
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchCartItems();
        showModal(
          "Cart Updated", 
          "success", 
          <p><strong>{product.productName || product.product_name}</strong> has been added to your shopping cart.</p>
        );
      } else {
        showModal("Addition Failed", "error", <p>{data.message}</p>);
      }
    })
    .catch(() => {
      showModal(
        "Connection Error", 
        "error", 
        <p>Unable to connect to the backend server. Please verify your Spring Boot application is active and running.</p>
      );
    });
  };

  const handleDeleteCartItem = (cartId) => {
    showModal(
      "Remove Item", 
      "confirm", 
      <p>Are you sure you want to remove this skincare formulation from your cart?</p>,
      () => {
        fetch(`http://localhost:8080/api/cart/delete/${cartId}`, { method: 'DELETE' })
          .then(() => fetchCartItems())
          .catch(() => {
            showModal(
              "Connection Error", 
              "error", 
              <p>Unable to connect to the backend server. Please verify your Spring Boot application is active and running.</p>
            );
          });
      }
    );
  };

  const handleViewOrderDetails = (order) => {
    const prodName = order.product?.productName || order.product?.product_name || order.product_name || 'Clinical Skin Care';
    showModal(
      "Order Details Receipt", 
      "info", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1.5px dashed var(--border)', padding: '20px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fafafb', fontFamily: 'inherit' }}>
        <h4 style={{ margin: '0 0 6px 0', borderBottom: '1.5px dashed var(--border)', paddingBottom: '8px', textAlign: 'center', color: 'var(--primary)', fontWeight: '700' }}>DERMACARE STORE RECEIPT</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
          <span style={{ fontWeight: '600' }}>#{order.orderId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Customer Account:</span>
          <span style={{ fontWeight: '600' }}>{username}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Skincare Product:</span>
          <span style={{ fontWeight: '600', maxWidth: '200px', textAlign: 'right' }}>{prodName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Item Quantity:</span>
          <span style={{ fontWeight: '600' }}>{order.quantity} Unit(s)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total Transaction:</span>
          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalPrice}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Placement Date:</span>
          <span style={{ fontWeight: '600' }}>{order.orderDate}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', borderTop: '1.5px dashed var(--border)', paddingTop: '10px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Delivery Status:</span>
          <span style={{ 
            fontWeight: '700', 
            color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Cancelled' ? 'var(--error)' : 'var(--warning-dark)'
          }}>
            {order.status}
          </span>
        </div>
      </div>
    );
  };

  const handleCancelOrder = (orderId) => {
    showModal(
      "Cancel Order", 
      "confirm", 
      <p>Are you sure you want to cancel this order? This will restore the product stock level and refund your transaction.</p>,
      () => {
        fetch(`http://localhost:8080/api/orders/cancel/${orderId}`, {
          method: 'PUT'
        })
        .then(res => res.json())
        .then(data => {
          fetchOrders();
          showModal("Order Cancelled", "success", <p>{data.message}</p>);
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

  const totalSpending = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.totalPrice : sum, 0);

  return (
    <div className="dashboard-container">
      {/* Sidebar Nav Specific to Customer Actions */}
      <aside className="sidebar">
        <div>
          <h2>DermaCare</h2>
          <p style={{ fontSize: '12px', opacity: 0.8, color: '#94a3b8', marginTop: '4px' }}>Welcome, {username}</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '30px' }}>
          <button onClick={() => setView('welcome')} className={`nav-item ${view === 'welcome' ? 'active' : ''}`}>
            <HomeCircle size={18} /> Customer Home
          </button>
          <button onClick={() => setView('shop')} className={`nav-item ${view === 'shop' ? 'active' : ''}`}>
            <Package size={18} /> Shop Products
          </button>
          <button onClick={() => { fetchCartItems(); setView('cart'); }} className={`nav-item ${view === 'cart' ? 'active' : ''}`}>
            <ShoppingCart size={18} /> View Cart ({cart.length})
          </button>
          <button onClick={() => setView('orders')} className={`nav-item ${view === 'orders' ? 'active' : ''}`}>
            <ClipboardList size={18} /> Order History ({orders.length})
          </button>
        </nav>
        <button className="nav-item" onClick={onLogout} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: 0, paddingTop: '20px' }}><LogOut size={16} /> System Logout</button>
      </aside>

      {/* Main Container Workspace */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '30px', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            {view === 'welcome' && 'Customer Space'}
            {view === 'shop' && 'Premium Formulations'}
            {view === 'cart' && 'Your Shopping Cart'}
            {view === 'checkout' && 'Delivery Verification'}
            {view === 'orderSuccess' && 'Order Confirmed'}
            {view === 'orders' && 'My Orders'}
          </h1>
          <div 
            className="cart-badge-indicator" 
            style={{ 
              position: 'relative', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }} 
            onClick={() => setView('cart')}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <ShoppingBag color="var(--primary)" size={20} />
            {cart.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-4px', 
                right: '-4px', 
                background: 'var(--primary)', 
                color: 'white', 
                borderRadius: '50%', 
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px', 
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {cart.length}
              </span>
            )}
          </div>
        </header>

        {view === 'welcome' && <HomeLanding onShopNow={() => setView('shop')} />}

        {view === 'shop' && (
          <ProductGrid products={products} onAddToCart={addToCart} />
        )}

        {view === 'cart' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', animation: 'fadeIn 0.3s ease-out' }}>
            {cart.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <ShoppingCart size={40} color="var(--text-muted)" style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>Your shopping cart is currently empty.</p>
              </div>
            ) : (
              <div>
                <table style={{ width: '100%', borderCollapse: 'separate' }}>
                  <thead>
                    <tr>
                      <th style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>Cart ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => {
                      const prodName = item.product?.productName || item.product?.product_name || item.product_name || 'Clinical Skin Care';
                      return (
                        <tr key={idx} className="table-row-hover">
                          <td style={{ fontWeight: '500' }}>#{item.cartId || (idx + 1)}</td>
                          <td>{username}</td>
                          <td><strong>{prodName}</strong></td>
                          <td>{item.quantity}</td>
                          <td>
                            <button 
                              onClick={() => handleDeleteCartItem(item.cartId)} 
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
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--error-light)'; e.currentTarget.style.borderColor = 'var(--error)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Total Line Items: <strong style={{ color: 'var(--text-main)' }}>{cart.length}</strong></span>
                  <button className="btn-primary" onClick={() => setView('checkout')} style={{ padding: '12px 28px', backgroundColor: '#10b981' }}>Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'checkout' && (
          <CheckoutForm 
            cartItems={cart}
            username={username}
            onOrderPlaced={() => {
              fetchOrders();
              setCart([]);
              setView('orderSuccess');
            }}
            onBackToCart={() => setView('cart')}
          />
        )}

        {view === 'orderSuccess' && (
          <OrderSuccessModal 
            onContinueShopping={() => setView('shop')} 
            onViewOrders={() => setView('orders')} 
          />
        )}

        {view === 'orders' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '25px' }}>
              <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '32px', margin: 0, fontWeight: '800' }}>{orders.length}</h2>
                <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Orders</p>
              </div>
              <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '32px', margin: 0, fontWeight: '800' }}>₹{totalSpending}</h2>
                <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Spending</p>
              </div>
              <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '32px', margin: 0, fontWeight: '800' }}>2026</h2>
                <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Premium Skincare</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              {orders.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <ClipboardList size={40} color="var(--text-muted)" style={{ marginBottom: '15px', opacity: 0.5 }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>No historical orders found under this account.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'separate', fontSize: '14px' }}>
                  <thead>
                    <tr>
                      <th style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => {
                      const prodName = order.product?.name || order.product?.productName || order.product?.product_name || order.product_name || 'Clinical Skin Care';
                      return (
                        <tr key={order.orderId || idx} className="table-row-hover">
                          <td style={{ fontWeight: '500' }}>#{order.orderId}</td>
                          <td>{username}</td>
                          <td><strong>{prodName}</strong></td>
                          <td>{order.quantity}</td>
                          <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalPrice}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{order.orderDate}</td>
                          <td>
                            <span style={{ 
                              padding: '5px 12px', 
                              borderRadius: '20px', 
                              color: order.status === 'Delivered' ? 'var(--success-dark)' : order.status === 'Cancelled' ? 'var(--error-dark)' : 'var(--warning-dark)', 
                              fontSize: '11px', 
                              fontWeight: '700', 
                              backgroundColor: order.status === 'Delivered' ? 'var(--success-light)' : order.status === 'Cancelled' ? 'var(--error-light)' : 'var(--warning-light)',
                              border: order.status === 'Delivered' ? '1px solid #a7f3d0' : order.status === 'Cancelled' ? '1px solid #fecaca' : '1px solid #fde68a'
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleViewOrderDetails(order)} 
                              style={{ 
                                background: 'transparent', 
                                color: 'var(--primary)', 
                                border: '1px solid var(--border)', 
                                padding: '6px 12px', 
                                borderRadius: 'var(--radius-sm)', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'var(--transition)'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                            >
                              <Eye size={12} /> View
                            </button>
                            {order.status === 'Processing' && (
                              <button 
                                onClick={() => handleCancelOrder(order.orderId)} 
                                style={{ 
                                  background: 'transparent', 
                                  color: 'var(--error)', 
                                  border: '1px solid var(--border)', 
                                  padding: '6px 12px', 
                                  borderRadius: 'var(--radius-sm)', 
                                  cursor: 'pointer', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '4px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  transition: 'var(--transition)'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--error-light)'; e.currentTarget.style.borderColor = 'var(--error)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                              >
                                <XCircle size={12} /> Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
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
        confirmText="Yes, Proceed"
        cancelText="Discard"
      >
        {modalConfig.content}
      </CustomModal>
    </div>
  );
}

export default CustomerDashboard;