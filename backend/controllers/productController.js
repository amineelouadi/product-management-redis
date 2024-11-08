const client = require("../config/redisClient");
if (!client.isOpen) {
  client.connect();
}

// Fonction pour créer un produit
exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  // Basic validation
  if (!name || !description || !price) {
    return res.status(400).json({ message: "Tous les champs doivent être remplis" });
  }

  // Ensure price is a valid number and greater than 0
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Le prix doit être un nombre positif" });
  }

  try {
    // Hash the name to ensure uniqueness in the Redis key
    const productKey = `product:${name}`;

    // Store product data in Redis under the key product:${name}
    await client.hSet(productKey, {
      name,
      description,
      price: price.toString(), // Convert price to string to store it in Redis
    });

    res.status(201).json({ message: "Produit ajouté avec succès" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Fonction pour récupérer tous les produits
exports.getProducts = async (req, res) => {
  try {
    
    // Récupérer les clés des produits
    const keys = await client.keys("product:*");

    // Si aucun produit n'est trouvé
    if (keys.length === 0) {
      return res.status(404).json({ message: "Aucun produit trouvé" });
    }

    // Utilisation de Promise.all pour récupérer les détails de chaque produit
    const productPromises = keys.map((key) =>
      client.hGetAll(key).then((product) => ({
        id: key.split(":")[1], // Extraire l'ID à partir de la clé Redis
        ...product,
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

// Fonction pour mettre à jour un produit
exports.updateProduct = async (req, res) => {
  const { name } = req.params;
  const { description, price } = req.body;

  if (!description && !price) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }

  try {
    const productKey = `product:${name}`;
    
    // Vérifier si le produit existe
    const existingProduct = await client.hGetAll(productKey);

    if (Object.keys(existingProduct).length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Update product fields if provided
    const updatedProduct = {};
    if (description) updatedProduct.description = description;
    if (price) updatedProduct.price = price.toString(); // Ensure price is stored as a string

    // Update the product in Redis
    await client.hSet(productKey, updatedProduct);

    res.status(200).json({ message: "Produit mis à jour avec succès" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

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
