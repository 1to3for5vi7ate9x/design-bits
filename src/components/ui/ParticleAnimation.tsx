'use client'

import { useEffect, useRef } from 'react'
import { createAnimatable, utils, stagger } from 'animejs'

export default function ParticleAnimation() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<any>(null)
  const sizeRef = useRef({ w: 0, h: 0, hw: 0, hh: 0 })

  useEffect(() => {
    if (!particlesRef.current) return

    const rows = 10 // --size value
    const particlesEl = particlesRef.current

    // Create particle elements
    for (let i = 0; i < rows * rows; i++) {
      const div = document.createElement('div')
      particlesEl.appendChild(div)
    }

    // Hide default cursor
    document.body.style.cursor = 'none'

    // Initialize size values
    const updateSize = () => {
      sizeRef.current.w = window.innerWidth
      sizeRef.current.h = window.innerHeight
      sizeRef.current.hw = sizeRef.current.w / 2
      sizeRef.current.hh = sizeRef.current.h / 2
    }
    updateSize()

    // Setup animations
    const duration = stagger(50, { 
      ease: 'in(1)', 
      from: 'center', 
      grid: [rows, rows] 
    })

    const particles = createAnimatable('.particles div', {
      x: { duration },
      y: { duration },
      rotate: { unit: 'rad', duration: 0 },
      ease: 'outElastic(.3, 1.4)',
    })

    animationRef.current = particles

    // Mouse move handler
    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e
      const { w, h, hw, hh } = sizeRef.current
      
      particles.x(utils.mapRange(clientX, 0, w, -hw, hw))
      particles.y(utils.mapRange(clientY, 0, h, -hh, hh))
      particles.rotate(-Math.atan2(hw - clientX, hh - clientY))
    }

    // Add event listeners
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('resize', updateSize)

    // Cleanup
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', updateSize)
      // Restore default cursor
      document.body.style.cursor = 'auto'
      // Clean up particles
      while (particlesEl.firstChild) {
        particlesEl.removeChild(particlesEl.firstChild)
      }
    }
  }, [])

  return (
    <>
      <style jsx>{`
        .particles {
          --size: 10;
          --diameter: 1em;
          --margin: 0em;
          --red: #ff0066;
          font-size: 1px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          width: calc(var(--size) * 1em);
          height: calc(var(--size) * 1em);
          pointer-events: none;
          z-index: 9999;
        }
        
        .particles :global(div) {
          position: relative;
          width: calc(var(--diameter) - var(--margin) * 2);
          height: calc(var(--diameter) - var(--margin) * 2);
          margin: var(--margin);
          background: var(--red);
          mix-blend-mode: plus-lighter;
          box-shadow: 0 0 10px 0 var(--red);
          border-radius: 0.5rem;
          opacity: 0.75;
        }
      `}</style>
      <div ref={particlesRef} className="particles"></div>
    </>
  )
}