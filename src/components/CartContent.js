import { useFormatQuantity, useCartActions } from "../hooks";
import { useCart } from "../context/CartContext";
import { Toaster } from "sonner";
import { ImageWithSkeleton } from "./index.js";

const CartContent = () => {
  const { cart, totalItems, loading, error, hasItems } = useCart();

  // Usar hooks personalizados
  const { formatQuantity } = useFormatQuantity();
  const { handleDeleteProduct, handleClearCart, handleProceedToPayment } =
    useCartActions();

  // Mostrar loading
  if (loading) {
    return (
      <section className="svg-next-container" aria-labelledby="cart-heading">
        <div className="cart-boxes-container">
          <div
            className="cart-items-container flex-col"
            role="region"
            aria-label="Contenido del carrito"
          >
            <header className="simple-flex space-between">
              <h1 id="cart-heading" className="cart-title">
                Carrito
              </h1>
              <h2 className="cart-box-price-label">Precio</h2>
            </header>
            <div
              className="cart-items-box"
              role="status"
              aria-live="polite"
              aria-label="Cargando carrito"
            >
              <div className="loading-message">
                <p>Cargando carrito...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <section className="svg-next-container" aria-labelledby="cart-heading">
        <div className="cart-boxes-container">
          <div
            className="cart-items-container flex-col"
            role="region"
            aria-label="Contenido del carrito"
          >
            <header className="simple-flex space-between">
              <h1 id="cart-heading" className="cart-title">
                Carrito
              </h1>
              <h2 className="cart-box-price-label">Precio</h2>
            </header>
            <div className="cart-items-box" role="alert" aria-live="assertive">
              <div className="error-message">
                <h2>Error al cargar el carrito</h2>
                <p>{error.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  aria-label="Reintentar cargar el carrito"
                  type="button"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Toaster expand={true} closeButton position="top-right" />
      <section className="svg-next-container" aria-labelledby="cart-heading">
        <div className="cart-boxes-container">
          <div
            className="cart-items-container flex-col"
            role="region"
            aria-label="Contenido del carrito"
          >
            <header className="simple-flex space-between">
              <h1 id="cart-heading" className="cart-title">
                Carrito
              </h1>
              <h2 className="cart-box-price-label">Cantidad</h2>
            </header>

            {hasItems ? (
              <ul
                className="cart-items-box"
                aria-label="Lista de productos en el carrito"
              >
                {Object.entries(cart).map(([productId, product]) => (
                  <li key={productId} id={productId}>
                    <article
                      className="cart-item"
                      itemScope
                      itemType="https://schema.org/Product"
                    >
                      <div className="cart-item-align">
                        <label
                          className="container"
                          aria-label={`Eliminar ${product.name} del carrito`}
                        >
                          <input
                            type="checkbox"
                            checked
                            onChange={() => handleDeleteProduct(productId)}
                            aria-label={`Seleccionar para eliminar ${product.name}`}
                          />
                          <div className="checkmark" aria-hidden="true"></div>
                        </label>

                        <ImageWithSkeleton
                          className="cart-item-img"
                          src={"http://127.0.0.1:8000/" + product.image}
                          alt={`Imagen del producto ${product.name}`}
                          itemProp="image"
                        />

                        <div className="flex-col cart-item-info">
                          <h3 itemProp="name">{product.name}</h3>
                          <p itemProp="description">{product.description}</p>
                        </div>

                        <p
                          className="cart-item-price"
                          aria-label={`Cantidad: ${formatQuantity(product)}`}
                        >
                          {formatQuantity(product)}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cart-items-box" role="status" aria-live="polite">
                <div className="empty-cart-message">
                  <h2>No hay productos en el Carrito</h2>
                  <p>Agrega algunos productos para comenzar tu compra</p>
                </div>
              </div>
            )}

            {hasItems && (
              <>
                <div
                  className="cart-summary"
                  role="region"
                  aria-label="Resumen del carrito"
                >
                  <p
                    className="cart-items-total"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    Total:{" "}
                    <strong
                      aria-label={`${totalItems} producto${
                        totalItems !== 1 ? "s" : ""
                      } en el carrito`}
                    >
                      {totalItems} productos
                    </strong>
                  </p>
                </div>

                <nav
                  className="cart-actions"
                  role="toolbar"
                  aria-label="Acciones del carrito"
                >
                  <button
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                    aria-label="Limpiar todo el carrito"
                    type="button"
                  >
                    Limpiar Carrito
                  </button>

                  <button
                    className="purchase-btn"
                    onClick={() => handleProceedToPayment(formatQuantity)}
                    aria-label="Proceder al pago por WhatsApp"
                    type="button"
                  >
                    Proceder al Pago
                  </button>
                </nav>
              </>
            )}
          </div>

          {hasItems && (
            <aside
              className="checkout-cart-box flex-col"
              aria-label="Resumen de compra"
            >
              <div className="simple-flex space-between aside-right-pay">
                <p
                  className="cart-item-price"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >

                  <span
                    aria-label={`Total de productos: ${totalItems} producto${
                      totalItems !== 1 ? "s" : ""
                    }`}
                  >
                    {totalItems} productos
                  </span>
                </p>
              </div>
              <button
                className="purchase-btn"
                onClick={() => handleProceedToPayment(formatQuantity)}
                aria-label="Proceder al pago por WhatsApp"
                type="button"
              >
                Proceder al Pago
              </button>
            </aside>
          )}
        </div>
      </section>
    </>
  );
};

export default CartContent;
