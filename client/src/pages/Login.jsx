import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = await login(form);

      localStorage.setItem("token", data.token);

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      alert(error.response?.data?.message || "Login Failed");

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>SmartTill</h1>

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p>

          Don't have an account?

          <Link to="/signup">
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;