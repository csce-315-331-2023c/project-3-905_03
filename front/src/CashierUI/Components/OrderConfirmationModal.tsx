import React from "react";

interface OrderConfirmationModalProps {
    closeModal: () => void;
    orderID: number;
}
const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ closeModal, orderID }) => {
    return (
      <div className="modal-container"
      onClick={(e) => {
        const target = e.target as HTMLTextAreaElement;
        if (target.className === "modal-container") closeModal();
        }}>
        <div className="modal">
            <p>Order Submitted Successfully!</p>
            <p>Order Number: {orderID}</p>
        </div>
      </div>
    );
  };
  
  export default OrderConfirmationModal;