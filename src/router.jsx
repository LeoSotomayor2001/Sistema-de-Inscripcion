import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./Layouts/AuthLayout";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { RepresentanteLayout } from "./Layouts/RepresentanteLayout";
import { Index } from "./pages/Representantes/Index";
import { Formulario } from "./pages/Estudiantes/Formulario";
import { Profile } from "./pages/Representantes/Profile";
import { PreinscribirEstudiante } from "./pages/Representantes/PreinscribirEstudiante";
import EstudiantesPreinscritos from "./pages/Estudiantes/EstudiantesPreinscritos";
import { NotFound } from "./pages/NotFound";
import { AdminLayout } from "./Layouts/AdminLayout";
import { Estudiantes } from "./pages/Admin/Estudiantes";
import { Secciones } from "./pages/Admin/Secciones";
import { Profesores } from "./pages/Admin/Profesores";


const router = createBrowserRouter([
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
        path: "/Preinscribir-estudiante",
        element: <PreinscribirEstudiante />
      },
      {
        path:'/estudiantes-preinscritos',
        element: <EstudiantesPreinscritos/>
      }

    ]
  },
  {
    path: "/index",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <h1>Index</h1>
      },
      {
        path: "estudiantes",
        element: <Estudiantes />
      },
      {
        path: "inscripciones",
        element: <h1>Inscripciones</h1>
      },
      {
        path: "profesores",
        element: <Profesores />
      },
      {
        path: "secciones",
        element: <Secciones />
      }
    ]
  },
  
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
    path: "*",
    element: <NotFound />
  }
])

export { router }