import React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/category.scss";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // We'll rely on the server-side auth middleware to redirect
    // if the user is not authenticated via cookies
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3001/categories/get-categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setCategories(data.categories);
      } else if (response.status === 401) {
        // Unauthorized - redirect to signin
        navigate("/signin");
      } else {
        setError("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || ''
    });
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setEditingCategory(null);
    setEditForm({ name: '', description: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const response = await fetch(`http://localhost:3001/categories/update-category/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description
        })
      });

      if (response.status === 200) {
        // Refresh categories after successful update
        await fetchCategories();
        handleClosePopup();
      } else if (response.status === 401) {
        navigate("/signin");
      } else {
        setError("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="category-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Categories</h1>
        <p className="category-subtitle">Explore all available categories</p>
        <button onClick={handleRefresh} className="refresh-btn">
          <span className="refresh-icon">⟳</span>
          Refresh
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No categories found</h3>
          <p>There are no categories available at the moment.</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category._id} 
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-icon">
                <span>🏷️</span>
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">
                  {category.description || "No description available"}
                </p>
              </div>
              <div className="category-actions">
                <button className="view-btn">View Items</button>
                <button className="edit-btn" onClick={() => handleEditClick(category)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Category Popup */}
      {showEditPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Edit Category</h2>
              <button className="close-btn" onClick={handleClosePopup}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editForm.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleFormChange}
                  placeholder="Enter category description (optional)"
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleClosePopup}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;