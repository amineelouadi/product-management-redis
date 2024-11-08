import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null, // Add image to newProduct state
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChangeNewProduct = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEditProduct = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change for the edit form
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      setEditProduct((prev) => ({ ...prev, image: file }));
    } else {
      setEditProduct((prev) => ({ ...prev, image: null }));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    if (newProduct.image) formData.append("image", newProduct.image);

    try {
      await axios.post("http://localhost:3001/products", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNewProduct({ name: "", description: "", price: "", image: null });
      setLoading(true);
      const response = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Erreur lors de la création du produit");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    console.log("Edit product:", editProduct); // Debugging the data being sent
    
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("price", editProduct.price);
    if (editProduct.image) formData.append("image", editProduct.image);
  
    try {
      const response = await axios.put(`http://localhost:3001/products/${editProduct.name}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // Ensure the content type is set for file upload
        },
      });
      console.log("Response:", response); // Log the server response for debugging
      
      // Update product list and reset edit state
      setEditProduct(null);
      setLoading(true);
      const updatedProducts = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(updatedProducts.data); // Set the updated list of products
    } catch (err) {
      console.error("Error updating product:", err.response ? err.response.data : err.message);
      setError("Erreur lors de la mise à jour du produit");
    }
  };
  
  

  const handleDeleteProduct = async (name) => {
    try {
      await axios.delete(`http://localhost:3001/products/${name}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLoading(true);
      const response = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Erreur lors de la suppression du produit");
    }
  };

  const handleGoToAddProduct = () => {
    navigate("/add-product");
  };

  // Check if the image is a file or a URL
  const getImagePreview = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image); // If the image is a File, create an object URL
    } else if (image) {
      return image; // If the image is a URL, use it directly
    }
    return null; // No image available
  };

  return (
    <div>
      <h1>Liste des produits</h1>

      {error && <p className="error-message">{error}</p>}

      {products.length === 0 ? (
        <p>Aucun produit trouvé dans le magasin</p>
      ) : (
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Nom du produit</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price} €</td>
                  <td>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <p>Aucune image</p>
                    )}
                  </td>
                  <td className="actions">
                    <button onClick={() => setEditProduct(product)}>Modifier</button>
                    <button onClick={() => handleDeleteProduct(product.name)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editProduct && (
            <div className="edit-form">
              <h3>Modifier le produit</h3>
              <form onSubmit={handleEditProduct}>
                <div>
                  <label>Nom du produit</label>
                  <input
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleChangeEditProduct}
                    disabled
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editProduct.description}
                    onChange={handleChangeEditProduct}
                  />
                </div>
                <div>
                  <label>Prix</label>
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleChangeEditProduct}
                  />
                </div>
                <div>
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                  />
                  {editProduct.image && (
                    <div>
                      <img
                        src={getImagePreview(editProduct.image)} // Use the helper function for preview
                        alt="preview"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <button type="submit">Mettre à jour le produit</button>
              </form>
            </div>
          )}
        </div>
      )}

      <button onClick={handleGoToAddProduct}>Ajouter un produit</button>
    </div>
  );
}

export default Dashboard;
