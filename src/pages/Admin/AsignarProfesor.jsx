import axios from "axios"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
export const AsignarProfesor = () => {
    const [asignaturas, setAsignaturas] = useState([])
    const getProfesoresConAsignaturas = async () => {
        const token = localStorage.getItem('token')
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor`

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            setAsignaturas(response.data.asignaturas)
        } catch (error) {
            console.log(error)
        }
    }
    const desasignarProfesor = async (asignatura) => {
        const url = `${import.meta.env.VITE_API_URL}/asignatura-profesor`;
        const data = {
            asignatura_id: asignatura.id,
            profesor_id: asignatura.profesor_id,
            seccion_id: asignatura.seccion_id
        };
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
                toast.success('Asignatura desasignada con exito');
            } catch (error) {
                console.log(error);
                toast.error('Error al desasignar el profesor');
            }
        }
    };
    
    useEffect(() => {
        getProfesoresConAsignaturas()
    }, [])
    return (
        <>
            <header>
                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', my: 2 }}>
                    Lista de profesores con asignaturas
                </Typography>
                <Button variant="contained"  sx={{ margin: 'auto', my: 2 }}>Adjudicar Profesor

                </Button>
            </header>
            <TableContainer component={Paper}>
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
                        {asignaturas.length > 0 ? (
                            asignaturas.map((asignatura, index) => (
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
                                    <Typography>
                                        No hay profesores asignados a ninguna asignatura

                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )
}