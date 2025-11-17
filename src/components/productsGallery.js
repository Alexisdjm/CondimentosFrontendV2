import { Link } from "react-router-dom";
import { ImageWithSkeleton } from "./index.js";

const ProductsContainer = ({ elements, loading, error, isLoadingMore }) => {
  return (
    <>
      <div
        className="Products-container"
        role="region"
        aria-label="Galería de productos"
      >
        {loading ? (
          <div
            className="loading-container-infinite"
            role="status"
            aria-live="polite"
            aria-label="Cargando productos"
          >
            <div className="loading-spinner-infinite" aria-hidden="true"></div>
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="message-container" role="alert" aria-live="assertive">
            <h2>No hay productos disponibles</h2>
            <p>{error}</p>
          </div>
        ) : elements !== null ? (
          Object.keys(elements).length > 0 && (
            <>
              <div
                className="products-flex"
                role="list"
                aria-label="Lista de productos"
              >
                {elements.map((product) => {
                  return (
                    <article
                      key={product.id}
                      role="listitem"
                      className="products-gallery-card gallery-products flex-col align-center center"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        aria-label={`Ver detalles del producto ${product.name}`}
                      >
                        <div className="product-image-container">
                          <ImageWithSkeleton
                            className="product-img"
                            src={product.image}
                            alt={`Imagen del producto ${product.name}`}
                          />
                          <div className="product-inner-text">
                            <h3 className="product-name">{product.name}</h3>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {/* Loading de scroll infinito - fuera del grid */}
              {isLoadingMore && (
                <div
                  className="loading-container-infinite"
                  role="status"
                  aria-live="polite"
                  aria-label="Cargando más productos"
                >
                  <div
                    className="loading-spinner-infinite"
                    aria-hidden="true"
                  ></div>
                  <p>Cargando más productos...</p>
                </div>
              )}
            </>
          )
        ) : (
          <div className="message-container" role="status">
            <h2>No se pudieron cargar los productos</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsContainer;
