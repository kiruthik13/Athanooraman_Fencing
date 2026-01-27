import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({
    items = [],
    autoScroll = true,
    interval = 5000,
    renderItem,
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    useEffect(() => {
        if (!autoScroll || items.length <= 1) return;

        const timer = setInterval(goToNext, interval);
        return () => clearInterval(timer);
    }, [autoScroll, interval, items.length, goToNext]);

    if (!items || items.length === 0) {
        return <div className="text-center text-slate-500 py-12">No items to display</div>;
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl ${className}`}>
            {/* Carousel Items */}
            <div className="relative h-96">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`
              absolute inset-0 transition-all duration-500 ease-in-out
              ${index === currentIndex
                                ? 'opacity-100 translate-x-0 z-10'
                                : index < currentIndex
                                    ? 'opacity-0 -translate-x-full z-0'
                                    : 'opacity-0 translate-x-full z-0'
                            }
            `}
                    >
                        {renderItem ? renderItem(item, index) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-primary text-white text-2xl font-bold">
                                {item}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110 shadow-lg z-20"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-900" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all hover:scale-110 shadow-lg z-20"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-slate-900" />
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {items.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`
                h-2 rounded-full transition-all duration-300
                ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 w-2 hover:bg-white/75'
                                }
              `}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
