
import { useEffect } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { useEstudiantes } from "../../Hooks/UseEstudiantes";
import { Spinner } from "../../components/Spinner";
export const Asignaturas = () => {
    
   const { fetchAsignaturas, asignaturas,loading } = useEstudiantes()
    useEffect(() => {
      fetchAsignaturas()
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
                  <TableCell>
                    <Button variant="contained" sx={{ mr: 2 }}>Edit</Button>
                    <Button variant="contained" color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ): (
                <TableRow>
                <TableCell colSpan={4} align="center">
                    <Typography variant="h6" color="textSecondary">
                        No hay asignaturas registradas.
                    </Typography>
                </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
