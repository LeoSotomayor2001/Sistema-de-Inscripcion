import PropTypes from 'prop-types';
import { TextField, Button, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

Modal.setAppElement('#root');

export const ModalEditarRepre = ({ modalIsOpen, closeModal, representante }) => {
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: representante.name || '',
    apellido: representante.apellido || '',
    cedula: representante.cedula || '',
    email: representante.email || '',
    telefono: representante.telefono || '',
    ciudad: representante.ciudad || '',
    direccion: representante.direccion || '',
    image: null,
  });
  const [hasChanges, setHasChanges] = useState(false); // Estado para detectar cambios
  const {getRepresentante}=useEstudiantes()
  // Función para detectar si hay cambios en el formulario
  useEffect(() => {
    const hasFormChanged =
      formData.name !== representante.name ||
      formData.apellido !== representante.apellido ||
      formData.cedula !== representante.cedula ||
      formData.email !== representante.email ||
      formData.telefono !== representante.telefono ||
      formData.ciudad !== representante.ciudad ||
      formData.direccion !== representante.direccion ||
      formData.image !== null;

    setHasChanges(hasFormChanged);
  }, [formData, representante]);

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
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('apellido', formData.apellido);
    data.append('cedula', formData.cedula);
    data.append('email', formData.email);
    data.append('telefono', formData.telefono);
    data.append('ciudad', formData.ciudad);
    data.append('direccion', formData.direccion);
    data.append('_method', 'PUT');
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/representantes/${representante.id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getRepresentante();
      closeModal();
      toast.success(response.data.mensaje);
      navigate('/profile');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);

      if (error.response) {
        setErrors(error.response.data.errors);
      }

      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
  };

  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Editar Perfil">
      <h2 className="text-center text-3xl font-bold mb-4">Editar Perfil</h2>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} noValidate>
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
          label="Correo Electrónico"
          name="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
        <TextField
          label="Teléfono"
          name="telefono"
          variant="outlined"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
        />
        {errors.telefono && <p className="text-red-500">{errors.telefono[0]}</p>}
        <TextField
          label="Ciudad"
          name="ciudad"
          variant="outlined"
          value={formData.ciudad}
          onChange={handleChange}
          fullWidth
        />
        {errors.ciudad && <p className="text-red-500">{errors.ciudad[0]}</p>}
        <TextField
          label="Dirección"
          name="direccion"
          variant="outlined"
          value={formData.direccion}
          onChange={handleChange}
          fullWidth
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {errors.image && <p className="text-red-500">{errors.image[0]}</p>}
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={!hasChanges}>
          Guardar
        </Button>
      </Box>

      <Button onClick={closeModal} color="secondary" sx={{ mt: 2 }} fullWidth>
        Cerrar
      </Button>
    </Modal>
  );
};

ModalEditarRepre.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  representante: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    cedula: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    telefono: PropTypes.string,
    ciudad: PropTypes.string,
    direccion: PropTypes.string,
  }).isRequired,
};
