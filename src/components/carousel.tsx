import { useEffect, useState } from "react";
import axios from "axios";

interface ImageData {
  _id: string;
  imageUrl: string;
  title: string;
}

const Carousel = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [intervalTime, setIntervalTime] = useState<number>(5000);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/images");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const autoplay = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalTime);

    return () => clearInterval(autoplay);
  }, [images, intervalTime]);

  return (
    <div className="carousel-container">
      {images.length > 0 ? (
        <>
          <div className="carousel">
            <button
              className="carousel-button prev"
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)}
            >
              ❮
            </button>
            <img
              src={`http://localhost:8000${images[currentIndex]?.imageUrl}`}
              alt={images[currentIndex]?.title}
              className="carousel-image"
              onError={(e) => console.error("Image failed to load:", e)}
            />
            <button
              className="carousel-button next"
              onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}
            >
              ❯
            </button>
          </div>

          <div className="dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default Carousel;
