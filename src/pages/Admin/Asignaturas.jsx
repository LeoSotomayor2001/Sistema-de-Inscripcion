
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { Spinner } from "../../components/Spinner";
import { ModalAsignaturas } from "../../components/ModalAsignaturas";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { useAdmin } from "../../Hooks/UseAdmin";
export const Asignaturas = () => {

  const { fetchAsignaturas, asignaturas, loading } = useAdmin()
  const [modalIsOpen, setIsOpen] = useState(false);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

  const openModal = (asignatura = null) => {
    setAsignaturaSeleccionada(asignatura);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAsignaturaSeleccionada(null);
  }
  const deleteAsignatura = async (id) => {
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
        const url = `${import.meta.env.VITE_API_URL}/asignaturas/${id}`
        const response = await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        toast.success(response.data.message)
        fetchAsignaturas()
      }
      catch (error) {
        toast.error(error.response.data.error)
      }
    }
  }
  useEffect(() => {
    fetchAsignaturas()
    document.title = 'Asignaturas'
  }, [])

  if (loading) {
    return <Spinner />
  }
  return (
    <div>
      <h1 className="text-3xl text-center my-5">Asignaturas</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#4b0082' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asignatura</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripcion</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Periodo Escolar</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
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
                    <Button variant="contained" color="primary" onClick={() => openModal(asignatura)}>Editar</Button>
                    <Button variant="contained" color="error" onClick={() => deleteAsignatura(asignatura.id)}>Borrar</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
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
