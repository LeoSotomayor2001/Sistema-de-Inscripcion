
import { useEffect, useState } from "react"
import { Spinner } from "../../components/Spinner";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ModalProfesores } from "../../components/ModalProfesores";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { useAdmin } from "../../Hooks/UseAdmin";

export const Profesores = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const { getProfesores, listadoProfesores, loading } = useAdmin();
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
    const openModal = (profesor=null) => {
        setProfesorSeleccionado(profesor);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setProfesorSeleccionado(null);
    };

    useEffect(() => {
        getProfesores();
        document.title = "Profesores"
    }, [])


    const deleteProfesor = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          })

        if (resultado.isConfirmed) {
            try {
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_API_URL}/users/${id}`
                const response = await axios.delete(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                toast.success(response.data.message)
                getProfesores()
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
            }

    if (loading) {
        return <Spinner />
    }
    return (
        <div>
               <header>
                <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 2 }}>Profesores</Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', marginTop: 1 }}>Agregue, edite o elimine los profesores registrados</Typography>
                <Button variant="contained" sx={{ margin: 'auto', marginTop: 2 }} startIcon={<AddIcon /> } onClick={openModal}>
                    Registrar profesor
                </Button>


            </header>
            <TableContainer component={Paper} sx={{ width: '90%', margin: 'auto', marginTop: 2,maxHeight: 700,animation: 'fadeIn 1.5s ease-out'  }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cédula</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asignaturas designadas</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Admin</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listadoProfesores.length > 0 ? (
                            listadoProfesores.map((profesor, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'grey.200' : 'white' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{profesor.name}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{profesor.apellido}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{profesor.email}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{profesor.cedula}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{profesor.asignaturas}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{profesor.admin ? 'Si' : 'No'}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', display: 'flex', gap: 2, justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => openModal(profesor)}
                                            title="Editar profesor"
                                        >
                                            <EditIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => deleteProfesor(profesor.id)}
                                            title="Eliminar profesor"
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="h6" color="textSecondary">
                                        No hay profesores registrados.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ModalProfesores modalIsOpen={modalIsOpen} closeModal={closeModal} profesor={profesorSeleccionado} />
        </div>
    )
}
