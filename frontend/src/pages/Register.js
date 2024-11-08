import axios from "axios";
import { useState } from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/register", { username, password });
      alert("Inscription réussie !");
    } catch {
      alert("Erreur d'inscription");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-heading">Inscription</h2>
        
        <input
          className="input-field"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          className="input-field"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button onClick={handleRegister} className="button">S'inscrire</button>
      </div>
    </div>
  );
}

export default Register;
