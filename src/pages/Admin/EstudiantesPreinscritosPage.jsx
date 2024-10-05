import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../../components/Spinner";
import { TablaEstudiantesPreinscritos } from "../../components/TablaEstudiantesPreinscritos";

export const EstudiantesPreinscritosPage = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const obtenerEstudiantes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/inscripciones`, {
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
    }
    useEffect(() => {
        obtenerEstudiantes();
        document.title = "Inscripciones";
    }, [])

    if (loading) {
        return <Spinner />
    }

  return (
    <TablaEstudiantesPreinscritos inscripciones={inscripciones} admin={true} obtenerEstudiantes={obtenerEstudiantes} />
  )
}
