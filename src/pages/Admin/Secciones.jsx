import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Spinner } from "../../components/Spinner";
import { ModalSecciones } from "../../components/ModalSecciones";
import { useEstudiantes } from "../../Hooks/UseEstudiantes";
export const Secciones = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const {getSecciones, secciones, loading} = useEstudiantes();
   
    const openModal = (seccion=null) => {
        setSeccionSeleccionada(seccion);
        setIsOpen(true);
      };
    
      const closeModal = () => {
          setIsOpen(false);
          setSeccionSeleccionada(null);
      };

    useEffect(() => {
        document.title = 'Secciones';
        getSecciones();
    }, []);

    if (loading) {
        return <Spinner />
    }
    return (
        <>
        <header>
            <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 2 }}>Secciones</Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', marginTop: 1 }}>Agregue, edite o elimine las secciones</Typography>
            <Button variant="contained" sx={{ margin: 'auto', marginTop: 2 }} startIcon={<AddIcon/>} onClick={() => openModal()}>
                Agregar nueva sección
            </Button>
            

        </header>

        <TableContainer component={Paper} sx={{ width: '90%', margin: 'auto', marginTop: 2 }}>
        <Table>
            <TableHead>
                <TableRow sx={{ backgroundColor: '#4b0082' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Nombre</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold',  }}>Capacidad</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold',  }}>Estudiantes preinscritos</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold',  }}>Estudiantes inscritos</TableCell>
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
                            <TableCell sx={{ fontWeight: 'bold', width: '100px', fontSize: '0.875rem' }}>{seccion.estudiantes_preinscritos}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '100px', fontSize: '0.875rem' }}>{seccion.estudiantes_inscritos}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => console.log("Editar")}
                                    title="Editar sección"
                                >
                                    <EditIcon />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => console.log("Eliminar")}
                                    title="Eliminar sección"
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
                                No hay secciones registradas.
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
    <ModalSecciones
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        seccion={seccionSeleccionada}
    
    />
    </>
    )
}