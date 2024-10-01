import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { AdminSidebar } from "../components/AdminSidebar";

export const AdminLayout = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !usuario) {
      navigate("/auth");
    }

    if (usuario && usuario.admin === 1) {
      navigate("/index");
    }
    if(token && !usuario){
      navigate("/");
    }
  }, []);

  return (
    <div className="md:flex bg-gray-100 overflow-hidden">
      <AdminSidebar/>
      <main className="flex-1 bg-gray-100 h-screen overflow-y-scroll p-3">
        <Outlet />
        <ToastContainer />
      </main>
    </div>
  );
};