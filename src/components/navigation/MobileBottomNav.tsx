'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, MessageSquare, Shield, User, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      exact: true,
    },
    {
      href: '/browse',
      label: 'Study Hub',
      icon: BookOpen,
      exact: false,
    },
    {
      href: '/requests',
      label: 'Community',
      icon: MessageSquare,
      exact: false,
    },
    {
      href: '/vault',
      label: 'Vault',
      icon: Shield,
      exact: false,
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: User,
      exact: false,
    },
  ]

  // Don't render inside admin console or on auth pages where it could interfere
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090d]/92 backdrop-blur-2xl border-t border-prevu-surface-light/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-2 py-1 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors duration-200 ${
                isActive 
                  ? 'text-white font-bold' 
                  : 'text-prevu-text-muted hover:text-white font-medium'
              }`}
            >
              {isActive && (
                <>
                  {/* Fluid Stretch Active Pill (Figma Riff Inspired) */}
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 rounded-xl bg-prevu-accent/15 border border-prevu-accent/35 shadow-[0_0_12px_rgba(35,134,54,0.18)] -z-10"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                            mass: 0.8
                          }
                    }
                  >
                    {/* Top micro sheen */}
                    <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.div>

                  {/* Elastic Trailing Droplet Indicator */}
                  <motion.div
                    layoutId="mobileNavActiveDroplet"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-full bg-prevu-accent shadow-[0_0_8px_var(--color-prevu-accent)] z-20 pointer-events-none"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            type: 'spring',
                            stiffness: 240,
                            damping: 20,
                            mass: 1.15
                          }
                    }
                  >
                    <span className="absolute inset-0 rounded-full bg-white/40 blur-[0.5px]" />
                  </motion.div>
                </>
              )}

              <span className="relative z-10 flex flex-col items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 text-prevu-accent' : ''}`} />
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-white font-semibold' : 'text-prevu-text-muted'}`}>
                  {item.label}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
