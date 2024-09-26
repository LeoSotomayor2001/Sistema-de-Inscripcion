import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { EstudiantesProvider } from './Context/EstudiantesProvider'

createRoot(document.getElementById('root')).render(
  <EstudiantesProvider>

    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>

  </EstudiantesProvider>
)
