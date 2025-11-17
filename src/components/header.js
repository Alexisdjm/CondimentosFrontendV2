import images from "../images/exporting";
import { FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar, CheckPath, CartBubble } from "./index.js";

const Header = ({ dynamic }) => {
  const [toggle, setToggle] = useState(false);
  const [menu, setMenu] = useState(false);

  const num = "584129692100";
  let message = "Holaa 😃 Deseo solicitar lista de precios por favor";
  let encodedMessage = encodeURIComponent(message);

  const setSidebar = (e) => {
    e.preventDefault();
    toggle ? setToggle(false) : setToggle(true);
  };

  const setMenuu = (e) => {
    e.preventDefault();
    menu ? setMenu(false) : setMenu(true);
  };

  const [header, setHeader] = useState(false);

  const ScrollToTop = () => {
    if (window.location.pathname !== "/") {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setHeader(true);
      } else {
        setHeader(false);
      }
    });
  }, []);

  return (
    <>
      {dynamic ? (
        <>
          <header
            className={!header ? "header-container" : "header-container-scroll"}
            role="banner"
            aria-label="Navegación principal"
          >
            <div className="simple-flex space-between header-align align-center">
              <button
                className="icon-link mobile-show"
                onClick={setSidebar}
                aria-label="Abrir búsqueda"
                aria-expanded={toggle}
                aria-controls="search-sidebar"
                type="button"
              >
                <img
                  className="mobile-header-icons"
                  src={!header ? images.searchNaranja : images.search}
                  alt=""
                  aria-hidden="true"
                ></img>
              </button>
              <nav
                className="flex-center header-containers-gap left-links-width"
                style={{ width: "38%" }}
                aria-label="Navegación principal"
              >
                <Link
                  className={!header ? "each-link" : "scroll-link"}
                  to="/"
                  onClick={ScrollToTop}
                  aria-label="Ir a página de inicio"
                >
                  Inicio
                </Link>
                <Link
                  className={!header ? "each-link" : "scroll-link"}
                  to="/products/all"
                  aria-label="Ver todos los productos"
                >
                  Productos
                </Link>
                <CheckPath
                  css={!header ? "each-link" : "scroll-link"}
                  path="/"
                  optional="/products/all"
                  id="categorias"
                  aria-label="Ver categorías de productos"
                >
                  Categorias
                </CheckPath>
                <button
                  className={!header ? "each-link" : "scroll-link"}
                  onClick={setSidebar}
                  aria-label="Buscar productos"
                  aria-expanded={toggle}
                  aria-controls="search-sidebar"
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Buscar
                </button>
              </nav>

              <Link
                to="/"
                className={
                  !header
                    ? "logo-header-container align-logo-center"
                    : "logo-header-container-scroll align-logo-center"
                }
                aria-label="Casa de los Condimentos - Ir a inicio"
              >
                <img
                  className="logo-header"
                  src={!header ? images.logoNaranja : images.logoNegro}
                  alt="Casa de los Condimentos"
                ></img>
              </Link>
              <button
                className="icon-link mobile-show"
                onClick={setMenuu}
                aria-label="Abrir menú de navegación"
                aria-expanded={menu}
                aria-controls="menu-sidebar"
                type="button"
              >
                <img
                  className={
                    !header ? "mobile-menu-icon" : "mobile-scroll-menu"
                  }
                  src={!header ? images.menuNaranja : images.menu}
                  alt=""
                  aria-hidden="true"
                ></img>
              </button>
              <div
                className="right-links flex-center header-containers-gap align-center"
                style={{ width: "30%" }}
                role="group"
                aria-label="Acciones del usuario"
              >
                <CartBubble header={header} />
                <a
                  className={
                    !header
                      ? "icon-link icons-svg-dimensions icon-margin-fit simple-flex"
                      : "icon-link icons-svg-scroll icon-margin-fit simple-flex"
                  }
                  href="https://instagram.com/casa_condimentos28?igshid=MzRlODBiNWFlZA=="
                  aria-label="Síguenos en Instagram - Se abre en nueva ventana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  className={!header ? "contact-btn" : "scroll-contact-btn"}
                  href={`https://api.whatsapp.com/send?phone=${num}&text=${encodedMessage}`}
                  aria-label="Contáctanos por WhatsApp"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </header>
          <Sidebar
            togg={toggle}
            func={setSidebar}
            kind="search"
            side="left"
            justmobile={false}
          />
          <Sidebar
            togg={menu}
            func={setMenuu}
            kind="menu"
            side="right"
            justmobile={true}
          />
        </>
      ) : (
        <>
          <header
            className={`static-header ${header ? "fixed" : ""}`}
            role="banner"
            aria-label="Navegación principal"
          >
            <div className="simple-flex space-between header-align align-center">
              <button
                className="icon-link mobile-show"
                onClick={setSidebar}
                aria-label="Abrir búsqueda"
                aria-expanded={toggle}
                aria-controls="search-sidebar"
                type="button"
              >
                <img
                  className="mobile-header-icons"
                  src={images.search}
                  alt=""
                  aria-hidden="true"
                ></img>
              </button>
              <nav
                className="flex-center header-containers-gap left-links-width"
                style={{ width: "38%" }}
                aria-label="Navegación principal"
              >
                <Link
                  className="scroll-link"
                  to="/"
                  aria-label="Ir a página de inicio"
                >
                  Inicio
                </Link>
                <Link
                  className="scroll-link"
                  to="/products/all"
                  aria-label="Ver todos los productos"
                >
                  Productos
                </Link>
                <a
                  className="scroll-link"
                  href="/"
                  aria-label="Ver categorías de productos"
                >
                  Categorias
                </a>
                <button
                  className="scroll-link"
                  onClick={setSidebar}
                  aria-label="Buscar productos"
                  aria-expanded={toggle}
                  aria-controls="search-sidebar"
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Buscar
                </button>
              </nav>
              <Link
                to="/"
                className={"logo-header-container-scroll align-logo-center"}
                aria-label="Casa de los Condimentos - Ir a inicio"
              >
                <img
                  className="logo-header"
                  src={images.logoNegro}
                  alt="Casa de los Condimentos"
                ></img>
              </Link>
              <button
                className="icon-link mobile-show"
                onClick={setMenuu}
                aria-label="Abrir menú de navegación"
                aria-expanded={menu}
                aria-controls="menu-sidebar"
                type="button"
              >
                <img
                  className="mobile-scroll-menu"
                  src={images.menu}
                  alt=""
                  aria-hidden="true"
                ></img>
              </button>
              <div
                className="right-links flex-center header-containers-gap align-center"
                style={{ width: "30%" }}
                role="group"
                aria-label="Acciones del usuario"
              >
                <CartBubble header={true} />
                <a
                  className="icon-link icons-svg-scroll icon-margin-fit simple-flex"
                  href="https://instagram.com/casa_condimentos28?igshid=MzRlODBiNWFlZA=="
                  aria-label="Síguenos en Instagram - Se abre en nueva ventana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  className="scroll-contact-btn"
                  href={`https://api.whatsapp.com/send?phone=${num}&text=${encodedMessage}`}
                  aria-label="Contáctanos por WhatsApp"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </header>
          <Sidebar
            togg={toggle}
            func={setSidebar}
            kind="search"
            side="left"
            justmobile={false}
            id="search-sidebar"
          />
          <Sidebar
            togg={menu}
            func={setMenuu}
            kind="menu"
            side="right"
            justmobile={true}
            id="menu-sidebar"
          />
        </>
      )}
    </>
  );
};

export default Header;
