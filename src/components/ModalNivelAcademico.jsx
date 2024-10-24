import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useAdmin } from '../Hooks/UseAdmin';

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
export const ModalNivelAcademico = ({ modalIsOpen, closeModal, nivelAcademico = null }) => {
    const isEdit = nivelAcademico && nivelAcademico.year;
    const [yearAcademico, setYearAcademico] = useState()
    const { fetchYears } = useAdmin();
    const [descripcion, setDescripcion] = useState()
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (nivelAcademico && isEdit) {
            const { year, descripcion, } = nivelAcademico
            setYearAcademico(year);
            setDescripcion(descripcion);

        }
        else {
            setYearAcademico('');
            setDescripcion('');
        }
    }, [nivelAcademico]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const url = isEdit ? `${import.meta.env.VITE_API_URL}/years/${nivelAcademico.id}` : `${import.meta.env.VITE_API_URL}/years`
        const data = {
            year: yearAcademico,
            descripcion
        }
        try {
            if (isEdit) {
                const response = await axios.put(url, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success(response.data);
                closeModal()
                fetchYears()
            }
            else {

                const response = await axios.post(url, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                toast.success(response.data)
                closeModal()
                fetchYears()

                setYearAcademico('')
                setDescripcion('')
            }
        } catch (error) {
            console.log(error)
            if (error.response.data.errors) {
                setErrors(error.response.data.errors)
                setTimeout(() => {
                    setErrors([])
                }, 3000);
            }
            else if(error.response.data.error){
                toast.error(error.response.data.error)
            }
            else {
                toast.error('Ocurrió un error inesperado')
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
            contentLabel={isEdit ? 'Editar Nivel Academico' : 'Registrar Nivel Acedemico'}
        >
            <h1 className='text-center text-3xl font-bold mb-3'>{isEdit ? 'Editar Nivel Académico' : 'Registrar Nivel Académico'}</h1>
            <form noValidate onSubmit={handleSubmit}>
                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Nivel"
                        variant="outlined"
                        name='yearAcademico'
                        type='number'
                        value={yearAcademico}
                        placeholder='Ej: Primer año'
                        onChange={(e) => setYearAcademico(e.target.value)}
                    />
                     {errors?.year && errors.year.map((error, index) => (
                        <p key={index} className="text-red-500">{error}</p>
                    ))}
                </Box>

                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Descripcion"
                        variant="outlined"
                        name='descripcion'
                        value={descripcion}
                        placeholder='Ej: 1'
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                     {errors?.descripcion && errors.descripcion.map((error, index) => (
                        <p key={index} className="text-red-500">{error}</p>
                    ))}
                </Box>

                <Box display="flex" justifyContent="flex-end">
                    <Button onClick={closeModal} variant="outlined" sx={{ mr: 2 }}>
                        Cancelar
                    </Button>
                    <Button type='submit' variant='contained'>
                        {isEdit ? 'Actualizar' : 'Registrar'}
                    </Button>

                </Box>
            </form>
        </Modal>
    )
}

ModalNivelAcademico.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    nivelAcademico: PropTypes.object,
}