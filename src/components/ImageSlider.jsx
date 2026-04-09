import React, { useEffect, useState } from "react";
import img1 from "../assets/image1.avif";
import img2 from "../assets/image2.avif";
import img3 from "../assets/image3.avif";
import img4 from "../assets/image4.avif";

const images = [img1, img2, img3, img4];

const ImageSlider = ({ interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [interval]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 relative px-2">
      <div className="overflow-hidden rounded-xl shadow-lg" style={{boxShadow: '0 8px 24px rgba(255, 90, 95, 0.15)'}}>
        <div className="flex transition-transform duration-1000" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <img key={i} src={src} alt={`slide-${i}`} className="w-full shrink-0 object-cover h-64 sm:h-80 md:h-96" />
          ))}
        </div>
      </div>

      <button 
        onClick={prev} 
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-110"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '0.75rem',
          color: 'var(--coral-primary)',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}
      >
        ‹
      </button>
      <button 
        onClick={next} 
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-110"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '0.75rem',
          color: 'var(--coral-primary)',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}
      >
        ›
      </button>

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="rounded-full transition-all duration-300 hover:scale-125"
            style={{
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: i === index ? 'var(--coral-primary)' : 'var(--border-light)',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
