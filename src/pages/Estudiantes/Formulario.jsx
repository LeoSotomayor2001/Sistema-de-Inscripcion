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
        fecha_nacimiento: '', // Inicializa en formato YYYY-MM-DD para el campo de tipo 'date'
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convertimos la fecha a DD-MM-YYYY antes de enviar los datos
        const formattedData = {
            ...formData,
            fecha_nacimiento: formatDateToDMY(formData.fecha_nacimiento), // Convierte a DD-MM-YYYY antes de enviar
        };

        try {
            const url = "http://127.0.0.1:8000/api/estudiantes";
            const response = await axios.post(url, formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            toast.success(response.data.message);
            setFormData(initialState);
            setErrors({});       
            navigate('/');
            
        } catch (error) {
            console.log(error.response.data.errors);
            setErrors(error.response.data.errors);
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
                <Button variant="contained" color="info" type="submit">
                    Enviar
                </Button>
            </Box>
        </div>
    );
};
