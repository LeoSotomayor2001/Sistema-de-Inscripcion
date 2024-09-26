import PropTypes from 'prop-types';
import { TextField, Button, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEstudiantes } from '../Hooks/UseEstudiantes';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
  },
};

const formatDateIso = (isoDate) => {
  if (!isoDate) return ''; // Si no hay fecha, retornar un string vacío
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0'); // Obtener el día en UTC
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes en UTC (0-indexado)
  const year = date.getUTCFullYear(); // Obtener el año en UTC
  return `${year}-${month}-${day}`; // Cambiar el formato a 'YYYY-MM-DD' para el campo de entrada
};


Modal.setAppElement('#root');

export const ModalEditarEstudiante = ({ modalIsOpen, closeModal, estudiante }) => {
  const initialState = {
    name: estudiante.name || '',
    apellido: estudiante.apellido || '',
    cedula: estudiante.cedula || '',
    fecha_nacimiento: formatDateIso(estudiante.fecha_nacimiento) || '',
    image: null, // Agregado para manejar la imagen
  }
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState(initialState);
  const {mostrarEstudiantes,formatDate}= useEstudiantes();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0], // Guarda el archivo en el estado
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un FormData
    const data = new FormData();
    data.append('name', formData.name);
    data.append('apellido', formData.apellido);
    data.append('cedula', formData.cedula);
    data.append('fecha_nacimiento', formatDate(formData.fecha_nacimiento));
    data.append('_method', 'PUT');
    if (formData.image) {
      data.append('image', formData.image); // Añade el archivo si existe
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/estudiantes/${estudiante.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      toast.success(response.data.mensaje);
      closeModal();
      mostrarEstudiantes();
    }
    catch (error) {
      console.log(error)
      if (error.response) {
        setErrors(error.response.data.errors);
        setTimeout(() => {
          setErrors({});
        }, 3000);
      }
      else {
        toast.error('Ocurrio un error en el servidor');
      }

    }
  };

  useEffect(() => {
    document.title = 'Editar Estudiante';
  }, []);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Editar Estudiante"
    >
      <h2 className="text-center text-3xl font-bold mb-4">Editar Estudiante</h2>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        noValidate
      >
        <TextField
          label="Nombre"
          name="name"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        {errors.name && <p className="text-red-500">{errors.name[0]}</p>}

        <TextField
          label="Apellido"
          name="apellido"
          variant="outlined"
          value={formData.apellido}
          onChange={handleChange}
          fullWidth
          required
        />
        {errors.apellido && <p className="text-red-500">{errors.apellido[0]}</p>}

        <TextField
          label="Cédula"
          name="cedula"
          variant="outlined"
          value={formData.cedula}
          onChange={handleChange}
          fullWidth
          required
        />
        {errors.cedula && <p className="text-red-500">{errors.cedula[0]}</p>}

        <TextField
          label="Fecha de Nacimiento"
          name="fecha_nacimiento"
          type="date" // Cambia el tipo a "date"
          variant="outlined"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true, // Esto asegura que la etiqueta no se superponga al valor del campo
          }}
        />
        {errors.fecha_nacimiento && <p className="text-red-500">{errors.fecha_nacimiento[0]}</p>}

        {/* Input de tipo archivo para subir imagen */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {errors.image && <p className="text-red-500">{errors.image[0]}</p>}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
        >
          Guardar
        </Button>
      </Box>

      <Button
        onClick={closeModal}
        color="secondary"
        sx={{ mt: 2 }}
        fullWidth
      >
        Cerrar
      </Button>
    </Modal>
  );
};

ModalEditarEstudiante.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  estudiante: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    cedula: PropTypes.number.isRequired,
    fecha_nacimiento: PropTypes.string.isRequired,
  }).isRequired,
};
