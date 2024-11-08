import React, { useState } from "react";
import axios from "axios";
import "./ProductForm.css";

function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || isNaN(price) || price <= 0 || !image) {
      setError("Tous les champs doivent être remplis, y compris l'image.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Veuillez vous connecter pour ajouter un produit.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:3001/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Produit ajouté avec succès !");
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setError("");
    } catch (err) {
      console.error("Error adding product:", err.response ? err.response.data : err.message);
      setError("Erreur lors de l'ajout du produit.");
      setSuccess("");
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="add-product-heading">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Nom du produit</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Prix</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Image du produit</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">Ajouter le produit</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default ProductForm;
