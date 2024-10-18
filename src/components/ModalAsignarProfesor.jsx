import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useAdmin } from '../Hooks/UseAdmin';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

export const ModalAsignarProfesor = ({ modalIsOpen, closeModal}) => {
    const { getProfesores, listadoProfesores, fetchAsignaturas, asignaturas,getProfesoresConAsignaturas } = useAdmin();
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [selectedProfesor, setSelectedProfesor] = useState('');
    const [selectedSeccion, setSelectedSeccion] = useState('');
    const [errors, setErrors] = useState({});
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        if (selectedAsignatura) {
            setSelectedSeccion(''); // Restablece la sección seleccionada al cambiar de asignatura
            const fetchSeccionesByYear = async () => {
                try {
                    const token = localStorage.getItem('token');
                    console.log(selectedAsignatura);
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/secciones/buscar?year_id=${selectedAsignatura.year_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setSecciones(response.data.secciones);
                    console.log(response);
                } catch (error) {
                    console.error('Error al obtener secciones:', error);
            
                }
            };
            fetchSeccionesByYear();
        } else {
            setSecciones([]); // Limpiar las secciones cuando no se haya seleccionado una asignatura
            setSelectedSeccion(''); // Asegurar que la sección esté vacía
        }
    }, [selectedAsignatura]);

    useEffect(() => {
        getProfesores();
        fetchAsignaturas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor`;
        const data = {
            profesor_id: selectedProfesor,
            seccion_id: selectedSeccion,
            asignatura_id: selectedAsignatura.id,
        };
        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data);
            // Restablecer campos después de enviar el formulario
            setSelectedSeccion('');
            setSelectedAsignatura('');
            setSelectedProfesor('');
            closeModal();
            getProfesoresConAsignaturas();
        } catch (error) {
            toast.error(error.response.data);
            if(error.response.data.errors){
                setErrors(error.response.data.errors);
                
            }
        }
    };

    return (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
            <h1 className="text-3xl text-center">Asignar Profesor</h1>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <InputLabel id="profesores">Profesores</InputLabel>
                    <Select
                        labelId="profesores"
                        label="Profesores"
                        value={selectedProfesor}
                        onChange={(e) => setSelectedProfesor(e.target.value)}
                    >
                        {listadoProfesores.map((profesor) => (
                            <MenuItem key={profesor.id} value={profesor.id}>
                                {profesor.name + ' ' + profesor.apellido}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {errors?.profesor_id?.map((error) => (
                    <p key={error} className="text-red-500">{error}</p>
                ))}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="asignaturas">Asignaturas</InputLabel>
                    <Select
                        labelId="asignaturas"
                        label="Asignaturas"
                        value={selectedAsignatura}
                        onChange={(e) => setSelectedAsignatura(e.target.value)}
                    >
                        {asignaturas.map((asignatura) => (
                            <MenuItem key={asignatura.id} value={asignatura}>
                                {asignatura.nombre + ' - ' + asignatura.year + ' año'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {errors?.asignatura_id?.map((error) => (
                    <p key={error} className="text-red-500">{error}</p>
                ))}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="seccion-label">Sección</InputLabel>
                    <Select
                        labelId="seccion-label"
                        label="Sección"
                        value={selectedSeccion}
                        onChange={(e) => setSelectedSeccion(e.target.value)}
                        disabled={!selectedAsignatura} // Deshabilitar si no se selecciona una asignatura
                    >
                        {secciones.map((seccion) => (
                            <MenuItem key={seccion.id} value={seccion.id}>
                                {seccion.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {errors?.seccion_id?.map((error) => (
                    <p key={error} className="text-red-500">{error}</p>
                ))}
                <Button variant="contained" disabled={!selectedAsignatura || !selectedSeccion || !selectedProfesor} type="submit">
                    Asignar
                </Button>
            </Box>
        </Modal>
    );
};

ModalAsignarProfesor.propTypes = {
    modalIsOpen: PropTypes.bool,
    closeModal: PropTypes.func
};
