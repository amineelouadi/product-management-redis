import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importer SweetAlert
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialiser useNavigate

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/register", { username, password });
      
      // Utiliser SweetAlert pour confirmation
      Swal.fire({
        title: "Inscription réussie !",
        text: "Vous serez redirigé vers la page de connexion.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login"); // Rediriger vers /login après confirmation
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur d'inscription",
        text: "Veuillez vérifier vos informations et réessayer.",
        icon: "error",
        confirmButtonText: "OK",
      });
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
