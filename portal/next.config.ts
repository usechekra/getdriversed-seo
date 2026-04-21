import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Suppress hydration warnings from Recharts
  reactStrictMode: true,

  // Transpile googleapis for Edge compatibility (not needed, but silences some warnings)
  serverExternalPackages: ['googleapis', 'bcryptjs'],

}

export default nextConfig
