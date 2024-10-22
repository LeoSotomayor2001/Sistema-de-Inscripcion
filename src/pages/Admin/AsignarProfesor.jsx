import axios from "axios"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, TextField, MenuItem } from '@mui/material';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ModalAsignarProfesor } from "../../components/ModalAsignarProfesor";
import { useAdmin } from "../../Hooks/UseAdmin";
import { Spinner } from "../../components/Spinner";
export const AsignarProfesor = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const { asignaturasConProfesores, getProfesoresConAsignaturas, years, fetchYears, setAsignaturasConProfesores, pagination } = useAdmin();
    const [nombre, setNombre] = useState('');
    const [nombreAsignatura, setNombreAsignatura] = useState('');
    const [yearId, setYearId] = useState('');
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            getProfesoresConAsignaturas(newPage); // Cambiar a la página seleccionada
        }
    };
    const desasignarProfesor = async (asignatura) => {
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor`;
        const data = {
            asignatura_id: asignatura.asignatura_id,
            profesor_id: asignatura.profesor_id,
            seccion_id: asignatura.seccion_id
        };
        console.log(asignatura)
        console.log(data)
        const respuesta = await Swal.fire({
            title: '¿Deseas desasignar este profesor?',
            text: '¡No podras revertir esta operación!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, desasignar',
            cancelButtonText: 'Cancelar'
        });
        if (respuesta.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: data
                });
                console.log(response);
                getProfesoresConAsignaturas();
                toast.success(response.data);
            } catch (error) {
                console.log(error);
                toast.error('Error al desasignar el profesor');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor/buscar`;
        try {
            const response = await axios.get(url, {
                params: { nombre, year_id: yearId, nombre_asignatura: nombreAsignatura },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAsignaturasConProfesores(response.data);

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        getProfesoresConAsignaturas()
        fetchYears()
        document.title = "Asignar Profesor"
        // eslint-disable-next-line
    }, [])


    if (!asignaturasConProfesores){
        return <Spinner/>
    }

    return (
        <>
            <header>
                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', my: 2 }}>
                    Lista de profesores con asignaturas
                </Typography>
                <Button variant="contained" sx={{ margin: 'auto', my: 2 }} onClick={openModal}>Asignar Profesor

                </Button>
                <form className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-3" onSubmit={handleSubmit} >
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} width="100%" alignItems="center">
                        <TextField
                            fullWidth
                            id="nombre"
                            name="nombre"
                            label="Buscar por nombre del profesor"
                            variant="outlined"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { md: '300px' } }}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Buscar asignaturas por año"
                            value={yearId}
                            onChange={(e) => setYearId(e.target.value)}
                            variant="outlined"
                            sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { md: '300px' } }}
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

                        <TextField
                            fullWidth
                            id="nombre"
                            name="nombre"
                            label="Buscar por nombre de la asignatura"
                            variant="outlined"
                            value={nombreAsignatura}
                            onChange={(e) => setNombreAsignatura(e.target.value)}
                            sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { md: '300px' } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: { xs: 2, md: 0 }, width: { xs: '100%', md: 'auto' }, height: 50 }}
                        >
                            Buscar
                        </Button>
                    </Box>
                </form>
            </header>
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Profesor</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Seccion</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Periodo escolar</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {asignaturasConProfesores.length > 0 ? (
                            asignaturasConProfesores.map((asignatura, index) => (
                                <TableRow key={index}>
                                    <TableCell>{asignatura.nombre}</TableCell>
                                    <TableCell>{asignatura.codigo}</TableCell>
                                    <TableCell>{asignatura.profesor}</TableCell>
                                    <TableCell>{asignatura.year}</TableCell>
                                    <TableCell>{asignatura.seccion}</TableCell>
                                    <TableCell>{asignatura.ano_escolar}</TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            alignItems: 'center',

                                        }}
                                    >

                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => desasignarProfesor(asignatura)}
                                        >
                                            Quitar Profesor
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }} color="textSecondary">
                                        No hay profesores asignados a ninguna asignatura

                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {!nombre && !yearId && !nombreAsignatura && (
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

            )}
            <ModalAsignarProfesor modalIsOpen={modalIsOpen} closeModal={closeModal} />
        </>
    )
}
