import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

export const ProfesorLayout = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  const representante = JSON.parse(localStorage.getItem("representante"));
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el representante o token no existen
    if (!token || !usuario) {
      navigate("/auth");
    }
    if(usuario.admin=== 1){
      navigate("/index")
    }
    if(representante){
        navigate("/")
    }
    
  }, [ usuario,token, navigate, representante ]);

  return (
    <div className="md:flex bg-gray-100 overflow-hidden">
      <aside>aqui va un sidebar</aside>
      <main className="flex-1 bg-gray-100 h-screen overflow-y-scroll p-3">
        <Outlet />
        <ToastContainer />
      </main>
    </div>
  );
};