import React from "react";

interface OrderConfirmationModalProps {
    closeModal: () => void;
}
const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ closeModal }) => {
    return (
      <div className="modal-container"
      onClick={(e) => {
        const target = e.target as HTMLTextAreaElement;
        if (target.className === "modal-container") closeModal();
        }}>
        <div className="modal">
            <p>Order Submitted Successfully!</p>
        </div>
      </div>
    );
  };
  
  export default OrderConfirmationModal;