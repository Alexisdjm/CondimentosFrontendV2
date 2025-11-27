import { useState } from "react";
import images from "../images/exporting.js";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ImageWithSkeleton } from "./index.js";
import { API_ENDPOINTS, getImageUrl } from "../config/api";

const Sidebar = ({ togg, func, kind, side, justmobile, id }) => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [clear, setClear] = useState(true);

  const InputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    fetch(API_ENDPOINTS.searchProducts(inputValue))
      .then((response) => {
        // Logs de debugging para verificar el código de estado de la búsqueda
        console.log("[SEARCH DEBUG] Respuesta de búsqueda", {
          url: response.url,
          status: response.status,
          ok: response.ok,
        });

        if (response.status === 403) {
          console.log("[SEARCH DEBUG] Se recibió un 403 al hacer la búsqueda", {
            termino: inputValue,
          });
        }

        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        setResults(data);
        setClear(false);
      })
      .catch((error) => {
        console.error("[SEARCH DEBUG] Error en la búsqueda", error);
      });
  };

  return (
    <>
      <aside
        id={id}
        className={`${side === "left" ? "sidebar" : "right-sidebar"} ${
          justmobile ? "hide-desktop" : "show-in-all"
        } ${kind === "search" ? "sidebar-search" : "sidebar-menu"} ${
          togg ? "active" : ""
        }`}
        role={kind === "search" ? "search" : "navigation"}
        aria-label={
          kind === "search" ? "Búsqueda de productos" : "Menú de navegación"
        }
        aria-hidden={!togg}
      >
        <div className="flex-center">
          <div className="sidebar-search-logo">
            <img
              className="logo-header"
              src={images.logoNegro}
              alt="logo"
            ></img>
          </div>
        </div>
        {kind === "search" ? (
          <>
            <form
              className="search-form flex-center"
              onSubmit={handleSearch}
              role="search"
              aria-label="Búsqueda de productos"
            >
              <label htmlFor="search-input" className="sr-only">
                Buscar productos
              </label>
              <input
                id="search-input"
                required
                type="text"
                placeholder="Buscar"
                value={inputValue}
                className="search-input"
                onChange={InputChange}
                aria-label="Campo de búsqueda de productos"
              ></input>
              <button
                type="submit"
                className="submit-button"
                style={{ padding: "10px" }}
                aria-label="Buscar productos"
              >
                <FaSearch aria-hidden="true" />
              </button>
            </form>
            <div
              className="search-results-container"
              role="region"
              aria-label="Resultados de búsqueda"
            >
              {results.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {results.map((result) => {
                    return (
                      <li key={result.id}>
                        <Link
                          to={`/product/${result.id}`}
                          className="search-result-link"
                          aria-label={`Ver producto ${result.name}`}
                        >
                          <div className="search-results-flex-h">
                            <div className="search-result-img-container">
                              <ImageWithSkeleton
                                className="search-img"
                                src={getImageUrl(result.image)}
                                alt={result.name}
                              />
                            </div>
                            <div className="flex-col">
                              <h4 className="search-name">{result.name}</h4>
                              <h4 className="search-price">${result.price}</h4>
                              <p className="search-description">
                                {result.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : !clear ? (
                <p
                  className="search-empty-result"
                  role="status"
                  aria-live="polite"
                >
                  No se ha encontrado resultados
                </p>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          <nav
            className="flex-col menu-component"
            aria-label="Menú de navegación móvil"
          >
            <Link
              className="sidebar-link"
              to="/"
              aria-label="Ir a página de inicio"
            >
              Inicio
            </Link>
            <Link
              className="sidebar-link"
              to="/products/all"
              aria-label="Ver todos los productos"
            >
              Productos
            </Link>
            <Link
              to="/cart"
              className="sidebar-link"
              aria-label="Ver carrito de compras"
            >
              Carrito
            </Link>
          </nav>
        )}
      </aside>
      <div
        className={`${togg ? "sidebar-overlay active" : "sidebar-overlay"} ${
          justmobile ? "hide-desktop" : "show-in-all"
        }`}
        onClick={func}
        aria-hidden="true"
        role="presentation"
      ></div>
    </>
  );
};

export default Sidebar;
