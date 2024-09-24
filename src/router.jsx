import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./Layouts/AuthLayout";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { RepresentanteLayout } from "./Layouts/RepresentanteLayout";
import { Index } from "./pages/Representantes/Index";
import { Formulario } from "./pages/Estudiantes/Formulario";
import { Profile } from "./pages/Representantes/Profile";


const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />
      },
      {
        path: "/auth/registro",
        element: <RegisterPage />
      }
    ]

  },
  {
    path: "/",
    element: <RepresentanteLayout/>,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "/profile",
        element: <Profile/>
      },
      {
        path: "/registrar-estudiante",
        element: <Formulario />
      },
      {
        path: "/ver-estudiantes",
        element: <h1>Ver Estudiantes</h1>
      }

    ]
  },
  {
    path: "*",
    element: <h1>404</h1>
  }
])

export { router }