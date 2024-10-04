import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { useEstudiantes } from '../Hooks/UseEstudiantes';
Modal.setAppElement('#root');

const customStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -150%)', // Comienza fuera de la pantalla verticalmente
    width: '80%',
    maxWidth: '600px',
    transition: 'transform 0.5s ease-out', // Animación suave en 'transform'
  },
  contentOpen: {
    transform: 'translate(-50%, -50%)', // Se mueve al centro de la pantalla
  },
};

export const ModalSecciones = ({ modalIsOpen, closeModal, seccion = null }) => {
  const [nombre, setNombre] = useState('');
  const [years, setYears] = useState([]);
  const [capacidad, setCapacidad] = useState('');
  const [yearId, setYearId] = useState('');
  const [errors, setErrors] = useState({});
  const { getSecciones } = useEstudiantes();
  // Manejo de estado para saber si es edición o creación
  const isEdit = Boolean(seccion);

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

  useEffect(() => {
    if (isEdit && seccion) {
      // Cargar datos de la sección a editar

      setNombre(seccion.nombre);
      setCapacidad(seccion.capacidad);
      setYearId(seccion.año);
    } else {
      // Si es creación, limpiar el formulario
      setNombre('');
      setCapacidad('');
      setYearId('');
    }

  }, [seccion]);

  useEffect(() => {
    fetchYears();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = {
      name: nombre,
      capacidad,
      year_id: yearId,
    };
    try {
      if (isEdit) {
        // Editar sección
        await axios.put(`${import.meta.env.VITE_API_URL}/secciones/${seccion.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Sección actualizada con éxito');

      } else {
        // Crear nueva sección
        await axios.post(`${import.meta.env.VITE_API_URL}/secciones`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Sección creada con éxito');
      }
      getSecciones();
      closeModal();
    } catch (error) {
      console.error(error);
      if (error.response.data) {
        setErrors(error.response.data || {});

        setTimeout(() => {
          setErrors({});
        }, 2000);
      }
      else {
        toast.error('Error al guardar la sección');
      }
      if(error.response.data.error){
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
       style={{
        content: modalIsOpen ? { ...customStyles.content, ...customStyles.contentOpen } : customStyles.content,
      }}
      contentLabel={isEdit ? 'Editar Sección' : 'Crear Sección'}
    >
      <h2 className="text-center text-2xl font-bold my-2">{isEdit ? 'Editar Sección' : 'Crear Sección'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Nombre de la Sección"
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}

          />
          {errors?.name && <p className="text-red-500">{errors.name}</p>}
        </Box>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Capacidad"
            variant="outlined"
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}

          />
        </Box>
        {errors?.capacidad && <p className="text-red-500">{errors.capacidad}</p>}
        <Box mb={3}>
          <TextField
            fullWidth
            select
            label="Año Académico"
            value={yearId}
            onChange={(e) => setYearId(e.target.value)}
            variant="outlined"

          >
            <MenuItem value="">
              <em>Seleccione un año académico</em>
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.year} - {year.descripcion}
              </MenuItem>
            ))}
          </TextField>
          {errors?.year_id && <p className="text-red-500">{errors.year_id}</p>}
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={closeModal} variant="outlined" sx={{ mr: 2 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

ModalSecciones.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  seccion: PropTypes.object,
};
