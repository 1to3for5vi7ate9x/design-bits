'use client'

import ParticleAnimation from '@/components/ui/ParticleAnimation'

export default function CursorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticleAnimation />
      {children}
    </>
  )
}