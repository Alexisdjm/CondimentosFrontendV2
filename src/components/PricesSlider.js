import { useState } from "react"

const PricesSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex === 4 - 1 ? 0 : prevIndex + 1
        );
      };

      const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? 4 - 1 : prevIndex - 1
        );
      };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div style={{ position: "relative", width: "600px", margin: "auto" }}>
            <img
              src=""
              alt={`Slide ${currentIndex + 1}`}
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "10px",
                transition: "opacity 0.5s ease-in-out",
              }}
            />
            <button
              onClick={prevSlide}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                padding: "10px",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                padding: "10px",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              ▶
            </button>
          </div>
        </div>
    )
}

export default PricesSlider
