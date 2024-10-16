// EstudiantesContext.js
import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from "prop-types"
// Crear el contexto

const formatDate = (isoDate) => {
  if (!isoDate) return ''; // Si no hay fecha, retornar un string vacío
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0'); // Obtener el día en UTC
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes en UTC (0-indexado)
  const year = date.getUTCFullYear(); // Obtener el año en UTC
  return `${day}-${month}-${year}`;
};
const EstudiantesContext = createContext();

// Proveedor del contexto que envuelve la aplicación
const EstudiantesProvider = ({ children }) => {
  const [listadoEstudiantes, setListadoEstudiantes] = useState([]);
  const [years, setYears] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loadingSidebar, setloadingSidebar] = useState(true);
  const [representanteObtenido, setRepresentanteObtenido] = useState({});
  const [loading, setLoading] = useState(false);
  const [anosEscolares, setAnosEscolares] = useState([]);

  // Función para limpiar los datos del estado y del localStorage
  const limpiarTodo = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('representante');
    setRepresentanteObtenido({});
    setListadoEstudiantes([]);
    setYears([]);
    setEstudiantes([]);
  };


  const getAnosEscolares = () => {
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_URL}/anos-escolares`;

    try {
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          setAnosEscolares(response.data);
        })
    }
    catch (error) {
      console.log(error);
    }
  }

  // Función para obtener el representante
  const getRepresentante = async () => {
    setLoading(true);
    try {
      const currentToken = localStorage.getItem('token');
      const currentRepresentante = JSON.parse(localStorage.getItem("representante"));
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/representantes/${currentRepresentante.id}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      setRepresentanteObtenido(response.data.data); // Actualiza el representante obtenido
    } catch (error) {
      console.log('Error al obtener el representante:', error);
    } finally {
      setLoading(false);
      setloadingSidebar(false);
    }
  };

  // Función para obtener años y estudiantes, utilizando el id de representanteObtenido
  const fetchYearsAndEstudiantes = async () => {
    setLoading(true);
    const currentToken = localStorage.getItem('token');

    // Obtener el representante actualizado desde localStorage
    const currentRepresentante = JSON.parse(localStorage.getItem("representante"));

    // Usa el ID de representanteObtenido si está actualizado, de lo contrario usa currentRepresentante
    const representanteId = representanteObtenido.id || currentRepresentante?.id;

    if (!representanteId) {
      toast.error('No se encontró un representante válido.');
      setLoading(false);
      return;
    }

    try {
      const [yearsResponse, estudiantesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/years`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/representantes/${representanteId}/estudiantes`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }),
      ]);

      setYears(yearsResponse.data);
      setEstudiantes(estudiantesResponse.data.estudiantes);
    } catch (error) {
      console.error('Error al obtener años y estudiantes:', error);
      toast.error('Error al obtener años y estudiantes. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EstudiantesContext.Provider
      value={{
        listadoEstudiantes,
        loading,
        loadingSidebar,
        years,
        estudiantes,
        fetchYearsAndEstudiantes,
        formatDate,
        getRepresentante,
        representanteObtenido,
        limpiarTodo,
        getAnosEscolares,
        anosEscolares,

      }}
    >
      {children}
    </EstudiantesContext.Provider>
  );
};

EstudiantesProvider.propTypes = {
  children: PropTypes.node.isRequired,

};

export { EstudiantesProvider };
export default EstudiantesContext;;