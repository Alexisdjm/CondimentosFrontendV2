import { Featured } from "./index.js";
import { ReactComponent as ShoppingCart } from "../images/svgs/shopping-cart-black.svg";
import { Toaster } from "sonner";
import {
  useProductData,
  useCategoryName,
  useQuantity,
  useAddToCart,
} from "../hooks";
import { BuyButton } from "./index";
import { getImageUrl } from "../config/api";

const Item = () => {
  const { product, loading, error } = useProductData();
  const categoryName = useCategoryName(product?.category);
  const {
    cantidad,
    unidad,
    displayValue,
    increment,
    decrement,
    toggleUnidad,
    canToggle,
    isUnidad,
  } = useQuantity(product?.measurement ?? "kg");

  // Usar el hook personalizado para agregar al carrito
  const { handleAddToCart, showAdded, cartLoading } = useAddToCart(
    product,
    cantidad,
    unidad,
    displayValue,
    isUnidad
  );

  // Handler para eliminar del carrito
  if (loading) {
    return (
      <>
        <Toaster expand={true} closeButton position="top-right" />
        <div className="horizontal-padding">
          <div
            className="single-product-page"
            role="status"
            aria-live="polite"
            aria-label="Cargando información del producto"
          >
            <p>Cargando producto...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Toaster expand={true} closeButton position="top-right" />
        <div className="horizontal-padding">
          <div
            className="single-product-page"
            role="alert"
            aria-live="assertive"
          >
            <h2>Error al cargar el producto</h2>
            <p>
              No pudimos cargar este producto. Intenta nuevamente más tarde.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Toaster expand={true} closeButton position="top-right" />
      <article
        className="horizontal-padding"
        itemScope
        itemType="https://schema.org/Product"
      >
        <div className="single-product-page">
          <div className="single-product-img flex-col center align-center">
            <div style={{ display: "none" }}>{product?.image}</div>
            <img
              src={getImageUrl(product?.image)}
              alt={`Imagen del producto ${product?.name}`}
              itemProp="image"
            ></img>
          </div>
          <div className="single-product-info">
            <div className="product-info-container">
              <p className="product-category" itemProp="category">
                {categoryName}
              </p>
              <h1 itemProp="name">{product.name}</h1>
              <p className="product-description" itemProp="description">
                {product.description}
              </p>
            </div>
          </div>
          <aside
            className="flex-center purchase-box-container"
            aria-label="Opciones de compra"
          >
            <div
              className="purchase-box flex-col"
              role="region"
              aria-labelledby="purchase-options-heading"
            >
              <h2 id="purchase-options-heading" className="sr-only">
                Opciones de compra
              </h2>
              {/* Selector de unidad si el producto tiene ambas medidas */}
              {canToggle && (
                <div
                  id="desktop-gr"
                  role="group"
                  aria-labelledby="unit-selector-heading"
                >
                  <h3 id="unit-selector-heading" className="purchase-caption">
                    {unidad === "gm" ? "Gramos" : "Kilos"}
                  </h3>
                  <label
                    className="toggle-switch"
                    aria-label={`Cambiar unidad de medida a ${
                      unidad === "gm" ? "kilogramos" : "gramos"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={unidad === "gm"}
                      onChange={toggleUnidad}
                      aria-label={`Unidad actual: ${
                        unidad === "gm" ? "gramos" : "kilogramos"
                      }`}
                    />
                    <div
                      className="toggle-switch-background"
                      aria-hidden="true"
                    >
                      <div
                        className="toggle-switch-handle"
                        aria-hidden="true"
                      ></div>
                    </div>
                  </label>
                </div>
              )}

              <div role="group" aria-labelledby="quantity-heading">
                <h3 id="quantity-heading" className="purchase-caption">
                  Cantidad
                </h3>
                <div
                  className="flex-center"
                  style={{ padding: "0 0 10px" }}
                  role="group"
                  aria-label="Selector de cantidad"
                >
                  <button
                    className="menos-btn"
                    onClick={decrement}
                    aria-label="Disminuir cantidad"
                    type="button"
                  >
                    <span aria-hidden="true">-</span>
                    <span className="sr-only">Disminuir</span>
                  </button>
                  <label htmlFor="quantity-input" className="sr-only">
                    Cantidad seleccionada
                  </label>
                  <input
                    id="quantity-input"
                    className="cantidad"
                    value={displayValue}
                    readOnly
                    type="text"
                    aria-label={`Cantidad: ${displayValue} ${
                      isUnidad
                        ? "unidades"
                        : unidad === "gm"
                        ? "gramos"
                        : "kilogramos"
                    }`}
                    aria-live="polite"
                    aria-atomic="true"
                  ></input>
                  <button
                    className="mas-btn"
                    onClick={increment}
                    aria-label="Aumentar cantidad"
                    type="button"
                  >
                    <span aria-hidden="true">+</span>
                    <span className="sr-only">Aumentar</span>
                  </button>
                </div>
              </div>
              <div
                className="price-align"
                role="group"
                aria-label="Resumen del total"
              >
                <hr aria-hidden="true"></hr>
                <div className="simple-flex space-between">
                  <h3 className="price-spec">Total</h3>
                  <p
                    className="price-numbers"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={`Total: ${
                      isUnidad
                        ? `${displayValue} unidades`
                        : unidad === "gm"
                        ? `${displayValue} gramos`
                        : unidad === "kg"
                        ? `${displayValue} kilogramos`
                        : ""
                    }`}
                  >
                    {isUnidad
                      ? `${displayValue} unidades`
                      : unidad === "gm"
                      ? `${displayValue}g`
                      : unidad === "kg"
                      ? `${displayValue}kg`
                      : ""}
                  </p>
                </div>
              </div>
              <div
                className="flex-col buttons-container"
                role="group"
                aria-label="Acciones de compra"
              >
                <button
                  className="cart-btn"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  aria-label={
                    showAdded
                      ? "Producto agregado al carrito"
                      : `Agregar ${product.name} al carrito`
                  }
                  aria-pressed={showAdded}
                  type="button"
                >
                  {showAdded ? (
                    <>
                      <span aria-hidden="true">✓</span> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart aria-hidden="true" /> Agregar al carrito
                    </>
                  )}
                </button>
                <BuyButton
                  product={product}
                  cantidad={cantidad}
                  gramos={unidad === "gm"}
                />
              </div>
            </div>
          </aside>
        </div>
      </article>
      <Featured css="flex-col align-center section-margin" />
    </>
  );
};
export default Item;
