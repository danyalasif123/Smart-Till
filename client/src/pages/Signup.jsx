import { Link } from "react-router-dom";
import "../styles/auth.css";

function Signup() {
  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Create Account</h1>

        <form>

          <input
            type="text"
            placeholder="Full Name"
          />

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <input
            type="password"
            placeholder="Confirm Password"
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;