import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Spinner';

const EstudiantesPreinscritos = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const obtenerEstudiantes = async () => {
            try {
                setLoading(true);
                const token=localStorage.getItem("token");
                const representante=JSON.parse(localStorage.getItem("representante"));
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/representantes/${representante.id}/inscripciones`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
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
        return <Spinner/> 
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Apellido</TableCell>
                        <TableCell>Sección</TableCell>
                        <TableCell>Año</TableCell>
                        <TableCell>Estado</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {inscripciones.map((inscripcion, index) => (
                        <TableRow key={index}>
                            <TableCell>{inscripcion.nombre}</TableCell>
                            <TableCell>{inscripcion.apellido}</TableCell>
                            <TableCell>{inscripcion.seccion}</TableCell>
                            <TableCell>{inscripcion.año}</TableCell>
                            <TableCell>{inscripcion.estado}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EstudiantesPreinscritos;
