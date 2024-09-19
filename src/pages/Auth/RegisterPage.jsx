import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import {  toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const RegisterPage = () => {
    const initialState = {
        name: '',
        apellido: '',
        email: '',
        cedula: '',
        password: '',
        password_confirmation: '',
        telefono: '',
        ciudad: '',
        direccion: ''
    }
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState([])
    const navigate=useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    useEffect(() => {
        document.title = "Registro";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://127.0.0.1:8000/api/representantes";
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success(response.data.message)
            setFormData(initialState)
            setErrors([])
             navigate('/auth/')
            
            
        } catch (error) {
            if(error.response){
                setErrors(error.response.data.errors)
                setTimeout(() => {
                    setErrors([])
                }, 3000);

            }
            else{
                toast.error('Ocurrio un error en el servidor')
            }
        }

    }

    return (
        <>
            
            <div className="relative">
                <div className="absolute inset-x-0 top-0 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-t-lg">
                    <h1 className="text-2xl font-bold text-center">Registrarse</h1>
                </div>
                <form className="bg-white p-6 rounded-lg shadow-xl" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="my-2">
                            <label htmlFor="name" className="mb-2 block uppercase font-bold">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Ej: Ana"
                                className="border p-3 w-full rounded-lg"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="apellido" className="mb-2 block uppercase font-bold">Apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                placeholder="Ej: Perez"
                                className="border p-3 w-full rounded-lg"
                                value={formData.apellido}
                                onChange={handleChange}
                            />
                            {errors.apellido && <p className="text-red-500">{errors.apellido[0]}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="email" className="mb-2 block uppercase font-bold">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Ej: 8Tq5J@example.com"
                                className="border p-3 w-full rounded-lg"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="cedula" className="mb-2 block uppercase font-bold">Cedula</label>
                            <input
                                type="number"
                                id="cedula"
                                name="cedula"
                                placeholder="Ej: 28456215"
                                className="border p-3 w-full rounded-lg"
                                value={formData.cedula}
                                onChange={handleChange}
                            />
                            {errors.cedula && <p className="text-red-500">{errors.cedula[0]}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="password" className="mb-2 block uppercase font-bold">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="********"
                                className="border p-3 w-full rounded-lg"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="password_confirmation" className="mb-2 block uppercase font-bold">Repetir Contraseña</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder="********"
                                className="border p-3 w-full rounded-lg"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="my-2">
                            <label htmlFor="telefono" className="mb-2 block uppercase font-bold">Telefono </label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                placeholder="Ej: 04261234567"
                                className="border p-3 w-full rounded-lg"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                            {errors.telefono && <p className="text-red-500">{errors.telefono[0]}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="ciudad" className="mb-2 block uppercase font-bold">Ciudad </label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                placeholder="Ej: Lezama"
                                className="border p-3 w-full rounded-lg"
                                value={formData.ciudad}
                                onChange={handleChange}
                            />
                            {errors.ciudad && <p className="text-red-500">{errors.ciudad[0]}</p>}
                        </div>


                    </div>
                    <div className="my-2">
                        <label htmlFor="direccion" className="mb-2 block uppercase font-bold">Direccion </label>
                        <textarea
                            type="text"
                            id="direccion"
                            name="direccion"
                            placeholder="Ej: Calle 1 # 2-3"
                            className="border p-3 w-full rounded-lg"
                            value={formData.direccion}
                            onChange={handleChange}
                        ></textarea>
                        {errors.direccion && <p className="text-red-500">{errors.direccion[0]}</p>}
                    </div>


                    <input type="submit" value="Registrar" className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-lg hover:bg-indigo-700 cursor-pointer" />
                    <Link to="/auth" className="block text-center my-3 text-indigo-600">
                        ¿Ya tienes cuenta? Inicia Sesion
                    </Link>
                </form>
            </div>
        </>
    )
}
