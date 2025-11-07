import { useState, useEffect, useCallback } from "react";
import Slide from "./Slide";
import type { SlideContent } from "./types";

interface PresentationProps {
  slides: SlideContent[];
}

export default function Presentation({ slides }: PresentationProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) =>
      Math.min(prevIndex + 1, slides.length - 1)
    );
  }, [slides.length]);

  const goToPreviousSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNextSlide();
      } else if (event.key === "ArrowLeft") {
        goToPreviousSlide();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextSlide, goToPreviousSlide]);

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-main text-xl">
        No slides to display. Please upload a notebook.
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-main">
      <div className="flex-grow flex items-center justify-center w-full h-full">
        <Slide cell={slides[currentSlideIndex]} />
      </div>
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <button
          onClick={goToPreviousSlide}
          disabled={currentSlideIndex === 0}
          className="p-3 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={goToNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="p-3 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
        <span className="text-gray-400 text-lg">
          Slide {currentSlideIndex + 1} of {slides.length}
        </span>
      </div>
    </div>
  );
}