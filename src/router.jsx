import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./Layouts/AuthLayout";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";


const router = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout/>,
        children: [
          {
            index: true,
            element: <LoginPage/>
          },
          {
            path:"/auth/registro",
            element:<RegisterPage/>
          }
        ]
    
      },
      {
        path: "*",
        element: <h1>404</h1>
      }
])

export {router}