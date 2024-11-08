import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Dashboard.css";

function Dashboard() {
  let navigate = useNavigate ();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null); // For editing a product
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
  });

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(response.data);
        console.log(response.data)
      } catch (err) {
        setError("Erreur lors de la récupération des produits");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form changes for creating a new product
  const handleChangeNewProduct = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form changes for editing a product
  const handleChangeEditProduct = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Create a new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/products",
        newProduct,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewProduct({ name: "", description: "", price: "" }); // Clear form
      setLoading(true); // Refresh product list
      setError(null);
      // Optionally, re-fetch the products or update state directly
      const response = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Erreur lors de la création du produit");
    }
  };

  // Edit a product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/products/${editProduct.name}`,
        editProduct,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEditProduct(null); // Clear edit form
      setLoading(true); // Refresh product list
      setError(null);
      const response = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Erreur lors de la mise à jour du produit");
    }
  };

  // Delete a product
  const handleDeleteProduct = async (name) => {
    try {
      await axios.delete(`http://localhost:3001/products/${name}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLoading(true); // Refresh product list
      setError(null);
      const response = await axios.get("http://localhost:3001/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Erreur lors de la suppression du produit");
    }
  };

  const handleGoToAddProduct = () => {
    navigate("/add-product"); // This will navigate to /add-product
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price} €</td>
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
