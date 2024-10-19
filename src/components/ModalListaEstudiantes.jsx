import { useRef, useEffect, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
    const tableRef = useRef();

    const getEstudiantesSeccion = async () => {
        setLoading(true);
        const url = `${import.meta.env.VITE_API_URL}/secciones/${seccion.id}/estudiantes`;
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            setListadoEstudiantes(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEstudiantesSeccion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDownloadPDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.autoTable({
            head: [
                ['ID', 'Nombre y Apellido', 'Cédula', 'Género', 'Fecha de Nacimiento']
            ],
            body: listadoEstudiantes.map((estudiante, index) => [
                index + 1,
                estudiante.nombre_completo,
                estudiante.cedula,
                estudiante.genero,
                estudiante.fecha_nacimiento,
            ]),
            startY: 20,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 0, 0], // Color de fondo para el encabezado
                textColor: [255, 255, 255], // Color del texto del encabezado
                fontStyle: 'bold', // Negritas para el encabezado
            },
            bodyStyles: {
                fontStyle: 'bold', // Negritas para el cuerpo
                textColor: [0, 0, 0], // Color del texto en el cuerpo
                fillColor: [255, 255, 255], // Fondo blanco para el cuerpo
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 220 },
                2: { cellWidth: 80 },
                3: { cellWidth: 90 },
                4: { cellWidth: 120 },
            },
        });
        doc.save(`lista_estudiantes_${seccion?.año}_${seccion?.nombre}.pdf`);
    };


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
            <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto', marginTop: 2 }} ref={tableRef}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'black' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: 50 }}>ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: 200 }}>Nombre y Apellido</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: 100 }}>Cédula</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: 100 }}>Género</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap', maxWidth: 180 }}>Fecha de Nacimiento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : listadoEstudiantes.length > 0 ? (
                            listadoEstudiantes.map((estudiante, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{estudiante.nombre_completo}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{estudiante.cedula}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{estudiante.genero}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{estudiante.fecha_nacimiento}</TableCell>
                                </TableRow>
                            ))
                        ) : (
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
            <button
                onClick={handleDownloadPDF}
                type="button" 
                disabled={listadoEstudiantes.length === 0 || loading}
                className={
                    'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-30 disabled:cursor-not-allowed'}
                >
                    Descargar PDF
            </button>
        </Modal>
    );
};

ModalListaEstudiantes.propTypes = {
    modalIsOpenChecklist: PropTypes.bool,
    closeModalChecklist: PropTypes.func,
    seccion: PropTypes.object,
};
