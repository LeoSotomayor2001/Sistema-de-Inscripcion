
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { useEstudiantes } from "../../Hooks/UseEstudiantes";
import { Spinner } from "../../components/Spinner";
import { ModalAsignaturas } from "../../components/ModalAsignaturas";
export const Asignaturas = () => {
    
   const { fetchAsignaturas, asignaturas,loading } = useEstudiantes()
   const [modalIsOpen, setIsOpen] = useState(false);
   const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

   const openModal = (asignatura = null) => {
    setAsignaturaSeleccionada(asignatura);
    setIsOpen(true);
};

const closeModal = () => {
    setIsOpen(false);
    setAsignaturaSeleccionada(null);
};
    useEffect(() => {
      fetchAsignaturas()
      document.title = 'Asignaturas'
    }, [])

    if(loading){
        return <Spinner />
    }
  return (
    <div>
      <h1 className="text-3xl text-center my-5">Asignaturas</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          <TableRow sx={{ backgroundColor: '#4b0082'  }}>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Asignatura</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Descripcion</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Periodo Escolar</TableCell>
              <TableCell  sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asignaturas.length > 0 ? (
              asignaturas.map((asignatura, index) => (
                <TableRow key={asignatura.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{asignatura.nombre}</TableCell>
                  <TableCell>{asignatura.descripcion}</TableCell>
                  <TableCell>{asignatura.codigo}</TableCell>
                  <TableCell>{asignatura.year}</TableCell>
                  <TableCell>{asignatura.ano_escolar}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => openModal(asignatura)}>Edit</Button>
                    <Button variant="contained" color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ): (
                <TableRow>
                <TableCell colSpan={7} align="center">
                    <Typography variant="h6" color="textSecondary">
                        No hay asignaturas registradas.
                    </Typography>
                </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {asignaturaSeleccionada && (
        <ModalAsignaturas
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          asignatura={asignaturaSeleccionada}
        />
      )}
    </div>
  )
}
