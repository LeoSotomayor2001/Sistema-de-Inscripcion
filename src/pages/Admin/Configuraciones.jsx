import { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { useEstudiantes } from '../../Hooks/UseEstudiantes';
import { Spinner } from '../../components/Spinner';
import { useAdmin } from '../../Hooks/UseAdmin';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ModalAnioEscolar } from '../../components/ModalAnioEscolar';

export const Configuraciones = () => {
    const { anosEscolares, getAnosEscolares } = useEstudiantes();
    const { years, fetchYears } = useAdmin();
    const [anioEscolarSeleccionado,setAnioEscolarSeleccionado]=useState()
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = (anioEscolar=null) => {
        setAnioEscolarSeleccionado(anioEscolar);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setAnioEscolarSeleccionado(null);
    };
    const deleteYear=async (id) => {
        const respuesta=await Swal.fire({
            title: '¿Deseas eliminar este año academico?',
            text: '¡No podras recuperarlo!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
        })

        if (respuesta.isConfirmed) {
            const url= `${import.meta.env.VITE_API_URL}/years/${id}`;
            const token = localStorage.getItem('token');
            try {
                const response= await axios.delete(url, {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                    
                })
                toast.success(response.data.message);
                fetchYears();
            }
            catch (error) {
                console.log(error)
                toast.error(error.response.data.message);
            }
        }
    }
    useEffect(() => {
        getAnosEscolares();
        fetchYears();
        document.title = 'Configuraciones';
    }, []);
    if (!anosEscolares || !years) return <Spinner />

    return (
        <Container>
            <Typography variant="h5" component="h4" align="center" gutterBottom>
                Periodos Escolares
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openModal}>
                Crear Nuevo Periodo Escolar
            </Button>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Periodo Escolar</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Inicio</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fin</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {anosEscolares.length > 0 &&
                            anosEscolares.map((anio) => (
                                <TableRow key={anio.id}>
                                    <TableCell>{anio.nombre}</TableCell>
                                    <TableCell>{anio.habilitado ? 'Habilitado' : 'No Habilitado'}</TableCell>
                                    <TableCell>
                                        {new Date(anio.inicio).toLocaleDateString('es-ES')}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(anio.fin).toLocaleDateString('es-ES')}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="editar" color="primary" onClick={() =>openModal(anio)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="eliminar" color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                    </TableBody>
                </Table>

            </TableContainer>

            <Typography variant="h5" component="h4" align="center" gutterBottom sx={{ mt: 2 }}>
                Niveles Académicos
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                Crear Nuevo Nivel Académico
            </Button>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nivel Académico</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripcion</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Secciones Registradas</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asignaturas Registradas</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estudiantes Registrados</TableCell>
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {years.length > 0 &&
                            years.map((year) => (
                                <TableRow key={year.id}>
                                    <TableCell>{year.year}</TableCell>
                                    <TableCell>{year.descripcion}</TableCell>
                                    <TableCell>{year.secciones}</TableCell>
                                    <TableCell>{year.asignaturas}</TableCell>
                                    <TableCell>{year.inscripciones}</TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="editar" color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="eliminar" color="secondary" onClick={() => deleteYear(year.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ModalAnioEscolar modalIsOpen={modalIsOpen} closeModal={closeModal} anoEscolar={anioEscolarSeleccionado} />      
        </Container>
    );
};

