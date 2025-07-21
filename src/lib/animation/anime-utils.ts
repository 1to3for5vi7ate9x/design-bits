// anime.js v4 utilities for React integration
import { useEffect, useRef, useCallback, MutableRefObject } from 'react';

// Import anime.js from npm package
import { 
  animate,
  createTimeline,
  stagger as animeStagger,
  Spring,
  eases,
  utils,
  engine
} from 'animejs';

// Create anime namespace to match the v3 API
const anime = Object.assign(animate, {
  timeline: createTimeline,
  stagger: animeStagger,
  spring: Spring,
  eases,
  utils,
  engine,
  remove: (targets: any) => {
    // In v4, cleanup is handled differently
    if (targets && Array.isArray(targets)) {
      targets.forEach((target: any) => {
        if (target && target.pause) {
          target.pause();
        }
      });
    }
    return targets;
  }
});

export { anime };

// Types for anime.js animations
export interface AnimeParams {
  [key: string]: any;
  targets?: any;
  duration?: number;
  delay?: number | ((el: Element, i: number) => number);
  endDelay?: number;
  easing?: string;
  round?: number;
  begin?: (anim: any) => void;
  change?: (anim: any) => void;
  update?: (anim: any) => void;
  complete?: (anim: any) => void;
  autoplay?: boolean;
  loop?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate';
}

export interface AnimeTimelineParams extends AnimeParams {
  add?: AnimeParams | AnimeParams[];
}

// Hook for basic anime.js animations
export function useAnime(
  params: AnimeParams | (() => AnimeParams),
  deps: any[] = []
) {
  const animationRef = useRef<any>(null);
  const targetsRef = useRef<any>(null);

  useEffect(() => {
    const animParams = typeof params === 'function' ? params() : params;
    
    if (animParams.targets || targetsRef.current) {
      animationRef.current = anime({
        ...animParams,
        targets: animParams.targets || targetsRef.current,
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
        anime.remove(animationRef.current.animatables);
      }
    };
  }, deps);

  return {
    animation: animationRef.current,
    targetsRef,
    play: () => animationRef.current?.play(),
    pause: () => animationRef.current?.pause(),
    restart: () => animationRef.current?.restart(),
    reverse: () => animationRef.current?.reverse(),
    seek: (time: number) => animationRef.current?.seek(time),
  };
}

// Hook for anime.js timeline animations
export function useAnimeTimeline(
  params: AnimeTimelineParams = {},
  deps: any[] = []
) {
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    timelineRef.current = createTimeline(params);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };
  }, deps);

  const add = useCallback((params: AnimeParams, offset?: string | number) => {
    if (timelineRef.current) {
      timelineRef.current.add(params, offset);
    }
  }, []);

  return {
    timeline: timelineRef.current,
    add,
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    restart: () => timelineRef.current?.restart(),
    reverse: () => timelineRef.current?.reverse(),
    seek: (time: number) => timelineRef.current?.seek(time),
  };
}

// Hook for scroll-triggered animations
export function useAnimeScroll(
  targetRef: MutableRefObject<HTMLElement | null>,
  params: AnimeParams,
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
  } = {}
) {
  const animationRef = useRef<any>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!hasTriggered.current || !options.triggerOnce)) {
            if (!animationRef.current) {
              animationRef.current = anime({
                ...params,
                targets: targetRef.current,
                autoplay: false,
              });
            }
            animationRef.current.play();
            hasTriggered.current = true;
          } else if (!entry.isIntersecting && animationRef.current && !options.triggerOnce) {
            animationRef.current.reverse();
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [params, options.threshold, options.rootMargin, options.triggerOnce]);

  return animationRef.current;
}

// Utility to create stagger effects
export function stagger(
  value: number | string,
  options: {
    start?: number | string;
    from?: 'first' | 'last' | 'center' | number;
    direction?: 'normal' | 'reverse';
    easing?: string;
    grid?: [number, number];
    axis?: 'x' | 'y';
  } = {}
) {
  return animeStagger(value, options);
}

// Utility for spring animations
export function spring(mass = 1, stiffness = 100, damping = 10, velocity = 0) {
  return `spring(${mass}, ${stiffness}, ${damping}, ${velocity})`;
}

// Common easing functions
export const easings = {
  // Built-in easings
  linear: 'linear',
  easeInQuad: 'easeInQuad',
  easeOutQuad: 'easeOutQuad',
  easeInOutQuad: 'easeInOutQuad',
  easeInCubic: 'easeInCubic',
  easeOutCubic: 'easeOutCubic',
  easeInOutCubic: 'easeInOutCubic',
  easeInQuart: 'easeInQuart',
  easeOutQuart: 'easeOutQuart',
  easeInOutQuart: 'easeInOutQuart',
  easeInQuint: 'easeInQuint',
  easeOutQuint: 'easeOutQuint',
  easeInOutQuint: 'easeInOutQuint',
  easeInSine: 'easeInSine',
  easeOutSine: 'easeOutSine',
  easeInOutSine: 'easeInOutSine',
  easeInExpo: 'easeInExpo',
  easeOutExpo: 'easeOutExpo',
  easeInOutExpo: 'easeInOutExpo',
  easeInCirc: 'easeInCirc',
  easeOutCirc: 'easeOutCirc',
  easeInOutCirc: 'easeInOutCirc',
  easeInBack: 'easeInBack',
  easeOutBack: 'easeOutBack',
  easeInOutBack: 'easeInOutBack',
  easeInElastic: 'easeInElastic',
  easeOutElastic: 'easeOutElastic',
  easeInOutElastic: 'easeInOutElastic',
  // Spring presets
  spring: spring(),
  springIn: spring(1, 100, 10, 0),
  springOut: spring(1, 100, 10, 0),
  // Custom cubic bezier
  ease: 'cubicBezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubicBezier(0.42, 0, 1, 1)',
  easeOut: 'cubicBezier(0, 0, 0.58, 1)',
  easeInOut: 'cubicBezier(0.42, 0, 0.58, 1)',
};