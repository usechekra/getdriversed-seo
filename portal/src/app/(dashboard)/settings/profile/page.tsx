'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, User, KeyRound, Pencil, Camera } from 'lucide-react'

const ROLE_COLOR: Record<string, string> = {
  ADMIN:       'text-red-400 border-red-400/30 bg-red-400/10',
  MANAGER:     'text-[#385FF6] border-[#385FF6]/30 bg-[#385FF6]/10',
  CONTRIBUTOR: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  VIEWER:      'text-slate-400 border-slate-400/30 bg-slate-400/10',
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [saving, setSaving] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwErr, setPwErr] = useState('')
  const [name, setName] = useState(session?.user?.name ?? '')
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function changeName(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSavingName(true)
    try {
      const res = await fetch('/api/profile/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      await update({ name })
      toast.success('Name updated')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSavingName(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function uploadAvatar() {
    if (!avatar) return
    setSavingAvatar(true)
    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: avatar }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      toast.success('Avatar updated')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSavingAvatar(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwErr('')
    if (pw.next.length < 8) { setPwErr('New password must be at least 8 characters'); return }
    if (pw.next !== pw.confirm) { setPwErr('Passwords do not match'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed')
      setPw({ current: '', next: '', confirm: '' })
      toast.success('Password updated')
    } catch (e: unknown) {
      setPwErr(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const displayAvatar = avatar ?? undefined
  const initials = (session?.user?.name ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Your account details</p>
      </div>

      {/* Avatar */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Camera className="h-4 w-4" />Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative">
            {displayAvatar ? (
              <img src={displayAvatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#385FF6] flex items-center justify-center text-white text-lg font-bold">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-xs text-muted-foreground">JPG or PNG, max 2MB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => fileRef.current?.click()}>
              Choose image
            </Button>
            {avatar && (
              <Button size="sm" className="text-xs h-7 ml-2" onClick={uploadAvatar} disabled={savingAvatar}>
                {savingAvatar ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Name */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />Account Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`text-[10px] ${ROLE_COLOR[session?.user?.role ?? ''] ?? ''}`}>
              {session?.user?.role}
            </Badge>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
          <form onSubmit={changeName} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Display Name</Label>
              <Input
                className="h-8 text-sm"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <Button type="submit" size="sm" variant="outline" className="mt-5 h-8" disabled={savingName}>
              {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <KeyRound className="h-4 w-4" />Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Current Password</Label>
              <Input type="password" className="h-8 text-sm" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">New Password</Label>
              <Input type="password" className="h-8 text-sm" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Confirm New Password</Label>
              <Input type="password" className="h-8 text-sm" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            {pwErr && <p className="text-xs text-red-400">{pwErr}</p>}
            <Button type="submit" size="sm" variant="outline" className="w-full" disabled={saving}>
              {saving ? <><Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />Updating…</> : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
