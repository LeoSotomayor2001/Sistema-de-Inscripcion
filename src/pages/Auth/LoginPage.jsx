import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import {  toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const LoginPage = () => {
    const initialState={
        email: "",
        password: ""
    }
    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState({})
    
    useEffect(() => {
        document.title = "Login";
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const onSubmit = async(e) => {
        e.preventDefault();
        try {
            const url="http://127.0.0.1:8000/api/login"
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response)
            toast.success('Bienvenido, ' + response.data.representante.name)
        } catch (error) {
            console.log(error)
            if(error.response.data.fail){
                toast.error(error.response.data.fail[0])
                
            }
            else{
                setErrors(error.response.data.errors);
                setTimeout(() => {
                    setErrors([]);
                }, 2000);

            }
        }
    }
    return (
        <div className="relative">
            <div className="absolute inset-x-0 top-0 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-t-lg">
                <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
            </div>
            <form className="bg-white p-6 rounded-lg shadow-xl" onSubmit={onSubmit}>
                
                <div className="">
                    <div className="my-2">
                        <label htmlFor="email" className="mb-2 block uppercase font-bold">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Ej: 8Tq5J@example.com"
                            className="border p-3 w-full rounded-lg"
                            onChange={handleChange}
                            value={formData.email}
                        />
                        {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
                    </div>
                    <div className="my-2">
                        <label htmlFor="password" className="mb-2 block uppercase font-bold">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            className="border p-3 w-full rounded-lg"
                            onChange={handleChange}
                            value={formData.password}
                        />
                        {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
                    </div>
                </div>
                <input type="submit" value="Entrar" className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-lg hover:bg-indigo-700 cursor-pointer" />
                <Link to="/auth/registro" className="block text-center my-3 text-indigo-600">
                    ¿No tienes cuenta? Registrate
                </Link>
            </form>
        </div>

    )
}
