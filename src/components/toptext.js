const Toptext = ({ lastPath }) => {
  if (!lastPath) return null;

  const keys = ["co", "bk", "nt", "gr", "gc", "ch", "all"];

  // Array de categorías dentro del componente
  const categories = [
    ["co", "Condimentos y Especias"],
    ["bk", "Productos de Repostería"],
    ["nt", "Frutos Secos"],
    ["gr", "Granos y Cereales"],
    ["gc", "Víveres"],
    ["ch", "Químicos y Más"],
  ];

  let text = "";

  if (lastPath === "cart") {
    text = "Carrito de Compras";
  } else {
    if (!keys.includes(lastPath)) {
      window.location.pathname = "/404";
      return null;
    } else if (lastPath === "all") {
      text = "Todos Los Productos";
    } else {
      const found = categories.find((cat) => cat[0] === lastPath);
      text = found ? found[1] : "";
    }
  }

  // Separar última palabra para strong
  const lastSpaceIndex = text.lastIndexOf(" ");
  const firstPart = text.substring(0, lastSpaceIndex + 1);
  const lastPart = text.substring(lastSpaceIndex + 1);

  // Determinar el ID según el contexto
  const headingId = lastPath === "cart" ? "cart-heading" : "products-heading";

  return (
    <h1 id={headingId} className="intro-title publicity-title">
      {firstPart}
      <strong>{lastPart}</strong>
    </h1>
  );
};

export default Toptext;
