import images from "../images/exporting";
import {
  Header,
  Footer,
  Presentation,
  TopText,
  CartContent,
  FooterText,
} from "./index.js";

const Cart = () => {
  return (
    <>
      <Header dynamic={true} />
      <main id="main-content" role="main">
        <Presentation
          image={images.bg4}
          image2={images.bg2}
          container="product-centered-text alternative-product-title-position"
          headingId="cart-heading"
        >
          <TopText lastPath="cart" />
        </Presentation>
        <CartContent />
      </main>
      <Footer>
        <FooterText firstPart="Síguenos en " lastPart="Instagram" />
      </Footer>
    </>
  );
};

export default Cart;
