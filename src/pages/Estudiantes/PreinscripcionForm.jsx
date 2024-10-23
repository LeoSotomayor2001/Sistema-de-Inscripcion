import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useEstudiantes } from '../../Hooks/UseEstudiantes';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PreinscripcionForm = () => {
  const [secciones, setSecciones] = useState([]);
  const navigate = useNavigate();
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeccion, setSelectedSeccion] = useState('');
  const [selectedAnoEscolar, setSelectedAnoEscolar] = useState('');
  const { fetchYearsAndEstudiantes, years, estudiantes, getAnosEscolares, anosEscolares } = useEstudiantes();

  // Obtener años y estudiantes en el montaje inicial
  useEffect(() => {
    fetchYearsAndEstudiantes();
    getAnosEscolares();
  }, []);

  // Obtener las secciones según el año seleccionado
  useEffect(() => {
    if (selectedYear) {
      setSelectedSeccion(''); // Restablece la sección seleccionada al cambiar de año
      const fetchSeccionesByYear = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/secciones/buscar?year_id=${selectedYear}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSecciones(response.data.secciones);
        } catch (error) {
          console.error('Error al obtener secciones:', error);
          toast.error('Debe seleccionar todos los campos');
        }
      };

      fetchSeccionesByYear();
    } else {
      setSecciones([]); // Limpiar las secciones cuando no se haya seleccionado un año
      setSelectedSeccion(''); // Asegurar que la sección esté vacía
    }
  }, [selectedYear]);

  const handlePreinscripcion = async () => {
    const respuesta = await Swal.fire({
      title: '¿Deseas preinscribir este estudiante?',
      text: '¡No podras eliminar ni editar este registro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, preinscribir',
      cancelButtonText: 'Cancelar',
    })

    if (respuesta.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/inscripciones`,
          {
            estudiante_id: selectedEstudiante,
            year_id: selectedYear,
            seccion_id: selectedSeccion,
            ano_escolar_id: selectedAnoEscolar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(response.data.mensaje);
        navigate('/estudiantes-preinscritos');

      } catch (error) {
        toast.error(error.response.data.mensaje);
      }
      finally {
        setSelectedEstudiante('');
        setSelectedYear('');
        setSelectedSeccion('');
      }
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', backgroundColor: '#f4f4f4', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Preinscripción de Estudiantes
      </Typography>

      {/* Lista de estudiantes */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="estudiante-label">Estudiantes</InputLabel>
        <Select
          labelId="estudiante-label"
          label="Estudiantes"
          value={selectedEstudiante}
          onChange={(e) => setSelectedEstudiante(e.target.value)}
        >
          {estudiantes.map((estudiante) => (
            <MenuItem key={estudiante.id} value={estudiante.id}>
              {estudiante.name} {estudiante.apellido}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Lista de años */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="year-label">Año Académico</InputLabel>
        <Select
          labelId="year-label"
          label="Año Académico"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <MenuItem key={year.id} value={year.id}>
              {year.year + ' - ' + year.descripcion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Lista de secciones */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="seccion-label">Sección</InputLabel>
        <Select
          labelId="seccion-label"
          label="Sección"
          value={selectedSeccion}
          onChange={(e) => setSelectedSeccion(e.target.value)}
          disabled={!selectedYear} // Deshabilitar si no se selecciona un año
        >
          {secciones.map((seccion) => (
            <MenuItem key={seccion.id} value={seccion.id}>
              {seccion.nombre} -  ({'Cupos disponibles: ' + seccion.capacidad})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="ano-escolar-label">Año Escolar</InputLabel>
        <Select
          labelId="ano-escolar-label"
          label="Año Escolar"
          value={selectedAnoEscolar}
          onChange={(e) => setSelectedAnoEscolar(e.target.value)}
        >
          {anosEscolares?.filter(ano => ano.habilitado).map((ano) => (
            <MenuItem key={ano.id} value={ano.id}>
              {ano.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      {/* Botón de preinscripción */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handlePreinscripcion}
        disabled={!selectedEstudiante || !selectedYear || !selectedSeccion || !selectedAnoEscolar}
      >
        Preinscribir Estudiante
      </Button>
    </Box>
  );
};


export default PreinscripcionForm;
