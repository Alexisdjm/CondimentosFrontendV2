import images from "../images/exporting.js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import useFeaturedProducts from "../hooks/useFeaturedProducts";
import { ImageWithSkeleton } from "./index.js";

const Featured = ({ css }) => {
  const { products, loading, error } = useFeaturedProducts();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1367 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1366, min: 1101 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1100, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 767, min: 281 },
      items: 2,
    },
    zfold: {
      breakpoint: { max: 280, min: 0 },
      items: 1,
    },
  };

  // Renderizar loading
  if (loading) {
    return (
      <div className={css}>
        <div className="title-container">
          <h1 className="featured-title">Productos Destacados</h1>
          <img src={images.underline} alt="" aria-hidden="true"></img>
        </div>
        <div className="slider-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando productos destacados...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <div className={css}>
        <div className="title-container">
          <h1 className="featured-title">Productos Destacados</h1>
          <img src={images.underline} alt="" aria-hidden="true"></img>
        </div>
        <div className="slider-container">
          <div className="message-container">
            <h3>Error al cargar productos destacados: {error}</h3>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar productos
  return (
    <>
      <div className={css}>
        <div className="title-container">
          <h1 className="featured-title">Productos Destacados</h1>
          <img src={images.underline} alt="" aria-hidden="true"></img>
        </div>
        <div className="slider-container" role="region" aria-label="Carrusel de productos destacados">
          {products && products.length > 0 ? (
            <Carousel
              responsive={responsive}
              autoPlay={true}
              autoPlaySpeed={3500}
              ssr={true}
              draggable={true}
              infinite={true}
              removeArrowOnDeviceType={["tablet", "mobile", "zfold"]}
              aria-label="Productos destacados"
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  aria-label={`Ver detalles del producto ${product.name}`}
                >
                  <div className="featured-product-card flex-col align-center center">
                    <div className="product-image-container">
                      <ImageWithSkeleton
                        className="product-img"
                        src={product.image}
                        alt={`Imagen del producto ${product.name}`}
                      />
                      <div className="flex-col product-inner-text">
                        <h2 className="product-name">{product.name}</h2>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Carousel>
          ) : (
            <div className="message-container">
              <h3>No hay productos destacados disponibles</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Featured;
