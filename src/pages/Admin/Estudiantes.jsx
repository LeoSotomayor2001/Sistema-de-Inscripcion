import { useEffect } from "react";
import { useEstudiantes } from "../../Hooks/UseEstudiantes";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,Box, Button } from '@mui/material';
import { Spinner } from "../../components/Spinner";

export const Estudiantes = () => {
    const { mostrarEstudiantes, listadoEstudiantes, loading,pagination,formatDate } = useEstudiantes();

    useEffect(() => {
        mostrarEstudiantes();
        document.title = "Estudiantes";
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            mostrarEstudiantes(newPage); // Cambiar a la página seleccionada
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
        <TableContainer component={Paper}>
            <Table >
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#4b0082' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Foto</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombres</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellidos</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cédula</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha de Nacimiento</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Representante</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listadoEstudiantes.length > 0 ? (
                        listadoEstudiantes.map((estudiante, index) => (
                            <TableRow key={index}>
                            <TableCell className="md:w-28 sm:w-16">
                                <img
                                    src={estudiante.image ? `${import.meta.env.VITE_API_URL}/imagen/${estudiante.image}` : "/img/usuario.svg"}
                                    alt="foto estudiante"
                                    className="max-w-full h-auto object-cover rounded-full"
                                />
                            </TableCell>
                            <TableCell>{estudiante.name}</TableCell>
                            <TableCell>{estudiante.apellido}</TableCell>
                            <TableCell>{estudiante.cedula}</TableCell>
                            <TableCell>{formatDate(estudiante.fecha_nacimiento)}</TableCell>
                            <TableCell>
                                {estudiante.representante
                                    ? `${estudiante.representante.name} ${estudiante.representante.apellido}`
                                    : "Sin representante"}
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography variant="h6" color="textSecondary">
                                    No hay estudiantes inscritos.
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
    </>
    );
};
