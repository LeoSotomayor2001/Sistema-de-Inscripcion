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
import { EstudiantesPreinscritosPage } from "./pages/Admin/EstudiantesPreinscritosPage";
import { Asignaturas } from "./pages/Admin/Asignaturas";
import { FormAsignaturas } from "./pages/Admin/FormAsignaturas";
import { AsignarProfesor } from "./pages/Admin/AsignarProfesor";
import { IndexAdmin } from "./pages/Admin/IndexAdmin";
import { Notificacion } from "./pages/Admin/Notificacion";


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
        element: <IndexAdmin />
      },
      {
        path: "estudiantes",
        element: <Estudiantes />
      },
      {
        path: "inscripciones",
        element: <EstudiantesPreinscritosPage/>
      },
      {
        path: "profesores",
        element: <Profesores />
      },
      {
        path: "secciones",
        element: <Secciones />
      },
      {
        path:"asignaturas",
        element: <Asignaturas/>
      },
      {
        path:"registrar-asignatura",
        element: <FormAsignaturas/>
      },
      {
        path:'asignatura-profesor', 
        element:<AsignarProfesor/>
      },
      {
        path: "notificaciones",
        element: <Notificacion/>
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