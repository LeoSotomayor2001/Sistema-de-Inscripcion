
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, TextField, MenuItem } from '@mui/material';
import { Spinner } from "../../components/Spinner";
import { ModalAsignaturas } from "../../components/ModalAsignaturas";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { useAdmin } from "../../Hooks/UseAdmin";
export const Asignaturas = () => {

  const { fetchAsignaturas, asignaturas, loading, pagination, setAsignaturas, fetchYears, years } = useAdmin()
  const [modalIsOpen, setIsOpen] = useState(false);
  const [yearId, setYearId] = useState('');
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
  const [nombre, setNombre] = useState('');
  const openModal = (asignatura = null) => {
    setAsignaturaSeleccionada(asignatura);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setAsignaturaSeleccionada(null);
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchAsignaturas(newPage); // Cambiar a la página seleccionada
    }
  };



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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_URL}/asignaturas-buscar`;
    try {
        const response = await axios.get(url, {
            params: { nombre, year_id: yearId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setAsignaturas(response.data);
    } catch (error) {
        console.error(error);
    }
};

  useEffect(() => {
    fetchAsignaturas()
    fetchYears()
    document.title = 'Asignaturas'
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return <Spinner />
  }
  return (
    <div>
      <header>
        <h1 className="text-3xl text-center my-5">Asignaturas</h1>
        <form className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-3" onSubmit={handleSubmit}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} width="100%" alignItems="center">
            <TextField
              fullWidth
              id="nombre"
              name="nombre"
              label="Buscar asignaturas por nombre"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { md: '300px' } }}
            />
            <TextField
              fullWidth
              select
              label="Buscar asignaturas por año"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              variant="outlined"
              sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, width: { md: '300px' } }}
            >
              <MenuItem value="">
                <em>Seleccione un año académico</em>
              </MenuItem>
              {years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.year} - {year.descripcion}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: { xs: 2, md: 0 }, width: { xs: '100%', md: 'auto' }, height: 50 }}
            >
              Buscar
            </Button>
          </Box>
        </form>

      </header>

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
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
        >
          Anterior
        </Button>
        <Typography variant="body1" color="textSecondary" mx={2}>
          Página {pagination.current_page} de {pagination.last_page}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.last_page}
        >
          Siguiente
        </Button>
      </Box>
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
