export default function BuyButton({ product, cantidad, gramos }) {
  const sendMessage = () => {
    if (!product) return;

    const num = "584129692100";
    const message = [
      `Buenas tardes desde su página web, me gustaría comprar el siguiente producto:\n` +
        `Nombre: ${product.name},\n` +
        `Cantidad: ${
          !product.Pgramos
            ? cantidad + " unidades"
            : gramos
            ? cantidad * 100 + " gr"
            : cantidad + " kg"
        }`,
    ];

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${num}&text=${encodedMessage}`;
    window.location.href = url;
  };

  return (
    <button
      className="purchase-btn"
      onClick={sendMessage}
      aria-label={`Comprar ${product?.name || "producto"} por WhatsApp`}
      type="button"
    >
      Comprar
    </button>
  );
}
