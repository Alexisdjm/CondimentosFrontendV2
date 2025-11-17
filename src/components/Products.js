import {
  TopText,
  Presentation,
  Categories,
  Header,
  Footer,
  CatContainer,
  ProductsGallery,
  Featured,
  FooterText,
} from "./index.js";
import { useLastPathSegment, useInfiniteProducts } from "../hooks";
import images from "../images/exporting";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const lastPath = useLastPathSegment();

  // Usar el nuevo hook de paginación infinita
  const { products, loading, hasMore, error, isLoadingMore, totalProducts } =
    useInfiniteProducts(lastPath);

  const handleCategorySelect = (code) => {
    if (!code || code === lastPath) {
      return;
    }
    navigate(`/products/${code}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header dynamic={true} />
      <main id="main-content" role="main">
        <Presentation
          image={images.bg3}
          image2={images.bg1}
          container="product-centered-text alternative-product-title-position"
          headingId="products-heading"
        >
          <TopText lastPath={lastPath} />
        </Presentation>
        <CatContainer>
          <Categories
            margin="categories-section-padding"
            textalign="categories-text-padding"
            activeCategory={lastPath}
            onCategorySelect={handleCategorySelect}
          />
        </CatContainer>
        <section
          aria-labelledby="products-heading"
          aria-label="Lista de productos"
        >
          <ProductsGallery
            elements={products}
            loading={loading}
            hasMore={hasMore}
            error={error}
            isLoadingMore={isLoadingMore}
            totalProducts={totalProducts}
          />
        </section>
        <Featured css="flex-col align-center section-margin" />
      </main>
      <Footer>
        <FooterText firstPart="Encuentranos en " lastPart="Instagram" />
      </Footer>
    </>
  );
};

export default Products;
