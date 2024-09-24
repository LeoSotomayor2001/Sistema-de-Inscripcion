import axios from "axios";
import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Sidebar = () => {
    const representante = JSON.parse(localStorage.getItem("representante"));
    const token = localStorage.getItem("token");
    const location = useLocation()
    const imageUrl = `${import.meta.env.VITE_API_URL}/imagen/${representante.image}`;

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Sistema de Inscripción";
    });

    const cerrarSesion = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout-representante`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response);
            localStorage.removeItem("representante");
            localStorage.removeItem("token");

            toast.success(response.data.mensaje);
            setTimeout(() => {
                navigate("/auth");
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error("Error al cerrar sesión");
        }
    };

    return (
        <aside className="md:w-80 w-full md:shadow-xl shadow-md bg-white" aria-label="Sidebar">
            <div className="px-3 py-4">
                <img 
                    src={representante.image ? `${imageUrl}` : "img/usuario.svg"} 
                    alt="imagen-representante" 
                    className="w-36 h-36 mx-auto rounded-full shadow-lg"
                 />
            </div>
            <h1 className="text-2xl font-bold text-center">
                {representante && representante.name + " " + representante.apellido}
            </h1>
            <div className="h-full px-3 py-4 overflow-y-auto">
                <ul className="space-y-4">
                    <li className="mb-2">
                        <NavLink
                            to="/"
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
                            <span className="ml-4 text-xl">Inicio</span>
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center p-3 text-base font-medium text-white bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out"
                                    : "flex items-center p-3 text-base font-medium text-gray-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 ease-in-out"
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <span className="ml-4 text-xl">Perfil</span>
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
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
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                </svg>
                                <span className="ml-4 text-xl">Estudiantes</span>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    <ListItem disablePadding className={location.pathname === "/registrar-estudiante"
                                        ? "bg-indigo-600 text-white font-medium rounded-lg transition-all duration-300 mb-2"
                                        : "text-gray-700 hover:bg-indigo-600 hover:text-white font-medium rounded-lg transition-all duration-300 mb-2"}
                                    >
                                        <ListItemButton
                                            component={NavLink}
                                            to="/registrar-estudiante"
                                        >
                                            <ListItemText primary="Crear Estudiante" />
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding className={location.pathname === "/ver-estudiantes"
                                        ? "bg-indigo-600 text-white font-medium rounded-lg transition-all duration-300"
                                        : "text-gray-700 hover:bg-indigo-600 hover:text-white font-medium rounded-lg transition-all duration-300"}
                                    >
                                        <ListItemButton
                                            component={NavLink}
                                            to="/ver-estudiantes"
                                        >
                                            <ListItemText primary="Ver Estudiantes Inscritos" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </li>
                    <li className="mb-2">
                        <button
                            type="button"
                            className="text-xl bg-red-600 text-white font-bold py-2 px-4 rounded my-5 w-full hover:bg-red-700 transition-all duration-300 ease-in-out"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};
