import { Header, Footer, Item, FooterText } from "./index.js";

const SingleProduct = () => {
  return (
    <>
      <Header dynamic={false} />
      <main id="main-content" role="main">
        <Item />
      </main>
      <Footer>
        <FooterText firstPart="Síguenos en " lastPart="Instagram" />
      </Footer>
    </>
  );
};

export default SingleProduct;
