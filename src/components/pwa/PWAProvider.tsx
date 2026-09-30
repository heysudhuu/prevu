'use client'

import { useState, useEffect } from 'react'
import { Download, WifiOff, Wifi, X, Smartphone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showOnlineToast, setShowOnlineToast] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [showIosPrompt, setShowIosPrompt] = useState(false)

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[Prevu PWA] Service Worker registered with scope:', reg.scope)
        })
        .catch((err) => {
          console.warn('[Prevu PWA] Service Worker registration failed:', err)
        })
    }

    // 2. Track Online/Offline Status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)

      const handleOnline = () => {
        setIsOnline(true)
        setShowOnlineToast(true)
        setTimeout(() => setShowOnlineToast(false), 3500)
      }

      const handleOffline = () => {
        setIsOnline(false)
        setShowOnlineToast(true)
        setTimeout(() => setShowOnlineToast(false), 5000)
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // 3. Detect iOS Safari
      const ua = window.navigator.userAgent.toLowerCase()
      const isIosDevice = /iphone|ipad|ipod/.test(ua)
      const isStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches
      if (isIosDevice && !isStandalone) {
        setIsIos(true)
      }

      // 4. Capture BeforeInstallPrompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        const dismissed = localStorage.getItem('prevu_pwa_dismissed')
        if (!dismissed) {
          setShowBanner(true)
        }
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('[Prevu PWA] User accepted install prompt')
    }
    setDeferredPrompt(null)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('prevu_pwa_dismissed', 'true')
  }

  return (
    <>
      {/* Network Status Toast */}
      {showOnlineToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce-subtle">
          <div className={`px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-xl ${
            isOnline
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
              : 'bg-amber-950/90 text-amber-300 border-amber-500/40 shadow-amber-500/20'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Internet connection restored</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>You are offline. Papers in your Offline Vault remain accessible!</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* PWA Install Banner */}
      {showBanner && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
          <div className="p-4 rounded-3xl bg-[#11111a]/95 border border-purple-500/40 shadow-2xl backdrop-blur-2xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-2xl rounded-full pointer-events-none" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>Install Prevu App</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-[11px] text-prevu-text-muted mt-0.5">
                    Fast offline vault, instant opening in exam halls, zero storage lag.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 text-prevu-text-muted hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="flex-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Install on Device
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs text-prevu-text-muted hover:text-white"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
