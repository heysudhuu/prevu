'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import SignOutButton from '@/components/auth/SignOutButton'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Upload, 
  User, 
  Menu, 
  X, 
  BookOpen, 
  Sparkles,
  LogIn
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isAdmin: boolean
}

export default function HeaderNav({ user, isAdmin }: HeaderNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/browse', label: 'Browse', icon: <BookOpen className="w-4 h-4" /> },
    ...(user && !isAdmin
      ? [{ href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
      : []),
    ...(isAdmin
      ? [{ href: '/admin', label: 'Admin Console', icon: <ShieldCheck className="w-4 h-4 text-purple-400" />, isAdminLink: true }]
      : []),
    ...(user
      ? [{ href: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> }]
      : []),
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          
          if (link.isAdminLink) {
            return (
              <Button 
                key={link.href} 
                variant="outline" 
                size="sm" 
                asChild 
                className="border-purple-500/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:text-white shadow-sm shadow-purple-500/20 font-bold"
              >
                <Link href={link.href} className="flex items-center gap-1.5">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            )
          }

          return (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={`relative text-xs font-semibold ${
                isActive 
                  ? 'text-white bg-prevu-surface-light/80 shadow-sm' 
                  : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/40'
              }`}
            >
              <Link href={link.href} className="flex items-center gap-1.5">
                {link.label === 'Dashboard' && <LayoutDashboard className="w-3.5 h-3.5 text-prevu-accent" />}
                <span>{link.label}</span>
              </Link>
            </Button>
          )
        })}

        {/* Upload Contribution Button */}
        <Button 
          variant={pathname === '/upload' ? 'default' : 'outline'} 
          size="sm" 
          asChild 
          className="h-8 px-3.5 text-xs font-semibold border-prevu-surface-light/90 hover:border-prevu-accent/50"
        >
          <Link href="/upload" className="flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-prevu-accent" />
            <span>Upload</span>
          </Link>
        </Button>

        {/* Auth CTA */}
        {user ? (
          <div className="pl-1.5 border-l border-prevu-surface-light/80">
            <SignOutButton />
          </div>
        ) : (
          <Button size="sm" className="h-8 px-4 text-xs font-bold" asChild>
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
          </Button>
        )}
      </nav>

      {/* Mobile Hamburger Toggle */}
      <div className="flex md:hidden items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="h-8 px-2.5 text-xs border-prevu-surface-light"
        >
          <Link href="/upload">
            <Upload className="w-3.5 h-3.5 text-prevu-accent" />
          </Link>
        </Button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2 rounded-xl border border-prevu-surface-light bg-prevu-surface/90 text-prevu-text hover:text-prevu-accent transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 p-4 bg-prevu-surface/98 backdrop-blur-2xl border-b border-prevu-surface-light shadow-2xl z-50 md:hidden space-y-3"
          >
            <div className="flex flex-col space-y-1.5">
              <Link
                href="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  pathname === '/browse' ? 'bg-prevu-accent text-white' : 'text-prevu-text hover:bg-prevu-surface-light'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Exam Archive</span>
                </span>
                <Sparkles className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    pathname === '/dashboard' ? 'bg-prevu-accent text-white' : 'text-prevu-text hover:bg-prevu-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-prevu-accent-light" />
                    <span>Student Dashboard</span>
                  </span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    pathname === '/admin' ? 'bg-purple-600 text-white' : 'text-purple-300 bg-purple-500/10 hover:bg-purple-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Studio</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-purple-900/80 px-2 py-0.5 rounded-full border border-purple-500/40">
                    Admin
                  </span>
                </Link>
              )}

              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  pathname === '/upload' ? 'bg-prevu-accent text-white' : 'text-prevu-text hover:bg-prevu-surface-light'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-prevu-accent" />
                  <span>Upload Question Paper</span>
                </span>
              </Link>

              {user && (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                    pathname === '/profile' ? 'bg-prevu-accent text-white' : 'text-prevu-text hover:bg-prevu-surface-light'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>My Student Profile</span>
                  </span>
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-prevu-surface-light/60 flex items-center justify-between">
              {user ? (
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs text-prevu-text-muted truncate max-w-[180px]">
                    Signed in as <strong className="text-prevu-text">{user.name || user.email}</strong>
                  </span>
                  <SignOutButton />
                </div>
              ) : (
                <Button className="w-full py-2.5 text-sm font-bold" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login" className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Prevu</span>
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
