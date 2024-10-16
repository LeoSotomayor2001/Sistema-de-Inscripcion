import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from './Spinner';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '600px',
    },
};



Modal.setAppElement('#root');
export const ModalListaEstudiantes = ({ modalIsOpenChecklist, closeModalChecklist, seccion }) => {
    const [listadoEstudiantes, setListadoEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const getEstudiantesSeccion = async () => {
        setLoading(true)
        const url = `${import.meta.env.VITE_API_URL}/secciones/${seccion.id}/estudiantes`
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            setListadoEstudiantes(response.data)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        getEstudiantesSeccion();
    }, []);

    return (
        <Modal
            isOpen={modalIsOpenChecklist}  
            onRequestClose={closeModalChecklist}
            style={customStyles}
            contentLabel={'Lista de estudiantes'}
        >
            <h2 className="text-center text-2xl font-bold my-2">
                Lista de estudiantes de {seccion?.año + " año " + seccion?.nombre}
            </h2>
            <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto', marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'black' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Nombre y Apellido</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Cédula</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Género</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', }}>Fecha de Nacimiento</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // Mostrar el spinner mientras carga
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : listadoEstudiantes.length > 0 ? (
                            // Mostrar la lista de estudiantes si hay registros y no está cargando
                            listadoEstudiantes.map((estudiante, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{estudiante.nombre_completo}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{estudiante.cedula}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{estudiante.genero}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{estudiante.fecha_nacimiento}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Mostrar el mensaje de "No hay estudiantes registrados" si no hay estudiantes
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="h6" color="textSecondary">
                                        No hay estudiantes registrados.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </Modal>
    )
}

ModalListaEstudiantes.propTypes = {
    modalIsOpenChecklist: PropTypes.bool,
    closeModalChecklist: PropTypes.func,
    seccion: PropTypes.object,
}