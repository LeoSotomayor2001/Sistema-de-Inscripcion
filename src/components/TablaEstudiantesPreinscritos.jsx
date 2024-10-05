import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { CheckCircle } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
export const TablaEstudiantesPreinscritos = ({ inscripciones, admin = false,obtenerEstudiantes=()=>{} }) => {
    const confirmarInscripcion = async (inscripcion) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_API_URL}/inscripciones/${inscripcion.id}/confirmar`;
    
            console.log(url, token);  // Asegúrate de que el token esté siendo obtenido correctamente.
    
            const response = await axios.post(url, {}, { // Pasa los headers en este objeto adicional
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
            } else {
                toast.error("Error al confirmar la inscripción");
            }
        }
    };
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#4b0082' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sección</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
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
                                <TableCell>{inscripcion.seccion}</TableCell>
                                <TableCell>{inscripcion.año}</TableCell>
                                <TableCell>{inscripcion.ano_escolar}</TableCell>
                                <TableCell>{inscripcion.estado}</TableCell>
                                {admin && 
                                  <TableCell
                                  sx={{
                                    fontWeight: 'bold',
                                    alignItems: 'center',
                                    gap: 1, // Añade espacio entre los botones
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 1 }}
                                    size="small"
                                    title="Editar inscripción"
                                  >
                                    <EditIcon />
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ mr: 1 }}
                                    size="small"
                                    title="Eliminar inscripción"
                                  >
                                    <DeleteIcon />
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => confirmarInscripcion(inscripcion)}
                                    title="Confirmar inscripción"
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
    )
}

TablaEstudiantesPreinscritos.propTypes = {
    inscripciones: PropTypes.array.isRequired,
    admin: PropTypes.bool,
    obtenerEstudiantes:PropTypes.func
}