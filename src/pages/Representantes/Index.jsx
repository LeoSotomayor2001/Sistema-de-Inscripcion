import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../../components/Spinner";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../../components/Spinner.css';
import { Link } from "react-router-dom";
import { ModalEditarEstudiante } from "../../components/ModalEditarEstudiante";
import Swal from 'sweetalert2';


const formatDate = (isoDate) => {
    if (!isoDate) return ''; // Si no hay fecha, retornar un string vacío
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Obtener el día en UTC
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes en UTC (0-indexado)
    const year = date.getUTCFullYear(); // Obtener el año en UTC
    return `${day}-${month}-${year}`;
  };
  

export const Index = () => {
  const token = localStorage.getItem("token");
  const representante = JSON.parse(localStorage.getItem("representante"));
  const [listadoEstudiantes, setListadoEstudiantes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null); // Estado para el estudiante seleccionado
  const imageURL=`${import.meta.env.VITE_API_URL}/imagen/`;

  const mostrarEstudiantes = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/estudiantes`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListadoEstudiantes(response.data.data);
    } catch (error) {
      console.error("Error al cargar los estudiantes:", error);
      toast.error("Error al cargar los estudiantes. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarEstudiante = async (id) => {
    // Mostrar confirmación con SweetAlert
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    // Si el usuario confirma
    if (resultado.isConfirmed) {
      try {
        const url = `${import.meta.env.VITE_API_URL}/estudiantes/${id}`;
        const response = await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Mostrar mensaje de éxito con Toastify
        toast.success(response.data.mensaje);
        mostrarEstudiantes(); // Actualiza la lista de estudiantes
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
        toast.error("Error al eliminar el estudiante. Intenta nuevamente.");
      }
    }
  };
  const openModal = (estudiante) => {
    setEstudianteSeleccionado(estudiante); // Establecer el estudiante seleccionado
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEstudianteSeleccionado(null); // Limpiar el estudiante seleccionado al cerrar el modal
  };

  useEffect(() => {
    mostrarEstudiantes();
    document.title = "Sistema de Inscripción - Estudiantes";
  }, [document.title]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [loading]);

  if (loading) {
    return <Spinner />;
  }

  const estudiantesFiltrados = listadoEstudiantes.filter(
    (estudiante) =>
      estudiante.representante && estudiante.representante.id === representante.id
  );

  return (
    <>
      <header className="my-5">
        <ul className="flex flex-col md:flex-row justify-center gap-4 items-center p-4">
          <li>
            <Link
              to={"/registrar-estudiante"}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Registrar estudiante
            </Link>
          </li>
          <li>
            <Link
              to={"/ver-estudiantes"}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Ver estudiantes inscritos
            </Link>
          </li>
        </ul>
      </header>

      <div>
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
          Tus representados:
        </h2>

        {estudiantesFiltrados.length > 0 ? (
          <div
            className={`transition-opacity duration-1000 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"} grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3`}
          >
            {estudiantesFiltrados.map((estudiante) => (
              <Card sx={{ maxWidth: 345 }} key={estudiante.id} className="mx-4">
                <CardMedia
                  sx={{ height: 290 }}
                  image={`${estudiante.image ? imageURL + estudiante.image : 'img/usuario.svg' } `}
                  title="Foto Estudiante"
                  
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {estudiante.name} {estudiante.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="flex flex-col">
                    <p className="text-gray-500">Cédula:</p>
                    {estudiante.cedula}
                  </Typography>

                  <Typography variant="body2" color="text.primary" className="flex flex-col">
                    <p className="text-gray-500">Fecha de nacimiento:</p>
                    { formatDate(estudiante.fecha_nacimiento)}
                  </Typography>
                </CardContent>
                <CardActions className="flex justify-between">
                  <Button size="small" onClick={() => openModal(estudiante)}>
                    Editar
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => eliminarEstudiante(estudiante.id)}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tienes estudiantes representados.</p>
        )}

        {estudianteSeleccionado && (
          <ModalEditarEstudiante
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            estudiante={estudianteSeleccionado} // Pasar el estudiante seleccionado al modal
            mostrarEstudiantes={mostrarEstudiantes}
          />
        )}
      </div>
    </>
  );
};
