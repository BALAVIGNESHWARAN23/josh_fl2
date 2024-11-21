import React, { useState, useEffect } from 'react';
import './stockcheck.css';

const InventoryTracker = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newStock, setNewStock] = useState(0);
  const [newSerial, setNewSerial] = useState('');
  const [selectedSerial, setSelectedSerial] = useState('');
  const [updateStock, setUpdateStock] = useState(0);
  const [updateAction, setUpdateAction] = useState('add');
  const [feedback, setFeedback] = useState('');

  // Fetch inventory from the API
  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      const items = await response.json();
      setInventory(items);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Add a new item to the inventory
  const handleAddItem = async () => {
    if (newItem && newStock >= 0 && newSerial) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: newItem, stock: newStock, serial: newSerial })
        });

        if (response.ok) {
          setFeedback('Item added successfully!');
          fetchInventory();
        } else {
          setFeedback('Error adding item. Please try again.');
        }
      } catch {
        setFeedback('Error adding item. Please try again.');
      }
    } else {
      setFeedback('Invalid input. Please try again.');
    }
  };

  // Update an item's stock
  const handleUpdateStock = async () => {
    if (selectedSerial && updateStock) {
      try {
        const response = await fetch(`/api/inventory/${selectedSerial}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stockChange: updateStock, action: updateAction })
        });

        if (response.ok) {
          setFeedback('Stock updated successfully!');
          fetchInventory();
        } else {
          setFeedback('Error updating stock. Please try again.');
        }
      } catch {
        setFeedback('Error updating stock. Please try again.');
      }
    } else {
      setFeedback('Invalid input. Please try again.');
    }
  };

  // Remove an item from the inventory
  const handleRemoveItem = async (serial) => {
    try {
      const response = await fetch(`/api/inventory/${serial}`, { method: 'DELETE' });
      if (response.ok) fetchInventory();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Fetch inventory data initially
  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="container">
      <h1>Clothing Inventory Tracker</h1>

      {/* Inventory Table */}
      <div className="section">
        <h2>Inventory</h2>
        <table id="inventoryTable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Stock</th>
              <th>Serial Number</th>
              <th>Warning</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(({ item, stock, serial }) => (
              <tr key={serial}>
                <td>{item}</td>
                <td>{stock}</td>
                <td>{serial}</td>
                <td className={stock < 10 ? 'warning' : ''}>
                  {stock < 10 ? 'Low Stock!' : ''}
                </td>
                <td>
                  <button onClick={() => handleRemoveItem(serial)}>Remove Item</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Item Section */}
      <div className="section">
        <h2>Add New Item</h2>
        <div className="input-group">
          <label htmlFor="newItem">Item Name:</label>
          <input
            type="text"
            id="newItem"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter item name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="newStock">Initial Stock:</label>
          <input
            type="number"
            id="newStock"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
            placeholder="Enter initial stock"
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="newSerial">Serial Number:</label>
          <input
            type="text"
            id="newSerial"
            value={newSerial}
            onChange={(e) => setNewSerial(e.target.value)}
            placeholder="Enter serial number"
          />
        </div>
        <button onClick={handleAddItem}>Add Item</button>
        <div className="feedback">{feedback}</div>
      </div>

      {/* Update Existing Item Section */}
      <div className="section">
        <h2>Update Existing Item</h2>
        <div className="input-group">
          <label htmlFor="itemSelect">Select Item:</label>
          <select
            id="itemSelect"
            value={selectedSerial}
            onChange={(e) => setSelectedSerial(e.target.value)}
          >
            <option value="">Select an item</option>
            {inventory.map(({ item, serial }) => (
              <option key={serial} value={serial}>
                {item} ({serial})
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="updateStock">Stock Change:</label>
          <input
            type="number"
            id="updateStock"
            value={updateStock}
            onChange={(e) => setUpdateStock(Number(e.target.value))}
            placeholder="Enter stock change"
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="updateAction">Action:</label>
          <select
            id="updateAction"
            value={updateAction}
            onChange={(e) => setUpdateAction(e.target.value)}
          >
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
        </div>
        <button onClick={handleUpdateStock}>Update Stock</button>
        <div className="feedback">{feedback}</div>
      </div>
    </div>
  );
};

export default InventoryTracker;
