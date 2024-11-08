// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

// Routes d'authentification
app.post("/register", authController.register);
app.post("/login", authController.login);

// Routes CRUD pour les produits
app.get("/products", authMiddleware, productController.getProducts);
app.post("/products", authMiddleware, productController.createProduct);
//app.get("/products/:id", authMiddleware, productController.getProducts);
app.put("/products/:name", authMiddleware, productController.updateProduct);
app.delete("/products/:name", authMiddleware, productController.deleteProduct);

const PORT = 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
