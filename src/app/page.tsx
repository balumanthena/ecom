"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/hero1.jpg", // Change to your jewelry banner
    title: "Timeless Royal Elegance",
    sub: "Premium Imitation Jewelry Crafted with Perfection",
  },
  {
    id: 2,
    image: "/hero2.jpg",
    title: "Shine Like Royalty",
    sub: "Discover Handpicked Premium Collections",
  },
  {
    id: 3,
    image: "/hero3.jpg",
    title: "Where Luxury Meets Beauty",
    sub: "Shop Exclusive Designs & Festive Collections",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const i = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <Image
        src={slides[index].image}
        alt="Royal Jewelry Banner"
        fill
        priority
        className="object-cover transition-all duration-700"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="font-display text-4xl md:text-6xl drop-shadow-lg mb-3 tracking-wide">
          {slides[index].title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-6">
          {slides[index].sub}
        </p>

        <Link
          href="/shop"
          className="px-8 py-3 bg-white text-black font-medium rounded-full shadow-md hover:bg-royal-600 hover:text-white transition-all"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
