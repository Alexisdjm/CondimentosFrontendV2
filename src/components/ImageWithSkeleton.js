import { useState } from "react";
import "../styles/ImageWithSkeleton.css";

const ImageWithSkeleton = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`image-skeleton-wrapper ${className}`}>
      {!loaded && !error && (
        <div className="image-skeleton" aria-label="Cargando imagen..." />
      )}
      <img
        src={src}
        alt={alt}
        className={`image-skeleton-img ${loaded ? "loaded" : "loading"}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
};

export default ImageWithSkeleton;
