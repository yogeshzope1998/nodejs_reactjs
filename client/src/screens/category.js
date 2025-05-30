import React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Category() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // We'll rely on the server-side auth middleware to redirect
    // if the user is not authenticated via cookies
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
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
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="category">
      <h1>Category</h1>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Category;