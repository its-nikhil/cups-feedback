import type { AppProps } from 'next/app'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import '../app/globals.css'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
        <Component {...pageProps} />
      </div>
    </ConvexProvider>
  )
}
