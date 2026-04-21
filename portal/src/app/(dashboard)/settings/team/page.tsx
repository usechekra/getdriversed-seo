'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, UserX, UserCheck, KeyRound, Loader2, Shield, Users } from 'lucide-react'

type User = {
  id: string; name: string; email: string; role: string
  active: boolean; lastLogin: string | null; createdAt: string
}

const ROLE_COLOR: Record<string, string> = {
  ADMIN:       'text-red-400 border-red-400/30 bg-red-400/10',
  MANAGER:     'text-[#385FF6] border-[#385FF6]/30 bg-[#385FF6]/10',
  CONTRIBUTOR: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  VIEWER:      'text-slate-400 border-slate-400/30 bg-slate-400/10',
}

function AddUserForm({ onCreated }: { onCreated: (u: User) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'CONTRIBUTOR', password: '' })
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (form.password.length < 8) { setErr('Password must be at least 8 characters'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.status === 409) { setErr('Email already in use'); return }
      if (!res.ok) throw new Error()
      const user = await res.json()
      onCreated(user)
      setOpen(false)
      setForm({ name: '', email: '', role: 'CONTRIBUTOR', password: '' })
      toast.success(`${user.name} added to the team`)
    } catch {
      setErr('Could not create user')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <Button size="sm" className="gde-gradient text-white border-0" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1.5" />Add Team Member
      </Button>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Add Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input className="h-8 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input className="h-8 text-sm" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select value={form.role} onValueChange={v => v && setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['ADMIN','MANAGER','CONTRIBUTOR','VIEWER'].map(r => (
                    <SelectItem key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Password</Label>
              <Input className="h-8 text-sm" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
          <div className="flex gap-2">
            <Button size="sm" type="submit" className="gde-gradient text-white border-0" disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Add Member'}
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function UserRow({ user, onUpdate }: { user: User; onUpdate: (u: User) => void }) {
  const [resetting, setResetting] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [showReset, setShowReset] = useState(false)

  async function toggleActive() {
    try {
      const res = await fetch(`/api/team/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !user.active }),
      })
      if (!res.ok) throw new Error()
      onUpdate({ ...user, active: !user.active })
      toast.success(user.active ? 'User deactivated' : 'User reactivated')
    } catch { toast.error('Failed') }
  }

  async function changeRole(role: string) {
    try {
      const res = await fetch(`/api/team/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error()
      onUpdate({ ...user, role })
      toast.success('Role updated')
    } catch { toast.error('Failed') }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw.length < 8) { toast.error('Min 8 chars'); return }
    setResetting(true)
    try {
      const res = await fetch(`/api/team/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPw }),
      })
      if (!res.ok) throw new Error()
      setNewPw(''); setShowReset(false)
      toast.success('Password reset')
    } catch { toast.error('Failed') }
    finally { setResetting(false) }
  }

  return (
    <div className={`px-4 py-3 space-y-2 border-b border-border/50 last:border-0 ${!user.active ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-7 h-7 rounded-full gde-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{user.name}</span>
            <Badge variant="outline" className={`text-[10px] ${ROLE_COLOR[user.role]}`}>{user.role}</Badge>
            {!user.active && <Badge variant="outline" className="text-[10px] text-muted-foreground">Inactive</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select value={user.role} onValueChange={v => v && changeRole(v)}>
            <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['ADMIN','MANAGER','CONTRIBUTOR','VIEWER'].map(r => (
                <SelectItem key={r} value={r} className="text-xs">{r.charAt(0) + r.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowReset(v => !v)} title="Reset password">
            <KeyRound className="h-3.5 w-3.5" />
          </Button>
          <Switch checked={user.active} onCheckedChange={toggleActive} />
        </div>
      </div>

      {showReset && (
        <form onSubmit={resetPassword} className="flex gap-2 pl-10">
          <Input
            type="password"
            placeholder="New password (8+ chars)"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            className="h-7 text-xs flex-1"
          />
          <Button size="sm" type="submit" variant="outline" className="h-7 text-xs" disabled={resetting}>
            {resetting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Set'}
          </Button>
          <Button size="sm" type="button" variant="ghost" className="h-7 text-xs" onClick={() => setShowReset(false)}>
            Cancel
          </Button>
        </form>
      )}

      <p className="text-[11px] text-muted-foreground pl-10">
        Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'Never'}
        {' · '}Joined: {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
      </p>
    </div>
  )
}

export default function TeamPage() {
  const [users, setUsers] = useState<User[] | null>(null)

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(setUsers).catch(() => setUsers([]))
  }, [])

  function update(u: User) {
    setUsers(prev => prev ? prev.map(x => x.id === u.id ? u : x) : prev)
  }

  const active   = (users ?? []).filter(u => u.active)
  const inactive = (users ?? []).filter(u => !u.active)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage access for your SEO team</p>
        </div>
        {users !== null && <AddUserForm onCreated={u => setUsers(prev => [u, ...(prev ?? [])])} />}
      </div>

      {users === null && (
        <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      )}

      {users !== null && (
        <Card className="border-border/60">
          <CardHeader className="pb-0 pt-3 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />Active · {active.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-0 pb-0">
            {active.map(u => <UserRow key={u.id} user={u} onUpdate={update} />)}
            {active.length === 0 && <p className="text-xs text-muted-foreground px-4 py-3">No active users</p>}
          </CardContent>
        </Card>
      )}

      {inactive.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-0 pt-3 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <UserX className="h-3.5 w-3.5" />Inactive · {inactive.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-0 pb-0">
            {inactive.map(u => <UserRow key={u.id} user={u} onUpdate={update} />)}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
