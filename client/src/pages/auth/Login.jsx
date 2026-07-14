import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login(formData);

      loginUser(response.user, response.token);

      alert(response.message);

      switch (response.user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "manager":
          navigate("/manager");
          break;

        case "cashier":
          navigate("/cashier");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>SmartTill</h1>

        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">

            {loading ? "Logging In..." : "Login"}

          </button>

        </form>

        <p>
          Don't have a business?{" "}
          <Link to="/register-business">
            Create Business
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;