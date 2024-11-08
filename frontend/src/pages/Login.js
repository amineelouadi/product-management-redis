import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", { username, password });
      localStorage.setItem("token", response.data.token); // Store token in local storage
      alert("Connexion réussie !");
      navigate("/dashboard"); // Redirect to Dashboard
    } catch {
      alert("Erreur de connexion");
    }
  };
  
  const handleGoToRegister = () => {
    navigate("/register"); // Navigate to the register page
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 className="login-heading">Connexion</h2>
  
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
        <button onClick={handleLogin} className="button">Connexion</button>
  
        {/* Button to navigate to the register page if the user isn't registered */}
        <div className="register-link">
          <p>Pas encore inscrit ?</p>
          <button onClick={handleGoToRegister} className="button register-button">S'inscrire</button>
        </div>
      </div>
    </div>
  );
  
}


export default Login;
