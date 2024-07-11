"use client";

import { useEffect, useState } from "react";
import IconArrowUp from "../icons/IconArrowUp";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Function to handle scroll event
  const toggleVisibility = () => {
    if (window.scrollY > 800) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && <button className="fixed z-50 right-3 bottom-6 flex items-center justify-center font-bold hover:border-primary hover:text-primary size-10 border-2 border-current rounded-full" onClick={() => scrollToTop()}>
        <IconArrowUp className="w-7 h-7"/>
      </button>}
    </>
  );
}
