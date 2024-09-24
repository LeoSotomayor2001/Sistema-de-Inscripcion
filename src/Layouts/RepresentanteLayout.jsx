import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

export const RepresentanteLayout = () => {
  const representante = JSON.parse(localStorage.getItem("representante"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el representante o token no existen
    if (!representante || !token) {
      navigate("/auth");
    }
  }, [representante, token, navigate]);

  return (
    <div className="md:flex bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gray-100 h-screen overflow-y-scroll p-3">
        <Outlet />
        <ToastContainer />
      </main>
    </div>
  );
};
