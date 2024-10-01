import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useEstudiantes } from '../../Hooks/UseEstudiantes';
import { useNavigate } from 'react-router-dom';

const PreinscripcionForm = () => {
  const [secciones, setSecciones] = useState([]);
  const navigate=useNavigate();
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeccion, setSelectedSeccion] = useState('');
  const {fetchYearsAndEstudiantes,years,estudiantes}=useEstudiantes();


  // Obtener años y estudiantes en el montaje inicial
  useEffect(() => {
    fetchYearsAndEstudiantes();
  }, []);

  // Obtener las secciones según el año seleccionado
  useEffect(() => {
    if (selectedYear) {
      setSelectedSeccion(''); // Restablece la sección seleccionada al cambiar de año
      const fetchSecciones = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/secciones?year_id=${selectedYear}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSecciones(response.data);
        } catch (error) {
          console.error('Error al obtener secciones:', error);
          toast.error('Debe seleccionar todos los campos');
        }
      };

      fetchSecciones();
    } else {
      setSecciones([]); // Limpiar las secciones cuando no se haya seleccionado un año
      setSelectedSeccion(''); // Asegurar que la sección esté vacía
    }
  }, [selectedYear]);

  const handlePreinscripcion = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/inscripciones`,
        {
          estudiante_id: selectedEstudiante,
          year_id: selectedYear,
          seccion_id: selectedSeccion,
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
      console.error('Error al preinscribir estudiante:', error);
      toast.error(error.response.data.mensaje);
    }
    finally {
      setSelectedEstudiante('');
      setSelectedYear('');
      setSelectedSeccion('');
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
              {seccion.name} (Cupos: {seccion.capacidad})
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
        disabled={!selectedEstudiante || !selectedYear || !selectedSeccion}
      >
        Preinscribir Estudiante
      </Button>
    </Box>
  );
};


export default PreinscripcionForm;
