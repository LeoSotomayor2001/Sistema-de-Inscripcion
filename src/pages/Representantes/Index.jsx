import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const Index = () => {
    const token = localStorage.getItem("token")
    const representante = JSON.parse(localStorage.getItem("representante"))
    const [listadoEstudiantes, setListadoEstudiantes] = useState([])

    const mostrarEstudiantes = async () => {
        try {
            if (!token) {
                throw new Error("Token no disponible. Por favor inicia sesión nuevamente.")
            }

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
    }

    useEffect(() => {
        mostrarEstudiantes()
    }, [])

    return (
        <>
            <header className="my-5">
                <ul className="flex justify-center gap-4">
                    <li>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Registrar estudiante
                        </button>
                    </li>
                    <li>
                        <button className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
                            Ver estudiantes inscritos
                        </button>
                    </li>
                </ul>
            </header>

            <div>
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2">Tus representados:</h2>

                {listadoEstudiantes.length > 0 ? (
                    <ul>
                        {/* Filtramos los estudiantes que tienen el mismo representante.id */}
                        {listadoEstudiantes
                            .filter(estudiante => estudiante.representante && estudiante.representante.id === representante.id)
                            .map((estudiante) => (
                                <li key={estudiante.id} className="font-semibold border-b border-gray-500">
                                    {estudiante.name} {estudiante.apellido}
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p>No tienes estudiantes representados.</p>
                )}
            </div>
        </>
    )
}
