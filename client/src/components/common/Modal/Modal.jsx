import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "500px",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-container"
        style={{ width }}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;