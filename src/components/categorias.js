import images from "../images/exporting.js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Element } from "react-scroll";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";

const categoryList = [
  {
    code: "co",
    label: "Condimentos",
    icon: images.condimentoIcon,
  },
  {
    code: "bk",
    label: "Repostería",
    icon: images.bakery,
  },
  {
    code: "nt",
    label: "Frutos secos",
    icon: images.nueces,
  },
  {
    code: "gr",
    label: "Granos y cereales",
    icon: images.rice,
    labelClass: "categories-name-text",
  },
  {
    code: "gc",
    label: "Víveres",
    icon: images.butter,
  },
  {
    code: "ch",
    label: "Químicos y más",
    icon: images.chemical,
    labelClass: "categories-name-text",
  },
];

const Categories = ({
  margin,
  textalign,
  activeCategory,
  onCategorySelect,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentCategory = useMemo(() => {
    if (activeCategory) return activeCategory;
    const pathSegment = location.pathname.split("/").filter(Boolean);
    return pathSegment[pathSegment.length - 1] || null;
  }, [activeCategory, location.pathname]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1441 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 1440, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1023, min: 768 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 767, min: 281 },
      items: 4,
    },
    zfold: {
      breakpoint: { max: 280, min: 0 },
      items: 2,
    },
  };

  const handleCategoryClick = (code) => {
    if (onCategorySelect) {
      onCategorySelect(code);
    } else {
      navigate(`/products/${code}`);
    }
  };

  const renderCategoryButton = (category, variant = "desktop") => {
    const isActive = currentCategory === category.code;
    const baseClass =
      variant === "desktop"
        ? "categories-link-container align-center"
        : "categories-mobile-circle";

    return (
      <button
        key={`${variant}-${category.code}`}
        type="button"
        className={`${baseClass}${isActive ? " category-active" : ""}`}
        onClick={() => handleCategoryClick(category.code)}
        aria-label={`Filtrar productos por categoría ${category.label}${isActive ? ", categoría actualmente seleccionada" : ""}`}
        aria-pressed={isActive}
        aria-current={isActive ? "page" : undefined}
      >
        <img
          className={
            variant === "desktop" ? "categories-img" : "categories-mobile-img"
          }
          src={category.icon}
          alt=""
          aria-hidden="true"
        ></img>
        {variant === "desktop" ? (
          category.labelClass ? (
            <p className={category.labelClass}>{category.label}</p>
          ) : (
            <span>{category.label}</span>
          )
        ) : null}
      </button>
    );
  };

  return (
    <>
      <Element
        name="categorias"
        id="categorias"
        className={`flex-col align-center ${margin} relative`}
        role="region"
        aria-labelledby="categories-heading"
      >
        <div className={`flex-center ${textalign}`}>
          <h2 id="categories-heading" className="categories-warning">Filtrar por Categorias</h2>
          <p className="categories-info" aria-label="Todas las categorías disponibles">Todas las Categorias</p>
        </div>
        <nav className="flex-center categories-container" aria-label="Navegación de categorías">
          {categoryList.map((category) => renderCategoryButton(category))}
        </nav>
        <div className="categories-mobile-container" role="region" aria-label="Carrusel de categorías móvil">
          <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={7500}
            ssr={true}
            draggable={true}
            infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile", "zfold"]}
            aria-label="Categorías de productos"
          >
            {categoryList.map((category) => (
              <div
                key={`mobile-${category.code}`}
                className="flex-col align-center categories-mobile-box"
                role="group"
                aria-label={`Categoría ${category.label}`}
              >
                {renderCategoryButton(category, "mobile")}
                <h3 className="categories-mobile-text">{category.label}</h3>
              </div>
            ))}
          </Carousel>
        </div>
      </Element>
    </>
  );
};

export default Categories;
