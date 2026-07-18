import "./Badge.css";

const Badge = ({ status }) => {
  return (
    <span
      className={`badge ${
        status ? "badge-active" : "badge-inactive"
      }`}
    >
      {status ? "Active" : "Inactive"}
    </span>
  );
};

export default Badge;