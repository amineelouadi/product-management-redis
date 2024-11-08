const client = require("../config/redisClient");
if (!client.isOpen) {
  client.connect();
}

const multer = require("multer");
const path = require("path");

// Configure multer to store uploaded images in a "uploads" directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  },
});

// Filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports.upload = upload;


// Fonction pour créer un produit
exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  
  const image = req.file ? req.file.filename : null; // Get the uploaded image filename

  if (!name || !description || !price || !image) {
    return res.status(400).json({ message: "Tous les champs doivent être remplis, y compris l'image." });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Le prix doit être un nombre positif" });
  }

  try {
    const productKey = `product:${name}`;

    await client.hSet(productKey, {
      name,
      description,
      price: price.toString(),
      image, // Save image filename to Redis
    });

    res.status(201).json({ message: "Produit ajouté avec succès" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Fonction pour récupérer tous les produits
// Function to fetch all products
exports.getProducts = async (req, res) => {
  try {
    const keys = await client.keys("product:*");

    if (keys.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    const productPromises = keys.map((key) =>
      client.hGetAll(key).then((product) => ({
        id: key.split(":")[1], // Extract the ID from the Redis key
        ...product,
        imageUrl: product.image ? `http://localhost:3001/uploads/${product.image}` : null, // Add the full image URL
      }))
    );

    const products = await Promise.all(productPromises);
    res.json(products);
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Fonction pour récupérer un produit par son nom
exports.getProductByName = async (req, res) => {
  const { name } = req.params;

  try {
    const productKey = `product:${name}`;

    // Vérifier si le produit existe
    const product = await client.hGetAll(productKey);

    if (Object.keys(product).length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({ id: name, ...product });
  } catch (err) {
    console.error("Error retrieving product:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Function to update a product
// Update product function
exports.updateProduct = [
  upload.single("image"), // Use multer to handle image upload
  async (req, res) => {
    const { name } = req.params;
    const { description, price } = req.body;
    const image = req.file ? req.file.filename : null; // Get the uploaded image filename if available

    if (!description && !price && !image) {
      return res.status(400).json({ message: "No updates to apply." });
    }

    try {
      const productKey = `product:${name}`;
      const product = await client.hGetAll(productKey);

      if (Object.keys(product).length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update product fields
      if (description) product.description = description;
      if (price) product.price = price;

      // If a new image is uploaded, update the image
      if (image) {
        product.image = image; // Save image filename in Redis
      }

      // Save updated product in Redis
      await client.hSet(productKey, product);

      // Include full image URL in response
      product.imageUrl = image ? `http://localhost:3001/uploads/${image}` : product.imageUrl;

      return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating product", error: error.message });
    }
  },
];




// Fonction pour supprimer un produit
exports.deleteProduct = async (req, res) => {
  const { name } = req.params;

  try {
    const productKey = `product:${name}`;

    // Vérifier si le produit existe
    const product = await client.hGetAll(productKey);

    if (Object.keys(product).length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Supprimer le produit de Redis
    await client.del(productKey);

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
