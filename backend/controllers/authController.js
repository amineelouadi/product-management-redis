const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const client = createClient();
const SECRET_KEY = process.env.SECRET_KEY || "secret_key123456789@@";  // Charge la clé secrète à partir des variables d'environnement

// Fonction d'inscription
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Connect to Redis if not already connected
      if (!client.isOpen) {
        await client.connect();
      }
  
      // Set the user data in Redis
      await client.hSet(`user:${username}`, "password", hashedPassword);
  
      res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  };

// Fonction de connexion
exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Connect to Redis if not already connected
      if (!client.isOpen) {
        await client.connect();
      }
  
      // Retrieve the hashed password from Redis
      const hashedPassword = await client.hGet(`user:${username}`, "password");
  
      if (!hashedPassword) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
  
      // Compare the password with the hashed password
      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  
      res.json({ message: "Connexion réussie", token });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
  };