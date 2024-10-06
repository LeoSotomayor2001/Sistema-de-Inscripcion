import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Button, Typography, MenuItem, Select, FormControl, InputLabel, Box, TextField } from '@mui/material';
import { useEstudiantes } from '../Hooks/UseEstudiantes';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

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

export const ModalInscripciones = ({ modalIsOpen, closeModal, inscripcion, obtenerEstudiantes = () => {} }) => {
    const { anosEscolares, getAnosEscolares, getSecciones } = useEstudiantes();
    const [selectedAnoEscolar, setSelectedAnoEscolar] = useState("");
    const [secciones, setSecciones] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSeccion, setSelectedSeccion] = useState("");
    const [years, setYears] = useState([]);
    const [hasChanges, setHasChanges] = useState(false); // Nuevo estado para detectar cambios

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
        if (selectedYear) {
            const fetchSecciones = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/secciones?year_id=${selectedYear}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setSecciones(response.data);
                } catch (error) {
                    console.error('Error al obtener secciones:', error);
                    toast.error('Debe seleccionar todos los campos');
                }
            };

            fetchSecciones();
        } else {
            setSecciones([]);
            setSelectedSeccion("");
        }
    }, [selectedYear]);

    const handlePreinscripcion = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/inscripciones/${inscripcion.id}`,
                {
                    year_id: selectedYear,
                    seccion_id: selectedSeccion,
                    ano_escolar_id: selectedAnoEscolar,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(response.data.mensaje);
            obtenerEstudiantes();
            closeModal();
        } catch (error) {
            console.error('Error al preinscribir estudiante:', error);
            toast.error(error.response?.data?.mensaje || 'Error al preinscribir');
        } finally {
            setSelectedYear("");
            setSelectedSeccion("");
        }
    };

    useEffect(() => {
        fetchYears();
        getSecciones();
        getAnosEscolares();
    }, []);

    useEffect(() => {
        if (inscripcion) {
            setSelectedAnoEscolar(inscripcion.ano_escolar_id);
            setSelectedYear(inscripcion.año);
            setSelectedSeccion(inscripcion.seccion_id);
        }
    }, [inscripcion]);

    // Detectar cambios en los selects y actualizar hasChanges
    useEffect(() => {
        if (
            inscripcion &&
            (selectedYear !== inscripcion.año ||
            selectedSeccion !== inscripcion.seccion_id ||
            selectedAnoEscolar !== inscripcion.ano_escolar_id)
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [selectedYear, selectedSeccion, selectedAnoEscolar, inscripcion]);

    return (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Editar Inscripción">
            <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', backgroundColor: '#f4f4f4', borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Editar Inscripción
                </Typography>

                <TextField
                    fullWidth
                    label="Nombre y Apellido"
                    variant="outlined"
                    value={`${inscripcion.nombre} ${inscripcion.apellido}`}
                    InputProps={{
                        readOnly: true,
                    }}
                />

                {/* Lista de años */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="year-label">Año Académico</InputLabel>
                    <Select
                        labelId="year-label"
                        label="Año Académico"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map((year) => (
                            <MenuItem key={year.id} value={year.id}>
                                {year.year} - {year.descripcion}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Lista de secciones */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="seccion-label">Sección</InputLabel>
                    <Select
                        labelId="seccion-label"
                        label="Sección"
                        value={selectedSeccion}
                        onChange={(e) => setSelectedSeccion(e.target.value)}
                        disabled={!selectedYear}
                    >
                        {secciones.map((seccion) => (
                            <MenuItem key={seccion.id} value={seccion.id}>
                                {seccion.name} - (Cupos disponibles: {seccion.capacidad})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="ano-escolar-label">Año Escolar</InputLabel>
                    <Select
                        labelId="ano-escolar-label"
                        label="Año Escolar"
                        value={selectedAnoEscolar}
                        onChange={(e) => setSelectedAnoEscolar(e.target.value)}
                    >
                        {anosEscolares.map((ano) => (
                            <MenuItem key={ano.id} value={ano.id}>
                                {ano.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Botón de guardar */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handlePreinscripcion}
                    disabled={!hasChanges || !selectedYear || !selectedSeccion || !selectedAnoEscolar}
                >
                    Guardar Cambios
                </Button>
            </Box>
        </Modal>
    );
};

ModalInscripciones.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    obtenerEstudiantes: PropTypes.func.isRequired,
    inscripcion: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        seccion: PropTypes.string.isRequired,
        año: PropTypes.number.isRequired,
        estado: PropTypes.string.isRequired,
        ano_escolar: PropTypes.string,
        seccion_id: PropTypes.number.isRequired,
        ano_escolar_id: PropTypes.number.isRequired,
    }).isRequired,
};
