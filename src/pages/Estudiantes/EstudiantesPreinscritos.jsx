import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Spinner';
import { TablaEstudiantesPreinscritos } from '../../components/TablaEstudiantesPreinscritos';

const EstudiantesPreinscritos = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerEstudiantes = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const representante = JSON.parse(localStorage.getItem("representante"));
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/representantes/${representante.id}/inscripciones`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInscripciones(response.data.inscripciones);
            } catch (error) {
                console.error(error);
                toast.error("Error al obtener los estudiantes preinscritos");
            } finally {
                setLoading(false);
            }
        };

        obtenerEstudiantes();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <TablaEstudiantesPreinscritos inscripciones={inscripciones} />
    );
};

export default EstudiantesPreinscritos;
