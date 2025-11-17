import { useEffect } from "react";
import images from "../images/exporting";
import {
  Header,
  Presentation,
  Footer,
  IntroText,
  FirstView,
  Categories,
  Promotion,
  Business,
  Featured,
  FooterText,
} from "./index.js";
const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header dynamic={true} />
      <main id="main-content" role="main">
        <Presentation
          image={images.bg2}
          image2={images.bg1}
          container="content-box-intro fit-content"
          headingId="presentation-heading"
        >
          <IntroText />
        </Presentation>
        <FirstView />
        <Categories
          margin="categories-section-margin"
          textalign="categories-text-align"
        />
        <Promotion />
        <Featured css="flex-col align-center section-margin" />
        <Business />
      </main>
      <Footer>
        <FooterText firstPart="Síguenos en " lastPart="Instagram" />
      </Footer>
    </>
  );
};

export default Home;
