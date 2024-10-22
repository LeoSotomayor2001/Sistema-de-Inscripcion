import { createContext, useState } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr'; // Importar mutate

// Crear el contexto
const AdminContext = createContext();


// Proveedor del contexto que envuelve la aplicación
const AdminProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [asignaturas, setAsignaturas] = useState(null);
    const [asignaturasConProfesores, setAsignaturasConProfesores] = useState(null);
    const [secciones, setSecciones] = useState([]);
    const [listadoProfesores, setListadoProfesores] = useState([]);
    const [inscripciones, setInscripciones] = useState([]);
    const [listadoEstudiantes, setListadoEstudiantes] = useState([]);
    const [years, setYears] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    
    // Fetcher para SWR
    const fetcher = async(url) => {
        const token = localStorage.getItem('token');
        return await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.data);
    };
    const { data: notificaciones, error: notificacionesError, isValidating: isLoadingNotificaciones } = useSWR(
        `${import.meta.env.VITE_API_URL}/notificaciones/unread`,
        fetcher,
        { refreshInterval: 60000 } // Actualizar cada 60 segundos
    );

    const getProfesoresConAsignaturas = async (page = 1) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor?page=${page}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAsignaturasConProfesores(response.data.asignaturas);
            setPagination({
                current_page: response.data.pagination.current_page,
                last_page: response.data.pagination.last_page,
                per_page: response.data.pagination.per_page,
                total: response.data.pagination.total,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchYears = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/years`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setYears(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al obtener los años');
        }
    };

    const getAllProfesores=async()=>{
        const token = localStorage.getItem('token');
        try {
            const url = `${import.meta.env.VITE_API_URL}/users-all`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setListadoProfesores(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const getProfesores = async () => {
        setLoading(true);
        const url = "http://127.0.0.1:8000/api/users";
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setListadoProfesores(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener los profesores");
        } finally {
            setLoading(false);
        }
    };
    const fetchAllStudents=async()=>{
        const token = localStorage.getItem('token');
        try {
            const url = `${import.meta.env.VITE_API_URL}/estudiantes-all`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setListadoEstudiantes(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAllAsignaturas = async () => {
        const token = localStorage.getItem('token');
        try {
            const url = `${import.meta.env.VITE_API_URL}/asignaturas-all`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAsignaturas(response.data);
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAsignaturas = async (page = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/asignaturas?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAsignaturas(response.data.asignaturas);
            setPagination({
                current_page: response.data.pagination.current_page,
                last_page: response.data.pagination.last_page,
                per_page: response.data.pagination.per_page,
                total: response.data.pagination.total,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const obtenerEstudiantes = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/inscripciones?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setInscripciones(response.data.inscripciones);
            setPagination({
                current_page: response.data.pagination.current_page,
                last_page: response.data.pagination.last_page,
                per_page: response.data.pagination.per_page,
                total: response.data.pagination.total,
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener los estudiantes preinscritos");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllInscripciones = async () => {
        const token = localStorage.getItem("token");
        try {
            const url = `${import.meta.env.VITE_API_URL}/inscripciones-all`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInscripciones(response.data.inscripciones);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener las inscripciones");
        }
    };

    const getAllSecciones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_API_URL}/secciones-all`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSecciones(response.data.secciones);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener las secciones");
        }
        finally {
            setLoading(false);
        }
    };

    const getSecciones = async (page = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_API_URL}/secciones?page=${page}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSecciones(response.data.secciones);
            setPagination({
                current_page: response.data.pagination.current_page,
                last_page: response.data.pagination.last_page,
                per_page: response.data.pagination.per_page,
                total: response.data.pagination.total,
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener las secciones");
        } finally {
            setLoading(false);
        }
    };

    const mostrarEstudiantes = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/estudiantes?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Actualiza los estudiantes
            setListadoEstudiantes(response.data.data);
            // Actualiza la paginación
            setPagination({
                current_page: response.data.meta.current_page,
                last_page: response.data.meta.last_page,
                per_page: response.data.meta.per_page,
                total: response.data.meta.total,
            });
        } catch (error) {
            console.error("Error al obtener los estudiantes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminContext.Provider
            value={{
                loading,
                asignaturas,
                fetchAsignaturas,
                listadoProfesores,
                getProfesores,
                getSecciones,
                secciones,
                years,
                fetchYears,
                listadoEstudiantes,
                mostrarEstudiantes,
                getProfesoresConAsignaturas,
                asignaturasConProfesores,
                pagination,
                inscripciones,
                setAsignaturas,
                obtenerEstudiantes,
                setAsignaturasConProfesores,
                notificaciones: notificaciones,
                isLoadingNotificaciones,
                notificacionesError,
                fetchAllAsignaturas,
                fetchAllStudents,
                getAllProfesores,
                getAllSecciones,
                mutateNotificaciones: () => mutate(`${import.meta.env.VITE_API_URL}/notificaciones/unread`),
                fetchAllInscripciones

            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AdminProvider };
export default AdminContext;
