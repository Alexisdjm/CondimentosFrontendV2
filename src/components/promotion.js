import images from "../images/exporting.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageWithSkeleton } from "./index.js";

const Promotion = () => {
  const [viewport, setViewport] = useState(false);

  useEffect(() => {
    window.innerWidth <= 1023 ? setViewport(true) : setViewport(false);
    window.addEventListener("resize", function () {
      window.innerWidth <= 1023 ? setViewport(true) : setViewport(false);
    });
  }, []);

  const content = {
    title1: "Si eres amante de los",
    clave: "Frutos Secos",
    title2: "somos tu mejor opción",
    content:
      "Somos tu mejor aliado en cuanto a frutos secos se trata, nos caracterizamos por ofrecerte la mejor calidad y frescura en nuestros productos",
  };

  return (
    <>
      <div className={`${viewport ? "flex-col" : "simple-flex"} align-center`}>
        <div className="promotion-container flex-center">
          <div className="flex-col promotion-content-container">
            <h1 className="promo-title">
              {content.title1} <strong>{content.clave}</strong> {content.title2}
            </h1>
            <h4 className="promo-paragraph">{content.content}</h4>
            <div className="simple-flex space-between promo-flex-icons">
              <figure className="promo-figure-container">
                <h1 className="figuretext-img">+5</h1>
                <figcaption>Tipos de Maní</figcaption>
              </figure>
              <figure className="promo-figure-container">
                <ImageWithSkeleton
                  className="promo-icons"
                  src={images.pistachosNaranja}
                  alt="pistachos"
                />
                <figcaption>Pistachos</figcaption>
              </figure>
              <figure className="promo-figure-container">
                <ImageWithSkeleton
                  className="promo-icons"
                  src={images.almendra}
                  alt="almendras"
                />
                <figcaption>Almendras</figcaption>
              </figure>
              <figure className="promo-figure-container">
                <ImageWithSkeleton
                  className="promo-icons"
                  src={images.avellanaNaranja}
                  alt="avelanas"
                />
                <figcaption>Avellanas</figcaption>
              </figure>
            </div>
            <Link to="/products/nt" className="promo-btn fit-content">
              Comprar
            </Link>
          </div>
        </div>
        {!viewport ? (
          <ImageWithSkeleton
            className="promo-img"
            src={images.frutosecos3}
            alt="promo"
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Promotion;
