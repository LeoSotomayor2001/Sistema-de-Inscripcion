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
  const [secciones, setSecciones] = useState([]);
  const [listadoProfesores, setListadoProfesores] = useState([]);
  const [anosEscolares, setAnosEscolares] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Obtener el token desde localStorage


  // Función para limpiar los datos del estado y del localStorage
  const limpiarTodo = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('representante');
    setRepresentanteObtenido({});
    setListadoEstudiantes([]);
    setYears([]);
    setEstudiantes([]);
  };

  // Función para obtener los estudiantes
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

  const getAnosEscolares=()=>{
    const token=localStorage.getItem('token');
    const url=`${import.meta.env.VITE_API_URL}/anos-escolares`;

    try{
      axios.get(url,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      .then((response)=>{
        setAnosEscolares(response.data);
      })
    }
    catch(error){
      console.log(error);
    }
  }

  const getProfesores = async () => {
    setLoading(true);
    const url="http://127.0.0.1:8000/api/users";
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setListadoProfesores(response.data.data);
    }
    catch(error){
        console.log(error);
    }
    finally{
        setLoading(false);
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
  const getSecciones = async () => {
    setLoading(true)
    try {
        
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/secciones`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setSecciones(response.data);
    } catch (error) {
        console.error(error);
        toast.error("Error al obtener las secciones");
    }
    finally {
        setLoading(false)
    }
}

  return (
    <EstudiantesContext.Provider
      value={{
        listadoEstudiantes,
        mostrarEstudiantes,
        loading,
        loadingSidebar,
        years,
        estudiantes,
        fetchYearsAndEstudiantes,
        formatDate,
        getRepresentante,
        representanteObtenido,
        pagination,
        limpiarTodo,
        getSecciones,
        listadoProfesores,
        getProfesores,
        secciones,
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