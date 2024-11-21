import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import InventoryTracker from './components/stockcheck';

function App() {
  const [data, setData] = useState(null);

 useEffect(() => {

    axios.get('http://localhost:5000/api/data')
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error fetching data!", error);
      });
  }, []);

  return (
    <Router>
       <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inventory-tracker" element={<InventoryTracker />} />
        </Routes>
    </Router>
  );
}

export default App;
