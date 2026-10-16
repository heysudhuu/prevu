'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, MessageSquare, Shield, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MobileBottomNav() {
  const pathname = usePathname()

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
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white font-bold' 
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-prevu-accent/15 rounded-xl border border-prevu-accent/30 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-prevu-accent' : ''}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-white font-semibold' : 'text-prevu-text-muted'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
