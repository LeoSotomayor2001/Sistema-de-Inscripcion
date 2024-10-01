import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import {  toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const LoginPage = () => {
    const initialState={
        email: "",
        password: "",
        user_type: "representante"
    }
    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState({})
    const navigate=useNavigate()
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
            const { token } = response.data
            if(response.data.representante){
                const { representante } = response.data
                localStorage.setItem('representante', JSON.stringify(response.data.representante))
                localStorage.setItem('token', token)
                toast.success('Bienvenido, ' + representante.name)
                setTimeout(() => {
                    navigate('/')
                }, 1500);
            }
            else{
                const { usuario } = response.data
                localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
                localStorage.setItem('token', token)
                toast.success('Bienvenido, ' + usuario.name)
                setTimeout(() => {
                    navigate('/index')
                }, 1500);
            }
            
        } catch (error) {
            if(!error.response){
                toast.error('Ocurrio un error en el servidor')
            }
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
                    <div className="my-2">
                        <label htmlFor="user_type" className="mb-2 block uppercase font-bold">Tipo de usuario</label>
                        <select
                            id="user_type"
                            name="user_type"
                            className="border p-3 w-full rounded-lg"
                            onChange={handleChange}
                            value={formData.user_type}
                        >
                            <option value="representante">Representante</option>
                            <option value="administrador">Administrador</option>
                        </select>
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
