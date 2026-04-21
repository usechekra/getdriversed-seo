'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
      return
    }

    const callbackUrl = params.get('callbackUrl') ?? '/'
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <Card className="border-[#1e2332] bg-[#0f1117]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg">Sign in</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your credentials to access the portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-300 text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@getdriversed.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1a1f2e] border-[#2a3050] text-white placeholder:text-slate-600 focus-visible:ring-[#385FF6]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1a1f2e] border-[#2a3050] text-white placeholder:text-slate-600 focus-visible:ring-[#385FF6]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full gde-gradient text-white font-medium border-0 hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #385FF6 0%, transparent 70%)' }}
        />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg gde-gradient flex items-center justify-center">
              <span className="text-white font-black text-xs">GDE</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SEO Operations</span>
          </div>
          <p className="text-slate-500 text-sm">getdriversed.com internal portal</p>
        </div>

        <Suspense fallback={<div className="h-64 rounded-lg bg-[#0f1117] border border-[#1e2332] animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-slate-600 mt-6">
          Get Drivers Ed · SEO Operations · Confidential
        </p>
      </div>
    </div>
  )
}
