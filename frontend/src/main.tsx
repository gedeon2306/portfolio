import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// 1. Création du client avec la configuration anti-429
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // Garde les données en cache pendant 10 minutes
      refetchOnWindowFocus: false, // Empêche de refaire une requête quand l'utilisateur change d'onglet
    },
  },
})

// 2. Encapsulation de <App /> dans le Provider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)