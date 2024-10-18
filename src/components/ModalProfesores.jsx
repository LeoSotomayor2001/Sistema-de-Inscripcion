import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Box, Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAdmin } from '../Hooks/UseAdmin';

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

export const ModalProfesores = ({ modalIsOpen, closeModal, profesor = null }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [admin, setAdmin] = useState(false);
    const [errors, setErrors] = useState({});
    const { getProfesores } = useAdmin();
    const isEdit = profesor && profesor.name;
    useEffect(() => {
        if (isEdit && profesor) {
            const { name, apellido, cedula, email, admin } = profesor;
            setNombre(name || '');
            setApellido(apellido || '');
            setCedula(cedula || '');
            setEmail(email || '');
            setAdmin(admin === 1); // Convierte 1 a true, 0 a false
        } else {
            setNombre('');
            setApellido('');
            setCedula('');
            setEmail('');
            setAdmin(false);
        }
    }, [profesor]);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        const formDataCreate = {
            name: nombre,
            apellido,
            cedula,
            email,
            password,
            password_confirmation,
            admin
        }
        const formDataUpdate = {
            name: nombre,
            apellido,
            cedula,
            email,
            admin
        }
    
        const url = isEdit ? `${import.meta.env.VITE_API_URL}/users/${profesor.id}` : `${import.meta.env.VITE_API_URL}/users`;
        try {
            if (isEdit) {
                // Editar profesor (sin incluir contraseñas)
                await axios.put(url, formDataUpdate, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Profesor actualizado con éxito');
            } else {
                // Crear nuevo profesor
                await axios.post(url, formDataCreate, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Profesor creado con éxito');
            }
            closeModal();
            getProfesores();
        } catch (error) {
            console.error(error);
            if (error.response.data.errors) {
                setErrors(error.response.data.errors);
                setTimeout(() => {
                    setErrors({});
                }, 3000);
            } else {
                toast.error(error.response.data.message);
            }
        }
    }
    
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
                content: modalIsOpen ? { ...customStyles.content, ...customStyles.contentOpen } : customStyles.content,
            }}
            contentLabel={isEdit ? 'Editar Profesor' : 'Registrar Profesor'}
        >
            <h2 className="text-center text-2xl font-bold my-2">{isEdit ? 'Editar profesor' : 'Registrar profesor'}</h2>
            <form noValidate onSubmit={handleSubmit}>
                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Nombres"
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    {errors?.name && <p className="text-red-500">{errors.name}</p>}
                </Box>
                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Apellidos"
                        variant="outlined"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                    {errors?.apellido && <p className="text-red-500">{errors.apellido}</p>}
                </Box>

                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Cedula"
                        variant="outlined"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                    {errors?.cedula && <p className="text-red-500">{errors.cedula}</p>}
                </Box>

                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors?.email && <p className="text-red-500">{errors.email}</p>}
                </Box>
                {!isEdit && (
                    <>
                        <Box mb={3}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors?.password && <p className="text-red-500">{errors.password}</p>}
                        </Box>

                        <Box mb={3}>
                            <TextField
                                fullWidth
                                label="Confirmar contraseña"
                                variant="outlined"
                                type="password"
                                value={password_confirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />

                        </Box>


                    </>

                )}

                <Box mb={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={admin}
                                onChange={(e) => setAdmin(e.target.checked)}
                                name="admin"
                                color="primary"
                            />
                        }
                        label="Dar Permisos De Administrador"
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
        </Modal >
    )
}

ModalProfesores.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    profesor: PropTypes.object,
};