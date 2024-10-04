
import { useEffect, useState } from "react"
import { useEstudiantes } from "../../Hooks/UseEstudiantes";
import { Spinner } from "../../components/Spinner";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ModalProfesores } from "../../components/ModalProfesores";

export const Profesores = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const { getProfesores, listadoProfesores, loading } = useEstudiantes();
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
            <TableContainer component={Paper} sx={{ width: '90%', margin: 'auto', marginTop: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#4b0082' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apellido</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cédula</TableCell>
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
