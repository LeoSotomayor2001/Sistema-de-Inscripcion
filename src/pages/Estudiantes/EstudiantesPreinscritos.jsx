import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Spinner';

const EstudiantesPreinscritos = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerEstudiantes = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const representante = JSON.parse(localStorage.getItem("representante"));
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/representantes/${representante.id}/inscripciones`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInscripciones(response.data.inscripciones);
            } catch (error) {
                console.error(error);
                toast.error("Error al obtener los estudiantes preinscritos");
            } finally {
                setLoading(false);
            }
        };

        obtenerEstudiantes();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#4b0082' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold'  }}>Apellido</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold'  }}>Sección</TableCell>
                        <TableCell sx={{ color: 'white' , fontWeight: 'bold' }}>Año</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold'  }}>Estado</TableCell>
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
                                <TableCell>{inscripcion.estado}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography variant="h6" color="textSecondary">
                                    No hay estudiantes preinscritos.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EstudiantesPreinscritos;
