'use client'

import React, { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export type LottieBadgeVariant = 'radar' | 'spark' | 'pulse-orb'

interface LottieBadgeProps {
  variant?: LottieBadgeVariant
  size?: number
  className?: string
}

// Self-contained, zero-network Lottie JSON schemas (60fps SVG via lottie-web)
function getLottieAnimationData(variant: LottieBadgeVariant) {
  if (variant === 'radar') {
    return {
      v: '5.7.4',
      fr: 60,
      ip: 0,
      op: 120,
      w: 48,
      h: 48,
      nm: 'RadarPulse',
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'OuterRing',
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 0, s: [90], e: [0] },
                { t: 100, s: [0] }
              ]
            },
            s: {
              a: 1,
              k: [
                { t: 0, s: [25, 25, 100], e: [100, 100, 100] },
                { t: 100, s: [100, 100, 100] }
              ]
            },
            p: { a: 0, k: [24, 24, 0] },
            a: { a: 0, k: [0, 0, 0] }
          },
          shapes: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [38, 38] }
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.22, 0.74, 0.97, 1] },
              w: { a: 0, k: 3 }
            }
          ],
          ip: 0,
          op: 120,
          st: 0
        },
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: 'CoreDot',
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            s: {
              a: 1,
              k: [
                { t: 0, s: [90, 90, 100], e: [115, 115, 100] },
                { t: 60, s: [115, 115, 100], e: [90, 90, 100] },
                { t: 120, s: [90, 90, 100] }
              ]
            },
            p: { a: 0, k: [24, 24, 0] },
            a: { a: 0, k: [0, 0, 0] }
          },
          shapes: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [14, 14] }
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.14, 0.76, 0.44, 1] }
            }
          ],
          ip: 0,
          op: 120,
          st: 0
        }
      ]
    }
  }

  if (variant === 'spark') {
    return {
      v: '5.7.4',
      fr: 60,
      ip: 0,
      op: 120,
      w: 48,
      h: 48,
      nm: 'SparkBeacon',
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Halo',
          sr: 1,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 0, s: [40], e: [75] },
                { t: 60, s: [75], e: [40] },
                { t: 120, s: [40] }
              ]
            },
            s: {
              a: 1,
              k: [
                { t: 0, s: [80, 80, 100], e: [115, 115, 100] },
                { t: 60, s: [115, 115, 100], e: [80, 80, 100] },
                { t: 120, s: [80, 80, 100] }
              ]
            },
            r: {
              a: 1,
              k: [
                { t: 0, s: [0], e: [90] },
                { t: 120, s: [90] }
              ]
            },
            p: { a: 0, k: [24, 24, 0] },
            a: { a: 0, k: [0, 0, 0] }
          },
          shapes: [
            {
              ty: 'sr',
              sy: 1,
              pt: { a: 0, k: 4 },
              p: { a: 0, k: [0, 0] },
              or: { a: 0, k: 18 },
              ir: { a: 0, k: 6 },
              is: { a: 0, k: 0 },
              os: { a: 0, k: 0 },
              r: { a: 0, k: 0 }
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.96, 0.62, 0.04, 1] }
            }
          ],
          ip: 0,
          op: 120,
          st: 0
        }
      ]
    }
  }

  // 'pulse-orb'
  return {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 120,
    w: 48,
    h: 48,
    nm: 'PulseOrb',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Wave',
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [80], e: [0] },
              { t: 90, s: [0] }
            ]
          },
          s: {
            a: 1,
            k: [
              { t: 0, s: [35, 35, 100], e: [100, 100, 100] },
              { t: 90, s: [100, 100, 100] }
            ]
          },
          p: { a: 0, k: [24, 24, 0] },
          a: { a: 0, k: [0, 0, 0] }
        },
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [36, 36] }
          },
          {
            ty: 'fl',
            c: { a: 0, k: [0.14, 0.76, 0.44, 0.55] }
          }
        ],
        ip: 0,
        op: 120,
        st: 0
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: 'Center',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          s: { a: 0, k: [100, 100, 100] },
          p: { a: 0, k: [24, 24, 0] },
          a: { a: 0, k: [0, 0, 0] }
        },
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [14, 14] }
          },
          {
            ty: 'fl',
            c: { a: 0, k: [0.24, 0.84, 0.52, 1] }
          }
        ],
        ip: 0,
        op: 120,
        st: 0
      }
    ]
  }
}

export default function LottieBadge({
  variant = 'pulse-orb',
  size = 18,
  className = ''
}: LottieBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced || !containerRef.current) return

    let anim: { destroy: () => void } | null = null
    let cancelled = false

    import('lottie-web').then((lottie) => {
      if (cancelled || !containerRef.current) return
      anim = lottie.default.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: getLottieAnimationData(variant)
      })
    }).catch(() => {
      // Fail quietly if lottie-web cannot initialize
    })

    return () => {
      cancelled = true
      anim?.destroy()
    }
  }, [variant, prefersReduced])

  if (prefersReduced) {
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-prevu-accent" />
      </span>
    )
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    />
  )
}
