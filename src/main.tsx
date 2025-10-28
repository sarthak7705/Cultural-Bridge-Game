import { ClerkProvider } from '@clerk/clerk-react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(

  // <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <>
    <Toaster />
    <App />
  </>

  // </ClerkProvider>

)
