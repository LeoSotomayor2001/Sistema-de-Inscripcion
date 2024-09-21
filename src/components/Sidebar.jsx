import axios from "axios"
import { useEffect } from "react"
import {  NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const Sidebar = () => {
    const representante = JSON.parse(localStorage.getItem("representante"))
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    useEffect(() => {
        document.title = "Sistema de Inscripción"
    })

    const cerrarSesion = async () => {
        try {

            // Realiza la solicitud a la API con el token en la cabecera
            const response = await axios.post("http://127.0.0.1:8000/api/logout-representante", {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token aquí
                }
            });
    
            // Muestra la respuesta
            console.log(response);
            // Elimina los datos del representante y token del localStorage
            localStorage.removeItem("representante");
            localStorage.removeItem("token");
    
            // Muestra el mensaje de éxito
            toast.success("Sesión cerrada");
    
            // Redirige a la página de autenticación después de 2 segundos
            setTimeout(() => {
                navigate("/auth");
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error("Error al cerrar sesión");
        }
    };
    

    return (
        <aside className=" md:w-72 w-full md:shadow-xl shadow-md bg-white" aria-label="Sidebar">
            <div className="px-3 py-4">
                <img src="img/usuario.svg" alt="imagen-representante" className="w-24 h-24 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-center">{representante && representante.name + " " + representante.apellido}</h1>
            <div className="h-full px-3 py-4 overflow-y-auto">
                <ul className="space-y-4">
                    <li>
                        <NavLink
                            to="#"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center p-3 text-base font-medium text-white bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out"
                                    : "flex items-center p-3 text-base font-medium text-gray-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 ease-in-out"
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12 11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                            <span className="ml-4">Inicio</span>
                        </NavLink>

                        <button 
                            type="button" 
                            className="bg-red-600 text-white font-bold py-2 px-4 rounded my-5 w-full hover:bg-red-700 transition-all duration-300 ease-in-out"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>
        </aside>

    )
}
