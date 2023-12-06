import React from "react";

interface OrderConfirmationModalProps {
    closeModal: () => void;
    orderID: number;
}

/**
 * `OrderConfirmationModal` is a React component that displays a modal confirming the successful submission of an order.
 * 
 * @remarks
 * This component displays a modal with a success message and the order number.
 * The modal can be closed by clicking outside of it.
 * 
 * @param closeModal - Function to close the modal
 * @param orderID - The ID of the submitted order
 * 
 * @returns The rendered `OrderConfirmationModal` component
 */
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