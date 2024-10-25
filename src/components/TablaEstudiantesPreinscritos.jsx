import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box } from '@mui/material';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { CheckCircle } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { ModalInscripciones } from './ModalInscripciones';
import Swal from 'sweetalert2';
import { useAdmin } from '../Hooks/UseAdmin';
export const TablaEstudiantesPreinscritos = ({ inscripciones, admin = false }) => {

    const [modalIsOpen, setIsOpen] = useState(false);
    const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
    const { obtenerEstudiantes, pagination } = useAdmin();

    const openModal = (inscripcion = null) => {
        setInscripcionSeleccionada(inscripcion);
        setIsOpen(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            obtenerEstudiantes(newPage); // Cambiar a la página seleccionada
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setInscripcionSeleccionada(null);
    };
    const confirmarInscripcion = async (inscripcion) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro de querer confirmar esta inscripción?',
            text: 'No podra eliminar ni editar este registro al confirmar.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
        });

        if (resultado.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                const url = `${import.meta.env.VITE_API_URL}/inscripciones/${inscripcion.id}/confirmar`;
                const response = await axios.post(url, {}, { // Pasa los headers en este objeto adicional
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                obtenerEstudiantes();
                toast.success(response.data.mensaje);
            } catch (error) {
                if (error.response?.data?.error) {
                    toast.error(error.response.data.error);
                }
                else if(error.response.data.message){
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error("Error al confirmar la inscripción");
                }
            }
        }
    };

    const deleteInscripcion = async (inscripcion) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        // Si el usuario confirma
        if (resultado.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                const url = `${import.meta.env.VITE_API_URL}/inscripciones/${inscripcion.id}`;
                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                obtenerEstudiantes();
                toast.success(response.data.mensaje);
            } catch (error) {
                console.log(error);
                if (error.response?.data?.error) {
                    toast.error(error.response.data.error);
                }
                else if(error.response.data.message){
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Error al eliminar la inscripción");
                }
            }
        }
    }

    return (
        <>
            <TableContainer component={Paper} sx={{animation: 'fadeIn 1.5s ease-out' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sección</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Periodo escolar</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                            {admin && <TableCell sx={{ color: 'white', fontWeight: 'bold', alignItems: 'center' }}>Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inscripciones.length > 0 ? (
                            inscripciones.map((inscripcion, index) => (
                                <TableRow key={index}>
                                    <TableCell>{inscripcion.nombre}</TableCell>
                                    <TableCell>{inscripcion.apellido}</TableCell>
                                    <TableCell>{inscripcion.año}</TableCell>
                                    <TableCell>{inscripcion.seccion}</TableCell>
                                    <TableCell>{inscripcion.ano_escolar}</TableCell>
                                    <TableCell>{inscripcion.estado}</TableCell>
                                    {admin &&
                                        <TableCell
                                            sx={{
                                                fontWeight: 'bold',
                                                alignItems: 'center',
                                                gap: 2, // Añade espacio entre los botones
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ mr: 1 }}
                                                size="small"
                                                onClick={() => openModal(inscripcion)}
                                                title="Editar inscripción"

                                            >
                                                <EditIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mr: 1 }}
                                                size="small"
                                                onClick={() => deleteInscripcion(inscripcion)}
                                                title="Eliminar inscripción"
                                                disabled={inscripcion.estado === 'confirmada'}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => confirmarInscripcion(inscripcion)}
                                                title="Confirmar inscripción"
                                                disabled={inscripcion.estado === 'confirmada'}
                                            >
                                                <CheckCircle />
                                            </Button>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={admin ? 7 : 6} align="center">
                                    <Typography variant="h6" color="textSecondary">
                                        No hay estudiantes preinscritos.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Paginación */}
            {admin &&
                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                    >
                        Anterior
                    </Button>
                    <Typography variant="body1" color="textSecondary" mx={2}>
                        Página {pagination.current_page} de {pagination.last_page}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                    >
                        Siguiente
                    </Button>
                </Box>
            }

            {admin && inscripcionSeleccionada && (
                <ModalInscripciones
                    modalIsOpen={modalIsOpen}
                    closeModal={closeModal}
                    inscripcion={inscripcionSeleccionada}
                    obtenerEstudiantes={obtenerEstudiantes}
                />

            )}

        </>
    )
}

TablaEstudiantesPreinscritos.propTypes = {
    inscripciones: PropTypes.array.isRequired,
    admin: PropTypes.bool,
}