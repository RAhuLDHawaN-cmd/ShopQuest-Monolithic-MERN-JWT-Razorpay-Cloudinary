import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselRef = useRef(null);

  const moveCarousel = useCallback((direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector('.home-carousel-card');
    if (!firstCard) return;

    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const distance = firstCard.getBoundingClientRect().width + gap;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - distance / 2;

    if (direction > 0 && atEnd) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction < 0 && carousel.scrollLeft <= distance / 2) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length < 2 || carouselPaused) return undefined;
    const timer = window.setInterval(() => moveCarousel(1), 4500);
    return () => window.clearInterval(timer);
  }, [carouselPaused, moveCarousel, products.length]);

  return (
    <div className="home-container">
      <div className="hero-banner">
        <span className="hero-eyebrow">Your next great find starts here</span>
        <h1>Find something you’ll love.</h1>
        <p>Explore everyday favorites and fresh finds, all in one place.</p>
        <Link to="/shop" className="btn hero-cta">Explore the shop</Link>
      </div>
      <section className="home-featured" aria-labelledby="featured-heading">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">Picked for you</span>
            <h2 id="featured-heading">Featured finds</h2>
          </div>
          <div className="home-carousel-controls">
            <button type="button" aria-label="Previous products" onClick={() => moveCarousel(-1)}>←</button>
            <button type="button" aria-label="Next products" onClick={() => moveCarousel(1)}>→</button>
          </div>
        </div>
      {loading ? (
        <div className="home-carousel-message" role="status">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="home-carousel-message">No products to show yet. Check back soon.</div>
      ) : (
        <div
          className="home-carousel"
          ref={carouselRef}
          aria-label="Featured products"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onFocus={() => setCarouselPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setCarouselPaused(false);
          }}
        >
          {products.map((product) => (
            <div className="home-carousel-card" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
      </section>
    </div>
  );
};

export default Home;
