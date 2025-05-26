import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from '../contexts/UserContext'

if (typeof window !== 'undefined') fetch('/api/socket')

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}