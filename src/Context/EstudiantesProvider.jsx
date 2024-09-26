// EstudiantesContext.js
import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from "prop-types"
// Crear el contexto
const EstudiantesContext = createContext();

// Proveedor del contexto que envuelve la aplicación
 const EstudiantesProvider = ({ children }) => {
  const [listadoEstudiantes, setListadoEstudiantes] = useState([]);
  const [years, setYears] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const representante=JSON.parse(localStorage.getItem("representante"));
  const token = localStorage.getItem('token');

  const formatDate = (isoDate) => {
    if (!isoDate) return ''; // Si no hay fecha, retornar un string vacío
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Obtener el día en UTC
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes en UTC (0-indexado)
    const year = date.getUTCFullYear(); // Obtener el año en UTC
    return `${day}-${month}-${year}`;
  };

  // Función para obtener los estudiantes
  const mostrarEstudiantes = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/estudiantes`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListadoEstudiantes(response.data.data);
    } catch (error) {
      console.error('Error al cargar los estudiantes:', error);
      toast.error('Error al cargar los estudiantes. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchYearsAndEstudiantes = async () => {
    setLoading(true);
    try {
      const [yearsResponse, estudiantesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/years`),
        axios.get(`${import.meta.env.VITE_API_URL}/representantes/${representante.id}/estudiantes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      setYears(yearsResponse.data);
      setEstudiantes(estudiantesResponse.data.estudiantes);
    } catch (error) {
      console.error('Error al obtener años y estudiantes:', error);
      toast.error('Error al obtener años y estudiantes. Intenta nuevamente.');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <EstudiantesContext.Provider value={{ listadoEstudiantes, mostrarEstudiantes, loading, years, estudiantes, fetchYearsAndEstudiantes,representante,formatDate }}>
      {children}
    </EstudiantesContext.Provider>
  );
};

// Custom hook para acceder al contexto de Estudiantes
EstudiantesProvider.propTypes = {
    children: PropTypes.object,
  };

export {EstudiantesProvider}
export default EstudiantesContext