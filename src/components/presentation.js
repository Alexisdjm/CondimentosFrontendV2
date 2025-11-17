import { useState, useEffect } from "react";

const Intro = ({ image, image2, children, container, headingId }) => {
  const [width, setwidth] = useState(false);

  useEffect(() => {
    window.innerWidth < 464 ? setwidth(true) : setwidth(false);
    window.addEventListener("resize", function () {
      window.innerWidth < 464 ? setwidth(true) : setwidth(false);
    });
  }, []);

  return (
    <>
      <section
        className="intro-container bg-fit"
        style={
          !width
            ? { backgroundImage: `url(${image})` }
            : { backgroundImage: `url(${image2})` }
        }
        aria-label="Sección de presentación"
      >
        <div
          className={container}
          role="region"
          {...(headingId
            ? { "aria-labelledby": headingId }
            : { "aria-label": "Contenido de presentación" })}
        >
          {children}
        </div>
        <div
          className="custom-shape-divider-bottom-1681072197"
          aria-hidden="true"
        >
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Intro;
