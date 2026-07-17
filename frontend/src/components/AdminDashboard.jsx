// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  PlusCircle, 
  LogOut, 
  Shield, 
  Edit3, 
  Trash2, 
  ClipboardList, 
  BarChart3, 
  Download, 
  Search, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  Plus, 
  Minus,
  Eye
} from 'lucide-react';
import ProductForm from './ProductForm';
import CustomModal from './CustomModal';

function AdminDashboard({ onLogout }) {
  const [view, setView] = useState('welcome'); // 'welcome' (catalog), 'addProduct', 'editProduct', 'orders', 'reports'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filters and search states for orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Reports time filter
  const [reportTimeFilter, setReportTimeFilter] = useState('All Time'); // 'All Time', 'Today', 'Last 7 Days', 'This Month'

  // Modal configuration states
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: 'info', content: null, onConfirm: null });

  const showModal = (title, type, content, onConfirm = null) => {
    setModalConfig({ isOpen: true, title, type, content, onConfirm });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // 1. Fetch live products
  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        if (products.length === 0) {
          setProducts([
            { productId: 1, productName: 'Vitamin C Face Serum', brand: 'Minimalist', category: 'Serum', price: 699, stock: 50, description: 'Brightens skin and reduces pigmentation.' },
            { productId: 2, productName: 'Niacinamide Serum', brand: 'The Derma Co', category: 'Serum', price: 699, stock: 40, description: 'Controls acne and minimizes pores.' }
          ]);
        }
      });
  };

  // 2. Fetch live orders
  const fetchOrders = () => {
    fetch('http://localhost:8080/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => {
        console.log("Error fetching orders:", err);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // 3. Quick stock update handler (+/- restock controls)
  const handleQuickStockUpdate = (product, change) => {
    const updatedStock = Math.max(0, product.stock + change);
    const updatedProduct = {
      ...product,
      productId: product.productId || product.product_id,
      productName: product.productName || product.product_name,
      stock: updatedStock
    };

    fetch('http://localhost:8080/api/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    })
    .then(res => res.json())
    .then(data => {
      fetchProducts(); // Reload live catalog rows
      fetchOrders();   // Reload orders to ensure reports stay in sync
    })
    .catch(err => {
      showModal("Connection Error", "error", <p>Unable to update stock levels. Verify your backend is running.</p>);
    });
  };

  // 4. Open product edit view
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setView('editProduct');
  };

  // 5. Delete product
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
          fetchProducts();
        })
        .catch(err => {
          showModal("Connection Error", "error", <p>Unable to contact backend server.</p>);
        });
      }
    );
  };

  // 6. Update order status endpoint handler
  const handleOrderStatusChange = (orderId, newStatus) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchOrders();   // Reload order logs
        fetchProducts(); // Reload stock availability matrix in catalog
      } else {
        showModal("Status Update Failed", "error", <p>{data.message}</p>);
      }
    })
    .catch(err => {
      showModal("Connection Error", "error", <p>Unable to contact backend server to update order status.</p>);
    });
  };

  // 7. View customer receipt details
  const handleViewOrderReceipt = (order) => {
    const prodName = order.product?.productName || order.product?.product_name || order.product_name || 'Clinical Skin Care';
    const email = order.customer?.email || 'N/A';
    const phone = order.customer?.phone || 'N/A';
    const address = order.customer?.address || 'N/A';

    showModal(
      "Order Details Receipt", 
      "info", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1.5px dashed var(--border)', padding: '20px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fafafb', fontFamily: 'inherit' }}>
        <h4 style={{ margin: '0 0 6px 0', borderBottom: '1.5px dashed var(--border)', paddingBottom: '8px', textAlign: 'center', color: 'var(--primary)', fontWeight: '700' }}>DERMACARE OFFICIAL RECEIPT</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
          <span style={{ fontWeight: '600' }}>#{order.orderId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
          <span style={{ fontWeight: '600' }}>{order.customer?.customerName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Email Address:</span>
          <span style={{ fontWeight: '600' }}>{email}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Contact Number:</span>
          <span style={{ fontWeight: '600' }}>{phone}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Shipping Address:</span>
          <span style={{ fontWeight: '600', maxWidth: '200px', textAlign: 'right' }}>{address}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Product:</span>
          <span style={{ fontWeight: '600' }}>{prodName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
          <span style={{ fontWeight: '600' }}>{order.quantity} units</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total Transaction:</span>
          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalPrice}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Order Date:</span>
          <span style={{ fontWeight: '600' }}>{order.orderDate}</span>
        </div>
      </div>
    );
  };

  // 8. Export filtered orders as CSV
  const handleExportCSV = (filteredList) => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Product Name', 'Quantity', 'Total Price (INR)', 'Status'];
    const rows = filteredList.map(o => [
      o.orderId,
      o.orderDate,
      o.customer?.customerName || 'N/A',
      o.customer?.email || 'N/A',
      o.product?.productName || o.product?.product_name || o.product_name || 'N/A',
      o.quantity,
      o.totalPrice,
      o.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Dermacare_Order_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 9. FILTER & SORT LOGIC FOR ORDERS
  const filteredOrders = orders.filter(o => {
    const custName = o.customer?.customerName || '';
    const custEmail = o.customer?.email || '';
    const prodName = o.product?.productName || o.product?.product_name || o.product_name || '';
    const orderIdStr = String(o.orderId);

    const matchesSearch = custName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          custEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          prodName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          orderIdStr.includes(orderSearch);

    const matchesStatus = orderStatusFilter === 'All' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.orderId - a.orderId); // Show newest orders first

  // 10. ANALYTICS CALCULATIONS
  // Apply time filters to orders
  const getFilteredOrdersByTime = () => {
    const now = new Date();
    return orders.filter(o => {
      if (!o.orderDate) return false;
      const oDate = new Date(o.orderDate);
      if (reportTimeFilter === 'Today') {
        return oDate.toDateString() === now.toDateString();
      } else if (reportTimeFilter === 'Last 7 Days') {
        const diffTime = Math.abs(now - oDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      } else if (reportTimeFilter === 'This Month') {
        return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear();
      }
      return true; // All time
    });
  };

  const activeReportsOrders = getFilteredOrdersByTime();
  const nonCancelledOrders = activeReportsOrders.filter(o => o.status !== 'Cancelled');
  
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrdersCount = nonCancelledOrders.length;
  const uniqueCustomersCount = new Set(nonCancelledOrders.map(o => o.customer?.email).filter(Boolean)).size;
  const averageOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : '0.00';

  // Category wise sales breakdown
  const categorySalesMap = {};
  nonCancelledOrders.forEach(o => {
    const cat = o.product?.category || 'Skincare';
    categorySalesMap[cat] = (categorySalesMap[cat] || 0) + o.totalPrice;
  });

  const categorySales = Object.keys(categorySalesMap).map(cat => ({
    name: cat,
    value: categorySalesMap[cat]
  })).sort((a, b) => b.value - a.value);

  // Top products list
  const topProductsMap = {};
  nonCancelledOrders.forEach(o => {
    const name = o.product?.productName || o.product?.product_name || o.product_name || 'Clinical Skin Care';
    if (!topProductsMap[name]) {
      topProductsMap[name] = { quantity: 0, revenue: 0 };
    }
    topProductsMap[name].quantity += o.quantity;
    topProductsMap[name].revenue += o.totalPrice;
  });

  const topProducts = Object.keys(topProductsMap).map(name => ({
    name,
    quantity: topProductsMap[name].quantity,
    revenue: topProductsMap[name].revenue
  })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  const lowStockWarnings = products.filter(p => p.stock < 10);

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation Panel */}
      <aside className="sidebar">
        <div>
          <h2>DermaCare</h2>
          <p style={{ fontSize: '12px', opacity: 0.8, color: '#94a3b8', marginTop: '4px' }}>Admin Console</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '30px' }}>
          <button onClick={() => { fetchProducts(); setView('welcome'); }} className={`nav-item ${view === 'welcome' || view === 'addProduct' || view === 'editProduct' ? 'active' : ''}`}>
            <Shield size={18} /> Catalog & Stock
          </button>
          <button onClick={() => { fetchOrders(); setView('orders'); }} className={`nav-item ${view === 'orders' ? 'active' : ''}`}>
            <ClipboardList size={18} /> Orders Panel
          </button>
          <button onClick={() => { fetchOrders(); fetchProducts(); setView('reports'); }} className={`nav-item ${view === 'reports' ? 'active' : ''}`}>
            <BarChart3 size={18} /> Reports & Stats
          </button>
        </nav>
        <button className="nav-item" onClick={onLogout} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: 0, paddingTop: '20px' }}><LogOut size={16} /> System Logout</button>
      </aside>

      {/* Main Workspace Frame */}
      <main className="main-content">
        
        {/* VIEW 1: CATALOG INVENTORY & STOCK MATRIX */}
        {view === 'welcome' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Catalog & Stock</h1>
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
                    <th style={{ width: '180px' }}>Stock Control</th>
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
                      const isLowStock = product.stock < 10;
                      return (
                        <tr key={currentId} className="table-row-hover">
                          <td style={{ fontWeight: '500' }}>#{currentId}</td>
                          <td style={{ fontWeight: '600' }}>{product.productName || product.product_name}</td>
                          <td>{product.brand}</td>
                          <td>{product.category || 'Skincare'}</td>
                          <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</td>
                          {/* QUICK STOCK CONTROL COLUMNS */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button 
                                onClick={() => handleQuickStockUpdate(product, -1)}
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  color: '#475569'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                              >
                                <Minus size={12} />
                              </button>
                              
                              <span style={{ 
                                minWidth: '55px', 
                                textAlign: 'center',
                                padding: '4px 8px', 
                                borderRadius: '20px', 
                                fontSize: '12px', 
                                fontWeight: '700',
                                backgroundColor: isLowStock ? 'var(--error-light)' : 'var(--success-light)',
                                color: isLowStock ? 'var(--error-dark)' : 'var(--success-dark)',
                                border: isLowStock ? '1px solid #fecaca' : '1px solid #a7f3d0'
                              }}>
                                {product.stock} units
                              </span>

                              <button 
                                onClick={() => handleQuickStockUpdate(product, 1)}
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  color: '#475569'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
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

        {/* VIEW 2: ORDERS MANAGEMENT VIEW */}
        {view === 'orders' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Orders Panel</h1>
              <button 
                className="btn-primary" 
                onClick={() => handleExportCSV(filteredOrders)}
                disabled={filteredOrders.length === 0}
                style={{ backgroundColor: '#0d9488', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={16} /> Export CSV Report ({filteredOrders.length})
              </button>
            </div>

            {/* Filter and search control bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#fff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '25px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by customer name, email, product or ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ paddingLeft: '44px', height: '44px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Status Filter:</span>
                {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    style={{
                      border: 'none',
                      background: orderStatusFilter === status ? 'var(--primary-light)' : 'transparent',
                      color: orderStatusFilter === status ? 'var(--primary-hover)' : 'var(--text-muted)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: orderStatusFilter === status ? '1px solid var(--primary)' : '1px solid var(--border)',
                      transition: 'var(--transition)'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'separate' }}>
                <thead>
                  <tr>
                    <th style={{ borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>Order ID</th>
                    <th>Customer Details</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total Price</th>
                    <th>Order Date</th>
                    <th>Status Selector</th>
                    <th style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>No customer orders match the current criteria.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, idx) => {
                      const prodName = order.product?.productName || order.product?.product_name || order.product_name || 'Clinical Skin Care';
                      return (
                        <tr key={order.orderId || idx} className="table-row-hover">
                          <td style={{ fontWeight: '600' }}>#{order.orderId}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{order.customer?.customerName}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customer?.email}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: '600' }}>{prodName}</span>
                              <span style={{ fontSize: '11.5px', color: 'var(--primary)' }}>{order.product?.brand || 'Premium Brand'}</span>
                            </div>
                          </td>
                          <td>{order.quantity}</td>
                          <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.totalPrice}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{order.orderDate}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '13px',
                                fontWeight: '700',
                                outline: 'none',
                                cursor: 'pointer',
                                backgroundColor: order.status === 'Delivered' ? 'var(--success-light)' : order.status === 'Cancelled' ? 'var(--error-light)' : order.status === 'Shipped' ? '#eff6ff' : 'var(--warning-light)',
                                color: order.status === 'Delivered' ? 'var(--success-dark)' : order.status === 'Cancelled' ? 'var(--error-dark)' : order.status === 'Shipped' ? '#1e40af' : 'var(--warning-dark)',
                                border: order.status === 'Delivered' ? '1px solid #a7f3d0' : order.status === 'Cancelled' ? '1px solid #fecaca' : order.status === 'Shipped' ? '1px solid #bfdbfe' : '1px solid #fde68a'
                              }}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => handleViewOrderReceipt(order)}
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
                              <Eye size={12} /> Receipt
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

        {/* VIEW 3: REPORTS & ANALYTICS DASHBOARD */}
        {view === 'reports' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Reports & Stats</h1>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Time Period:</span>
                {['All Time', 'Today', 'Last 7 Days', 'This Month'].map(time => (
                  <button
                    key={time}
                    onClick={() => setReportTimeFilter(time)}
                    style={{
                      border: 'none',
                      background: reportTimeFilter === time ? 'var(--primary-light)' : '#ffffff',
                      color: reportTimeFilter === time ? 'var(--primary-hover)' : 'var(--text-muted)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: '1px solid ' + (reportTimeFilter === time ? 'var(--primary)' : 'var(--border)'),
                      transition: 'var(--transition)'
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <div style={{ flex: '1', minWidth: '220px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>₹{totalRevenue.toLocaleString()}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Total Revenue</p>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '220px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#1e40af' }}>
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{totalOrdersCount}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Total Sales Orders</p>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '220px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ backgroundColor: '#faf5ff', padding: '12px', borderRadius: '12px', color: '#6b21a8' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{uniqueCustomersCount}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Active Customers</p>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '220px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '12px', color: '#065f46' }}>
                  <Package size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>₹{averageOrderValue}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Average Order Value</p>
                </div>
              </div>
            </div>

            {/* Split layout for Charts & Lists */}
            <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
              
              {/* Category distribution chart card */}
              <div style={{ flex: '1.5', minWidth: '350px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '25px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Sales by Formulation Category</h3>
                {categorySales.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '40px 0' }}>No sales data available for the selected period.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {categorySales.map((cat, idx) => {
                      const percentage = totalRevenue > 0 ? ((cat.value / totalRevenue) * 100).toFixed(0) : 0;
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: '600' }}>
                            <span style={{ color: 'var(--text-main)' }}>{cat.name}</span>
                            <span style={{ color: 'var(--primary)' }}>₹{cat.value.toLocaleString()} ({percentage}%)</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '10px', transition: 'width 0.5s ease-out' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top Selling Products card */}
              <div style={{ flex: '1', minWidth: '280px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '25px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Best Selling Formulations</h3>
                {topProducts.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '40px 0' }}>No products sold in this period.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {topProducts.map((p, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < topProducts.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: '10px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.quantity} units sold</span>
                        </div>
                        <span style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--primary)' }}>₹{p.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Low stock alerts panel */}
            <div style={{ marginTop: '25px', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '25px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: lowStockWarnings.length > 0 ? 'var(--error)' : 'var(--success-dark)' }}>
                <AlertTriangle size={18} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Inventory Refill Warnings</h3>
              </div>
              
              {lowStockWarnings.length === 0 ? (
                <p style={{ color: 'var(--success-dark)', margin: 0, fontSize: '13.5px', fontWeight: '600' }}>✓ All skincare formulation stock levels are healthy ( more than 10 units available).</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  {lowStockWarnings.map((p, idx) => (
                    <div key={idx} style={{ flex: '1', minWidth: '220px', border: '1px solid #fecaca', backgroundColor: '#fff5f5', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#991b1b' }}>{p.productName || p.product_name}</h4>
                        <span style={{ fontSize: '11px', color: '#b91c1c', fontWeight: '600' }}>Critical stock: {p.stock} units left</span>
                      </div>
                      <button 
                        onClick={() => handleQuickStockUpdate(p, 20)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        Refill +20
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: ADD PRODUCT SUB-VIEW */}
        {view === 'addProduct' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Add Product</h1>
            </header>
            <ProductForm onProductSaved={() => { fetchProducts(); setView('welcome'); }} />
          </div>
        )}

        {/* VIEW 5: EDIT PRODUCT SUB-VIEW */}
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

      {/* Global Overlay Modal wrapper */}
      <CustomModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        type={modalConfig.type}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        confirmText="Confirm"
        cancelText="Cancel"
      >
        {modalConfig.content}
      </CustomModal>
    </div>
  );
}

export default AdminDashboard;