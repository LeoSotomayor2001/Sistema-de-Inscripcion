import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Función para convertir de YYYY-MM-DD a DD-MM-YYYY



export const Formulario = () => {

    const representante = JSON.parse(localStorage.getItem('representante'));
    const token = localStorage.getItem('token');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const initialState = {
        name: '',
        apellido: '',
        cedula: '',
        fecha_nacimiento: '',
        image: null,
        representante_id: representante.id
    };
    useEffect(() => {
        document.title = "Registrar Estudiante";
    });

    const [formData, setFormData] = useState(initialState);

    const formatDateToDMY = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
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

        const data = new FormData();
        data.append('name', formData.name);
        data.append('apellido', formData.apellido);
        data.append('cedula', formData.cedula);
        data.append('representante_id', representante.id);
        data.append('fecha_nacimiento', formatDateToDMY(formData.fecha_nacimiento));
        if (formData.image) {
          data.append('image', formData.image); // Añade el archivo si existe
        }

        try {
            const url = "http://127.0.0.1:8000/api/estudiantes";
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            toast.success(response.data.message);
            setFormData(initialState);
            setErrors({});
            navigate('/');

        } catch (error) {
            console.log(error);
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
                
            }
            setTimeout(() => {
                setErrors({});
            }, 2000);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 800 }}
                className='w-full max-w-lg p-8 bg-white shadow-md rounded-lg'
                noValidate
            >
                <h1 className='text-2xl mb-4 text-center uppercase'>Registrar Estudiante</h1>
                <TextField
                    label="Nombres"
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                />
                {errors.name && <p className='text-red-500'>{errors.name[0]}</p>}
                <TextField
                    label="Apellidos"
                    variant="outlined"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    fullWidth
                />
                {errors.apellido && <p className='text-red-500'>{errors.apellido[0]}</p>}
                <TextField
                    label="Cédula"
                    variant="outlined"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                />
                {errors.cedula && <p className='text-red-500'>{errors.cedula[0]}</p>}
                <TextField
                    label="Fecha de nacimiento"
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                {errors.fecha_nacimiento && <p className='text-red-500'>{errors.fecha_nacimiento[0]}</p>}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {errors.image && <p className="text-red-500">{errors.image[0]}</p>}
                <Button variant="contained" color="info" type="submit">
                    Registrar
                </Button>
            </Box>
        </div>
    );
};
