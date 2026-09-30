'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const VISITOR_STORAGE_KEY = 'prevu_vid_v1'

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server'
  try {
    let id = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (!id) {
      const randomPart = Math.random().toString(36).substring(2, 10)
      const timePart = Date.now().toString(36)
      id = `pv_${timePart}_${randomPart}`
      localStorage.setItem(VISITOR_STORAGE_KEY, id)
    }
    return id
  } catch {
    return 'pv_fallback_' + Math.random().toString(36).substring(2, 8)
  }
}

function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent.toLowerCase()
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return 'tablet'
  }
  if (/(mobi|ipod|phone|blackberry|opera mini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

function sendBeaconOrFetch(payload: Record<string, unknown>) {
  const data = JSON.stringify(payload)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([data], { type: 'application/json' })
    const sent = navigator.sendBeacon('/api/analytics/track', blob)
    if (sent) return
  }

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
    keepalive: true
  }).catch(() => {
    // Silent fail so user browsing experience is never interrupted
  })
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    const visitorId = getOrCreateVisitorId()
    const deviceType = detectDevice()

    // 1. Send pageview on route change
    if (lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname
      sendBeaconOrFetch({
        visitorId,
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        deviceType,
        action: 'pageview'
      })
    }

    // 2. Periodic heartbeat while tab is active and visible
    const heartbeatInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendBeaconOrFetch({
          visitorId,
          path: pathname,
          deviceType,
          action: 'heartbeat'
        })
      }
    }, 30000) // Heartbeat every 30 seconds

    // 3. Tab visibility and unload handling
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendBeaconOrFetch({
          visitorId,
          path: pathname,
          deviceType,
          action: 'heartbeat'
        })
      }
    }

    const handlePageHide = () => {
      sendBeaconOrFetch({
        visitorId,
        path: pathname,
        deviceType,
        action: 'leave'
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      clearInterval(heartbeatInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [pathname])

  return null
}
