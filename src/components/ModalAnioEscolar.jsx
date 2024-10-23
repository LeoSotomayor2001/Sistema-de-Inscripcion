import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Box, Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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

export const ModalAnioEscolar = ({ modalIsOpen, closeModal, anoEscolar = null }) => {
    const [nombre, setNombre] = useState('');
    const [inicio, setInicio] = useState('');
    const { getAnosEscolares } = useEstudiantes();
    const [errors, setErrors] = useState([])
    const [fin, setFin] = useState('');
    const [habilitado, setHabilitado] = useState(false);
    const isEdit = anoEscolar && anoEscolar.nombre;

    useEffect(() => {
        if (anoEscolar && isEdit) {
            const { nombre, inicio, fin, habilitado } = anoEscolar
            setNombre(nombre);
            setInicio(inicio);
            setFin(fin);
            setHabilitado(habilitado === 1);
        }
        else {
            setNombre('');
            setInicio('');
            setFin('');
            setHabilitado(false);
        }
    }, [anoEscolar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const url = isEdit ? `${import.meta.env.VITE_API_URL}/anos-escolares/${anoEscolar.id}` : `${import.meta.env.VITE_API_URL}/anos-escolares`
        const data = {
            nombre,
            inicio,
            fin,
            habilitado,
        };
        try {
            if (isEdit) {
                // Editar profesor (sin incluir contraseñas)
                const response = await axios.put(url, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success(response.data.message);
                closeModal()
                getAnosEscolares()

            } else {
                // Crear nuevo profesor
                const response = await axios.post(url, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success(response.data.message);
                closeModal()
                getAnosEscolares()
            }

        } catch (error) {

            if (error.response.data.errors) {
                setErrors(error.response.data.errors)
                setTimeout(() => {
                    setErrors([])
                }, 3000);
            }
            if (error.response.data.error) {
                toast.error(error.response.data.error)
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
            contentLabel={isEdit ? 'Editar Periodo Escolar' : 'Registrar Periodo Escolar'}
        >
            <h2 className="text-center text-2xl font-bold my-2">{isEdit ? 'Editar Periodo Escolar' : 'Registrar Periodo Escolar'}</h2>
            <form noValidate onSubmit={handleSubmit}>
                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={nombre}
                        placeholder='Ej: 2024-2025'
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    {errors?.nombre && <p className="text-red-500">{errors.nombre}</p>}
                </Box>
                <Box mb={3}>
                    <TextField
                        label="Fecha de Inicio"
                        name="inicio"
                        type="date"
                        variant="outlined"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        fullWidth
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {errors?.inicio && <p className="text-red-500">{errors.inicio}</p>}
                </Box>
                <Box mb={3}>

                    <TextField
                        label="Fecha de Finalización"
                        name="fin"
                        type="date"
                        variant="outlined"
                        value={fin}
                        onChange={(e) => setFin(e.target.value)}
                        fullWidth
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {errors?.fin && errors.fin.map((error, index) => (
                        <p key={index} className="text-red-500">{error}</p>
                    ))}

                </Box>
                <Box mb={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={habilitado}
                                onChange={(e) => setHabilitado(e.target.checked)}
                                name="habilitado"
                                color="primary"
                            />
                        }
                        label="Habilitado"
                    />
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button onClick={closeModal} variant="outlined" sx={{ mr: 2 }}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isEdit ? 'Actualizar' : 'Registrar'}
                    </Button>
                </Box>
            </form>
        </Modal>
    );
};


ModalAnioEscolar.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    anoEscolar: PropTypes.object,
}