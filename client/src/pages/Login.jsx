import { Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>SmartTill</h1>

        <h2>Admin Login</h2>

        <form>

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;