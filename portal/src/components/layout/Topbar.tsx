'use client'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function Topbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <header className="fixed top-0 left-56 right-0 h-14 z-30 flex items-center justify-between px-6 bg-background/95 backdrop-blur border-b border-border">
      <div id="topbar-breadcrumbs" />

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <div className="relative" ref={popupRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-2 h-8 rounded-md hover:bg-accent transition-colors"
          >
            <Avatar className="h-7 w-7">
              {(session?.user as { avatarUrl?: string })?.avatarUrl && (
                <img src={(session?.user as { avatarUrl?: string }).avatarUrl} alt="avatar" className="h-7 w-7 rounded-full object-cover" />
              )}
              <AvatarFallback className="text-xs bg-[#385FF6] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium leading-none">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{session?.user?.role}</p>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-52 rounded-md border border-border bg-popover shadow-md z-50 py-1">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                <Badge variant="outline" className="mt-1 text-[10px] border-[#385FF6] text-[#385FF6]">
                  {session?.user?.role}
                </Badge>
              </div>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => { setOpen(false); window.location.href = 'https://seo.getdriversed.com/settings/profile' }}
              >
                <User className="h-4 w-4" /> Profile
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
