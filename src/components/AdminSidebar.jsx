import { useState } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
    const navigate=useNavigate()
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const handleLogout = async() => {
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
    const items = [
        { text: 'Inicio', icon: <HomeIcon />, url: '/index' },
        { text: 'Estudiantes', icon: <SchoolIcon />, url: 'index/estudiantes' },
        { text: 'Inscripciones', icon: <AssignmentIcon />, url: 'index/inscripciones' },
        { text: 'Profesores', icon: <PersonIcon />, url: 'index/profesores' },
        { text: 'Secciones', icon: <ClassIcon />,url: 'index/secciones' },
    ];

    const AnotherItems = [
        { text: 'Asignaturas', icon: <InboxIcon />, url: '/asignaturas' },
        { text: 'Notificaciones', icon: <NotificationsIcon />, url: '/notificaciones' },
    ];

 


    const DrawerList = (
        <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
  
        {/* Lista de navegación */}
        <List>
          {items.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.url}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
  
        <Divider />
  
        {/* Otra lista con acciones */}
        <List>
          {AnotherItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.url} onClick={item.action}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
  
        {/* Botón para cerrar sesión */}
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
    )
}
