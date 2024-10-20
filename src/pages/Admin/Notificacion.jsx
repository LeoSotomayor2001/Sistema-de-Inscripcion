import { Box, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { Link, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdmin } from '../../Hooks/UseAdmin';
import { Spinner } from '../../components/Spinner';

export const Notificacion = () => {
    const { notificaciones, notificacionesError, mutateNotificaciones } = useAdmin();
    const handleRead = async (notificacionId) => {
        const url = `${import.meta.env.VITE_API_URL}/notificaciones/mark-as-read/${notificacionId}`;
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(url, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success(response.data.mensaje);
            mutateNotificaciones(); // Refrescar las notificaciones después de marcar como leída
        } catch (error) {
            toast.error(error.response.data.mensaje);
        }
    };

    if (!notificaciones || notificacionesError) {
        return <Spinner />;
    }


    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding={2}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Notificaciones
            </Typography>
            {notificaciones?.length > 0 ? (
                notificaciones.map((notificacion) => (
                    <Paper
                        key={notificacion.id}
                        elevation={3}
                        style={{
                            margin: '10px',
                            padding: '10px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body1">
                            {notificacion.data.mensaje}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Link
                                component={RouterLink}
                                to={`/index/inscripciones`}
                                style={{ textDecoration: 'none', color: '#1e88e5' }}
                            >
                                Ver inscripciones
                            </Link>
                            <Button variant="contained" color="primary" onClick={() => handleRead(notificacion.id)}>
                                Marcar como leída
                            </Button>
                        </Box>
                    </Paper>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No hay notificaciones
                </Typography>
            )}
        </Box>
    );
};
