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
  const [editForm, setEditForm] = useState({ category_name: '', category_description: '' });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [addForm, setAddForm] = useState({ category_name: '', category_description: '' });
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
      category_name: category.category_name,
      category_description: category.category_description || ''
    });
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setEditingCategory(null);
    setEditForm({ category_name: '', category_description: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategoryClick = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
    setAddForm({ category_name: '', category_description: '' });
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const response = await fetch(`http://localhost:3001/categories/update-category/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          categoryName: editForm.category_name,
          categoryDescription: editForm.category_description,
        })
      });

      if (response.status === 200) {
        // Refresh categories after successful update
        await fetchCategories();
        handleClosePopup();
      } else if (response.status === 401) {
        navigate("/signin");
      } else {
        let errorMessage = "Failed to update category";
        try {
          const data = await response.json();
          if (data.error) errorMessage = data.error;
        } catch (e) {
          // ignore parsing error
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleSaveNewCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/categories/create-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          categoryName: addForm.category_name,
          categoryDescription: addForm.category_description,
          categoryImage: 'test.jpg'
        })
      });

      if (response.status === 201) {
        await fetchCategories();
        handleCloseAddPopup();
      } else if (response.status === 401) {
        navigate("/signin");
      } else {
        let errorMessage = "Failed to add category";
        try {
          const data = await response.json();
          if (data.error) errorMessage = data.error;
        } catch (e) {
          // ignore parsing error
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error adding category:", error);
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
        <div className="header-actions">
          <button onClick={handleAddCategoryClick} className="add-btn">
            + Add Category
          </button>
          <button onClick={handleRefresh} className="refresh-btn">
            <span className="refresh-icon">⟳</span>
            Refresh
          </button>
        </div>
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
              key={category.id} 
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-icon">
                <span>🏷️</span>
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.category_name}</h3>
                <p className="category-description">
                  {category.category_description || "No description available"}
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
                  name="category_name"
                  value={editForm.category_name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="category_description"
                  value={editForm.category_description}
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
      {/* Add Category Popup */}
      {showAddPopup && (
        <div className="popup-overlay" onClick={handleCloseAddPopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Add New Category</h2>
              <button className="close-btn" onClick={handleCloseAddPopup}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveNewCategory} className="edit-form">
              <div className="form-group">
                <label htmlFor="add-category-name">Category Name</label>
                <input
                  type="text"
                  id="add-category-name"
                  name="category_name"
                  value={addForm.category_name}
                  onChange={handleAddFormChange}
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="add-category-description">Description</label>
                <textarea
                  id="add-category-description"
                  name="category_description"
                  value={addForm.category_description}
                  onChange={handleAddFormChange}
                  placeholder="Enter category description (optional)"
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseAddPopup}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Category
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