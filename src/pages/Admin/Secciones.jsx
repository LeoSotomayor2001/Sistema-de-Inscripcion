import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, } from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Spinner } from "../../components/Spinner";
import { ModalSecciones } from "../../components/ModalSecciones";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ModalListaEstudiantes } from "../../components/ModalListaEstudiantes";
import { useAdmin } from "../../Hooks/UseAdmin";
export const Secciones = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [modalIsOpenChecklist, setIsOpenChecklist] = useState(false);
    const [seccionSeleccionadaChecklist, setSeccionSeleccionadaChecklist] = useState(null);

    const { getSecciones, secciones, loading, pagination } = useAdmin();

    const openModal = (seccion = null) => {
        if (!modalIsOpen) { // Asegúrate de que el modal no esté ya abierto
        setSeccionSeleccionada(seccion);
        setIsOpen(true);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            getSecciones(newPage); // Cambiar a la página seleccionada
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setSeccionSeleccionada(null);
    };
    const openModalChecklist = (seccion = null) => {
        if (!modalIsOpenChecklist) { // Asegúrate de que el modal no esté ya abierto
            setSeccionSeleccionadaChecklist(seccion);
            setIsOpenChecklist(true);
        }
    }


    const closeModalChecklist = () => {
        setIsOpenChecklist(false);
        setSeccionSeleccionadaChecklist(null);
    }

    useEffect(() => {
        document.title = 'Secciones';
        getSecciones();
    }, []);
    

    const deleteSeccion = async (id) => {
        // Eliminar seccion
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
        if (resultado.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/secciones/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success(response.data);
                getSecciones();
            } catch (error) {
                console.error(error);
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('Error al eliminar la sección');
                }
            }
        }
    };

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <header>
                <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 2 }}>Secciones</Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', marginTop: 1 }}>Agregue, edite o elimine las secciones</Typography>
                <Button variant="contained" sx={{ margin: 'auto', marginTop: 2 }} startIcon={<AddIcon />} onClick={() => openModal()}>
                    Agregar nueva sección
                </Button>


            </header>

            <TableContainer component={Paper} sx={{ width: '90%', margin: 'auto', marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Capacidad</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Estudiantes preinscritos</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Estudiantes inscritos</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Periodo Escolar</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {secciones.length > 0 ? (
                            secciones.map((seccion, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'grey.200' : 'white' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{seccion.año}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{seccion.nombre}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{seccion.capacidad}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{seccion.estudiantes_preinscritos}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{seccion.estudiantes_inscritos}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{seccion.ano_escolar}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', display: 'flex', gap: 2, justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => openModal(seccion)}
                                            title="Editar sección"
                                        >
                                            <EditIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => deleteSeccion(seccion.id)}
                                            title="Eliminar sección"
                                        >
                                            <DeleteIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => openModalChecklist(seccion)}
                                            title="Lista de estudiantes de la sección"
                                        >
                                            <ChecklistIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="h6" color="textSecondary">
                                        No hay secciones registradas.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Paginación */}
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
            
            <ModalSecciones
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                seccion={seccionSeleccionada}
            />
            {seccionSeleccionadaChecklist && (
                <ModalListaEstudiantes
                modalIsOpenChecklist={modalIsOpenChecklist}
                closeModalChecklist={closeModalChecklist}
                    seccion={seccionSeleccionadaChecklist}
                />
                
            )}
        </>
    )
}
