import images from "../images/exporting.js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { ImageWithSkeleton } from "./index.js";

const FirstSection = () => {
  const content = {
    main: "es el sitio ideal para amantes de la cocina, restaurantes, chef profesionales y amas de casa. Además, nos esforzamos en traer gran cantidad de productos de la mejor",
    name: "Casa de los Condimentos",
    clave: "calidad, sabor y frescura.",
    message:
      "Ofrecemos diversidad de condimentos, ingredientes de repostería, frutos secos, encurtidos , productos lácteos, dulces y mucho más.",
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1441 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1440, min: 1280 },
      items: 4,
    },
    smallDesktop: {
      breakpoint: { max: 1279, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1023, min: 768 },
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

  return (
    <>
      <section
        className="flex-col align-center svg-next-container"
        aria-labelledby="first-section-heading"
      >
        <div className="flex-center fit-content relative">
          <div className="quotes-container" aria-hidden="true">
            <img
              className="quotes"
              src={images.quotes}
              alt=""
              aria-hidden="true"
            ></img>
          </div>
          <h2 className="business-frase" id="first-section-heading">
            La <strong>{content.name}</strong> {content.main}{" "}
            <strong>{content.clave}</strong>
          </h2>
        </div>
        <div className="flex-col align-center" style={{ marginTop: "2em" }}>
          <h3 className="big-title justify-center-text">
            Llevamos los mejores productos a tu mesa
          </h3>
          <img
            className="underline"
            src={images.underline}
            alt=""
            aria-hidden="true"
          ></img>
          <p className="message-slider">{content.message}</p>
        </div>
        <div
          className="slider-container"
          role="region"
          aria-label="Galería de productos destacados"
        >
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={3500}
            ssr={true}
            draggable={true}
            infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile", "zfold"]}
            aria-label="Carrusel de productos"
          >
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.oregano}
                alt="Oregano"
              />
            </div>
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.cebolla}
                alt="Cebolla"
              />
            </div>
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.canelaMolida}
                alt="Canela Molida"
              />
            </div>
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.canelaRama}
                alt="Canela en Rama"
              />
            </div>
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.pimientaMolida}
                alt="Pimienta Molida"
              />
            </div>
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.pimientaNegra}
                alt="Pimienta Negra"
              />
            </div>
            <div
              className="first-slider-card"
              role="group"
              aria-label="Producto destacado"
            >
              <ImageWithSkeleton
                className="first-slider-img"
                src={images.comino}
                alt="Comino"
              />
            </div>
          </Carousel>
        </div>
        <Link
          to="/products/all"
          className="casa-btn"
          aria-label="Ver todos los productos disponibles"
        >
          Todos los Productos
        </Link>
      </section>
    </>
  );
};

export default FirstSection;
