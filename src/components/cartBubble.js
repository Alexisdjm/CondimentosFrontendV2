import { Link } from "react-router-dom";
import images from "../images/exporting";
import { useCart } from "../context/CartContext";
import "../styles/cartBubble.css";

const CartBubble = ({ header }) => {
  const { bubbleItemCount } = useCart();

  // Solo mostrar el badge si hay productos en el carrito
  const showBadge = bubbleItemCount && bubbleItemCount > 0;

  return (
    <Link
      to="/cart"
      className="icon-link cart-btn-actions"
      style={{ position: "relative" }}
      aria-label={`Ver carrito de compras${
        showBadge
          ? `, ${bubbleItemCount} producto${
              bubbleItemCount !== 1 ? "s" : ""
            } en el carrito`
          : ", carrito vacío"
      }`}
    >
      <cart-icon className="cart-icon-element" aria-hidden="true">
        <img
          className="small-logo-header"
          src={!header ? images.bolsaNaranja : images.bolsa}
          alt=""
          aria-hidden="true"
        ></img>
        {showBadge > 0 && (
          <div className="cart-bubble" data-maintain-ratio aria-hidden="true">
            <span
              className="cart-bubble_text"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span
                className="cart-bubble_text-count"
                aria-hidden="true"
                data-testid="cart-bubble"
              >
                {bubbleItemCount > 99 ? "99+" : bubbleItemCount}
              </span>
            </span>
          </div>
        )}
      </cart-icon>
    </Link>
  );
};

export default CartBubble;
