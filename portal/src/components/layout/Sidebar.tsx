'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, Plus, Inbox,
  Globe, BarChart2, ChevronRight,
  Briefcase, Users, Wifi, User, Search,
} from 'lucide-react'

type NavItem = { label: string; href: string; icon: React.ElementType }

const mainNav: NavItem[] = [
  { label: 'Dashboard',  href: '/',        icon: LayoutDashboard },
  { label: 'Pages',      href: '/pages',   icon: FileText },
  { label: 'My Work',    href: '/my-work', icon: Briefcase },
  { label: 'Submit URL', href: '/submit',  icon: Plus },
  { label: 'Inbox',      href: '/inbox',   icon: Inbox },
  { label: 'Sitewide',   href: '/sitewide',icon: Globe },
  { label: 'Search Console', href: '/gsc', icon: Search },
  { label: 'Reports',    href: '/reports', icon: BarChart2 },
]

const settingsNav: NavItem[] = [
  { label: 'Team',    href: '/settings/team',    icon: Users },
  { label: 'GSC',     href: '/settings/gsc',     icon: Wifi },
  { label: 'Profile', href: '/settings/profile', icon: User },
]

function NavLink({ label, href, icon: Icon, path }: NavItem & { path: string }) {
  const active = href === '/' ? path === '/' : path === href || path.startsWith(href + '/')
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors group',
        active
          ? 'bg-[#1a2040] text-white'
          : 'text-slate-400 hover:text-white hover:bg-[#1a1f2e]'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[#9EAAFF]' : 'text-slate-500 group-hover:text-slate-300')} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="h-3 w-3 text-[#9EAAFF]" />}
    </Link>
  )
}

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col bg-[#0f1117] border-r border-[#1e2332] z-40">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[#1e2332] shrink-0">
        <span className="text-white font-bold text-sm tracking-tight">
          <span className="gde-gradient-text text-base font-extrabold">GDE</span>
          <span className="text-slate-400 font-normal ml-1.5">SEO Ops</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        <div className="space-y-0.5">
          {mainNav.map(item => <NavLink key={item.href} {...item} path={path} />)}
        </div>

        <div className="space-y-0.5">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest px-3 mb-1.5">Settings</p>
          {settingsNav.map(item => <NavLink key={item.href} {...item} path={path} />)}
        </div>
      </nav>

      {/* Bottom gradient accent */}
      <div className="h-0.5 gde-gradient opacity-60" />
    </aside>
  )
}
