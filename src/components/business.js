import images from "../images/exporting.js";
import { ImageWithSkeleton } from "./index.js";

const Business = () => {
  const content = {
    content1: "Contamos con delivery a todas partes de Barquisimeto y Cabudare",
    content2:
      "Nos caracterizamos por traer productos de la mejor calidad, sabor y frescura",
    content3:
      "Vendemos al mayor y al detal, pensando en tu negocio y en tu hogar",
  };

  return (
    <>
      <div className="flex-center section-margin">
        <div className="flex-col align-center">
          <div className="flex-col fit-content">
            <h1 className="business-title">Nuestro Negocio</h1>
            <img
              className="busines-title-underline"
              src={images.underline}
              alt="underline"
            ></img>
          </div>
          <div className="badges-flex">
            <div className="flex-col badge-relative-box align-center center">
              <ImageWithSkeleton
                className="business-badge-img"
                src={images.cuatrocondimentos}
                alt="badge1"
              />
              <div className="flex-col align-center badge-content-container">
                <div className="business-small-img-container">
                  <ImageWithSkeleton
                    className="business-small-img"
                    src={images.moto}
                    alt="delivery"
                  />
                </div>
                <h1 className="business-each-title">Delivery</h1>
                <h4 className="business-content">{content.content1}</h4>
              </div>
            </div>
            <div className="flex-col badge-relative-box align-center center">
              <ImageWithSkeleton
                className="business-badge-img"
                src={images.condimentosbadge3}
                alt="badge2"
              />
              <div className="flex-col align-center badge-content-container">
                <div className="business-small-img-container">
                  <ImageWithSkeleton
                    className="business-small-img"
                    src={images.badge}
                    alt="badge3"
                  />
                </div>
                <h1 className="business-each-title">Calidad</h1>
                <h4 className="business-content">{content.content2}</h4>
              </div>
            </div>
            <div className="flex-col badge-relative-box align-center center">
              <ImageWithSkeleton
                className="business-badge-img"
                src={images.platopimienta2}
                alt="pimienta"
              />
              <div className="flex-col align-center badge-content-container">
                <div className="business-small-img-container">
                  <ImageWithSkeleton
                    className="business-small-img"
                    src={images.mayordetal}
                    alt="badge4"
                  />
                </div>
                <h1 className="business-each-title">Mayor y detal</h1>
                <h4 className="business-content">{content.content3}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Business;
