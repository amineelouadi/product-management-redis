import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
    image: null,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditProduct((prev) => ({ ...prev, image: file }));
  };

  const getImagePreview = () => {
    if (editProduct && editProduct.image instanceof File) {
      return URL.createObjectURL(editProduct.image);
    } else if (editProduct && editProduct.imageUrl) {
      return editProduct.imageUrl;
    }
    return null;
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
    
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("price", editProduct.price);
    if (editProduct.image) formData.append("image", editProduct.image);

    try {
      const response = await axios.put(`http://localhost:3001/products/${editProduct.name}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditProduct(null);
      setLoading(true);
      const updatedProducts = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(updatedProducts.data);
      
      Swal.fire({
        title: "Modification réussie",
        text: "Le produit a été modifié avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      setError("Erreur lors de la mise à jour du produit");
    }
  };

  const handleDeleteProduct = async (name) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action supprimera définitivement le produit!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Non, annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/products/${name}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setLoading(true);
          const response = await axios.get("http://localhost:3001/products", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setProducts(response.data);
          Swal.fire("Supprimé!", "Le produit a été supprimé avec succès.", "success");
        } catch (err) {
          setError("Erreur lors de la suppression du produit");
        }
      }
    });
  };

  const handleGoToAddProduct = () => {
    navigate("/add-product");
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
                        src={getImagePreview()}
                        alt="preview"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <button type="submit">Mettre à jour le produit</button>
                <button type="button" onClick={() => setEditProduct(null)}>
                  Annuler
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <button className="add-product-button" onClick={handleGoToAddProduct}>Ajouter un produit</button>
    </div>
  );
}

export default Dashboard;
