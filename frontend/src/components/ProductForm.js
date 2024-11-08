import axios from "axios";
import { useState } from "react";
import "./ProductForm.css"; 

function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled and price is valid
    if (!name || !description || !price || isNaN(price) || price <= 0) {
      setError("Tous les champs doivent être remplis correctement.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Check if the token exists
      if (!token) {
        setError("Veuillez vous connecter pour ajouter un produit.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/products", // backend API endpoint
        {
          name,
          description,
          price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Produit ajouté avec succès !");
      setName(""); // Clear form fields
      setDescription("");
      setPrice("");
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error adding product:", err.response ? err.response.data : err.message);
      setError("Erreur lors de l'ajout du produit.");
      setSuccess(""); // Clear any previous success message
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
            name="name"
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Prix</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
