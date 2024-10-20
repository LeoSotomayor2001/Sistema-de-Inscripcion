import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AdminSidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleLogout = async () => {
        try {
            const currentToken = localStorage.getItem("token");
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
            toast.success(response.data.mensaje);
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setTimeout(() => {
                navigate("/auth");
            }, 1000);
        } catch (error) {
            console.log(error);
            toast.error("Error al cerrar sesión");
        }
    };

    useEffect(() => {
        // Obtener la cantidad de notificaciones no leídas
        const fetchUnreadNotifications = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/notificaciones/unread`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setUnreadCount(response.data); // Establecer la cantidad de notificaciones no leídas
            } catch (error) {
                console.error("Error al obtener notificaciones no leídas", error);
            }
        };

        fetchUnreadNotifications();
    }, []); // Ejecutar una vez al montar el componente

    const items = [
        { text: 'Inicio', icon: <HomeIcon />, url: '/index' },
        { text: 'Estudiantes', icon: <SchoolIcon />, url: 'estudiantes' },
        { text: 'Inscripciones', icon: <AssignmentIcon />, url: 'inscripciones' },
        { text: 'Profesores', icon: <PersonIcon />, url: 'profesores' },
        { text: 'Secciones', icon: <ClassIcon />, url: 'secciones' },
    ];

    const AnotherItems = [
        { text: 'Lista de Asignaturas', icon: <AssignmentIcon />, url: 'asignaturas' },
        { text: 'Registrar Asignatura', icon: <InboxIcon />, url: 'registrar-asignatura' },
        { text: 'Asignar Profesor', icon: <PersonIcon />, url: 'asignatura-profesor' },
        { text: `Notificaciones (${unreadCount.length})`, icon: <NotificationsIcon />, url: 'notificaciones' },
    ];

    const DrawerList = (
        <Box sx={{ width: 300 }} role="presentation">
            <List>
                {items.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={NavLink} to={item.url} onClick={toggleDrawer(false)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <ListItemIcon><InboxIcon /></ListItemIcon>
                    <ListItemText primary="Asignaturas" />
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {AnotherItems.slice(0, 3).map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton component={NavLink} to={item.url}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
            <List>
                {AnotherItems.slice(3).map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={NavLink} to={item.url} onClick={toggleDrawer(false)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <div className="px-3 py-4">
                <button
                    type="button"
                    className="text-xl bg-red-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-red-700 transition-all duration-300 ease-in-out"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>
                <MenuIcon />
                Abrir menú
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};
