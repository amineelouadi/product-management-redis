// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const authMiddleware = require("./middlewares/authMiddleware");
const { upload } = require("./controllers/productController"); // Import Multer configuration

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Add to parse form-data

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Routes d'authentification
app.post("/register", authController.register);
app.post("/login", authController.login);


// Routes CRUD pour les produits
app.get("/products", authMiddleware, productController.getProducts);
app.post("/products", authMiddleware, upload.single("image"), productController.createProduct); // Include Multer middleware
app.put("/products/:name", authMiddleware, productController.updateProduct);
app.delete("/products/:name", authMiddleware, productController.deleteProduct);

const PORT = 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
