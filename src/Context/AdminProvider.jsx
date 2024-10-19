// EstudiantesContext.js
import { createContext, useState } from 'react';
import PropTypes from "prop-types"
import axios from 'axios';
import { toast } from 'react-toastify';
// Crear el contexto


const AdminContext = createContext();

// Proveedor del contexto que envuelve la aplicación
const AdminProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturasConProfesores, setAsignaturasConProfesores] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [listadoProfesores, setListadoProfesores] = useState([]);
    const [inscripciones, setInscripciones] = useState([]);
    const [listadoEstudiantes, setListadoEstudiantes] = useState([]);
    const [years, setYears] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

 
    const getProfesoresConAsignaturas = async () => {
        setLoading(true)
        const token = localStorage.getItem('token')
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor`
        
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAsignaturasConProfesores(response.data.asignaturas)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }

    }
    const fetchAsignaturas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/asignaturas`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAsignaturas(response.data)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
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
        }
        catch (error) {
            console.error(error);
            toast.error("Error al obtener los profesores");
        }
        finally {
            setLoading(false);
        }
    }
    const obtenerEstudiantes = async (page=1) => {
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
    }
    const getSecciones = async (page = null) => {
        setLoading(true)
        try {

            const token = localStorage.getItem("token");
            const   url = `${import.meta.env.VITE_API_URL}/secciones?page=${page}`
            console.log(page)
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data)
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
        }
        finally {
            setLoading(false)
        }
    }
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
                obtenerEstudiantes
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