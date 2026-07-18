import Navbar from "../components/Navbar/Navbar";

function AdminLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "white",
      }}
    >
      <Navbar />

      <main
        style={{
          padding: "25px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;