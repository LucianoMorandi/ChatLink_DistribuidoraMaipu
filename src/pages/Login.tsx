// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// DATPS DE CLIENTE, CAMBIAR
const USER = "admin";
const PASSWORD = "1234";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === USER && password === PASSWORD) {
      localStorage.setItem("auth", "true");
      navigate("/admin");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto text-center">
      <h1 className="text-xl font-bold mb-4">Acceso Administrador</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
