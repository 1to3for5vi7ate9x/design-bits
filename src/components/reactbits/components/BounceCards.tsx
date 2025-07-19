'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface Card {
  id: string;
  title: string;
  content: string;
  image?: string;
}

interface BounceCardsProps {
  cards?: Card[];
  className?: string;
  cardClassName?: string;
  bounceIntensity?: number;
  perspective?: number;
}

export function BounceCards({
  cards = [
    { id: '1', title: 'Card 1', content: 'This is the first card' },
    { id: '2', title: 'Card 2', content: 'This is the second card' },
    { id: '3', title: 'Card 3', content: 'This is the third card' },
  ],
  className,
  cardClassName,
  bounceIntensity = 15,
  perspective = 1000,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getCardTransform = (index: number) => {
    if (!isHovering) {
      const rotateX = mousePosition.y * bounceIntensity;
      const rotateY = -mousePosition.x * bounceIntensity;
      const translateZ = Math.abs(mousePosition.x * mousePosition.y) * 50;
      
      return `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    }
    
    return '';
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8",
        className
      )}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={cn(
            "relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 ease-out cursor-pointer hover:shadow-xl",
            "transform-gpu",
            cardClassName
          )}
          style={{
            transform: getCardTransform(index),
            transition: 'transform 0.3s ease-out',
          }}
          onMouseEnter={() => setIsHovering(card.id)}
          onMouseLeave={() => setIsHovering(null)}
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {card.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {card.content}
          </p>
        </div>
      ))}
    </div>
  );
}