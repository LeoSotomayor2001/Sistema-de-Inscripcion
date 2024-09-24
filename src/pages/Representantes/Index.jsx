import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Spinner } from "../../components/Spinner"
import '../../components/Spinner.css'
import { Link } from "react-router-dom"
export const Index = () => {
    const token = localStorage.getItem("token")
    const representante = JSON.parse(localStorage.getItem("representante"))
    const [listadoEstudiantes, setListadoEstudiantes] = useState([])
    const [loading, setLoading] = useState(true)
    const mostrarEstudiantes = async () => {
        try {

            const url = "http://127.0.0.1:8000/api/estudiantes"
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setListadoEstudiantes(response.data.data)
        } catch (error) {
            console.error("Error al cargar los estudiantes:", error)
            toast.error("Error al cargar los estudiantes. Intenta nuevamente.")
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        mostrarEstudiantes()
    }, [])
    if (loading) {
        return <Spinner />
    }
    const estudiantesFiltrados = listadoEstudiantes.filter(estudiante => estudiante.representante && estudiante.representante.id === representante.id);
    return (
        <>
            <header className="my-5">
                <ul className="flex flex-col md:flex-row justify-center gap-4 items-center p-4">
                    <li>
                        <Link
                            to={"/registrar-estudiante"}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                        >
                            Registrar estudiante
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={"/ver-estudiantes"}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                        >
                            Ver estudiantes inscritos
                        </Link>
                    </li>
                </ul>

            </header>

            <div>
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2">Tus representados:</h2>

                {estudiantesFiltrados.length > 0 ? (
                    <ul>
                        {estudiantesFiltrados.map((estudiante) => (
                            <li
                                key={estudiante.id}
                                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-lg shadow-md border border-gray-200 mb-4"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {estudiante.name} {estudiante.apellido}
                                    </div>
                                    <span className="text-gray-500 text-sm md:ml-4">Cédula: {estudiante.cedula}</span>
                                </div>
                                <div className="text-gray-500 text-sm mt-2 md:mt-0">
                                    Fecha de Nacimiento: {new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-ES')}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No tienes estudiantes representados.</p>
                )}
            </div>
        </>
    )
}
