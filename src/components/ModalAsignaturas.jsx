import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useEstudiantes } from '../Hooks/UseEstudiantes';
import { toast } from 'react-toastify';
import axios from 'axios';
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
export const ModalAsignaturas = ({ modalIsOpen, closeModal, asignatura = null }) => {
    const initialState = {
        nombre: asignatura?.nombre || '',
        descripcion: asignatura?.descripcion || '',
        codigo: asignatura?.codigo || '',
    };
    const [selectedAnoEscolar, setSelectedAnoEscolar] = useState('')
    const [formData, setFormData] = useState(initialState);
    const [yearId, setYearId] = useState('');
    const [errors, setErrors] = useState({});
    const { getAnosEscolares, anosEscolares } = useEstudiantes();
    const { years, fetchYears, fetchAsignaturas } = useAdmin();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    useEffect(() => {
        getAnosEscolares();
        fetchYears();
        setYearId(asignatura?.year_id || '');
        setSelectedAnoEscolar(asignatura?.ano_escolar_id || '');
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL}/asignaturas/${asignatura?.id}`;

        const data = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            codigo: formData.codigo,
            year_id: yearId,
            ano_escolar_id: selectedAnoEscolar
        }

        try {
            const response = await axios.patch(url, data, {
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            });
            toast.success(response.data.message);
            fetchAsignaturas();
            closeModal();
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }
            else if (error.response.data.errors) {
                setErrors(error.response.data.errors);
                setTimeout(() => {
                    setErrors([]);
                }, 3000);
            }
            else if (error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error('Ocurrio un error en el servidor');
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
            contentLabel={"Editar asignatura"}
        >
            <h2 className="text-center text-2xl font-bold my-2">{'Editar Asignatura'}</h2>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 800 }}
                className='w-full max-w-lg p-8 bg-white shadow-md rounded-lg'
                noValidate
            >
                <h1 className='text-2xl mb-4 text-center uppercase'>Registrar Asignatura</h1>

                <TextField
                    label="Nombre"
                    variant="outlined"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                />
                {errors?.nombre && <p className='text-red-500'>{errors?.nombre[0]}</p>}
                <TextField
                    label="Descripción"
                    variant="outlined"
                    name="descripcion"
                    onChange={handleChange}
                    value={formData.descripcion}
                    fullWidth
                />
                {errors?.descripcion && <p className='text-red-500'>{errors?.descripcion[0]}</p>}
                <TextField
                    label="Código"
                    variant="outlined"
                    name="codigo"
                    onChange={handleChange}
                    value={formData.codigo}
                    fullWidth
                />
                {errors?.codigo && <p className='text-red-500'>{errors?.codigo[0]}</p>}
                <Box>
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
                    {errors?.year_id && <p className='text-red-500'>{errors?.year_id[0]}</p>}
                </Box>


                <FormControl fullWidth margin="normal">
                    <InputLabel id="ano-escolar-label">Periodo Escolar</InputLabel>
                    <Select
                        labelId="ano-escolar-label"
                        label="Periodo Escolar"
                        value={selectedAnoEscolar}
                        onChange={(e) => setSelectedAnoEscolar(e.target.value)}
                    >
                        {anosEscolares?.filter(ano => ano.habilitado).map((ano) => (
                            <MenuItem key={ano.id} value={ano.id}>
                                {ano.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {errors?.ano_escolar_id && <p className='text-red-500'>{errors?.ano_escolar_id[0]}</p>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Actualizar Asignatura
                </Button>

            </Box>
        </Modal>

    )
}

ModalAsignaturas.propTypes = {
    modalIsOpen: PropTypes.bool,
    closeModal: PropTypes.func,
    asignatura: PropTypes.string
}