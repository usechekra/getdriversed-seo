export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only import the Node.js implementation in the Node.js runtime
    // This prevents Edge Runtime from tracing fs/path/Prisma imports
    await import('./instrumentation.node')
  }
}
