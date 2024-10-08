import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { ReactTyped } from "react-typed";
export const AuthLayout = () => {
    const navigate = useNavigate()
    const representante = JSON.parse(localStorage.getItem("representante"))
    const token = localStorage.getItem("token")
    const usuario = JSON.parse(localStorage.getItem("usuario"))


    useEffect(() => {
        if(!token) {
            localStorage.clear()
            return
        }

        if (representante) {
            navigate("/")
        }

        if(usuario?.admin === 1){
            navigate("/index")
        }

    }, [token, representante, navigate, usuario])

    return (
        <main className='flex items-center justify-center h-screen bg-univercity bg-cover bg-center flex-col '>
            <div className="relative p-10 bg-white/30 backdrop-blur-lg border border-white/50 rounded-xl shadow-lg mb-10">
                <h1 className="text-5xl font-extrabold text-center text-indigo-900 animate-pulse drop-shadow-2xl">
                    <span className="bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 text-transparent bg-clip-text">
                        <ReactTyped
                            strings={["Bienvenidos", "Bienvenidas", "Welcome"]}
                            typeSpeed={60}
                            backSpeed={60}
                            loop
                        />
                    </span>
                </h1>
            </div>


            <div className='w-full max-w-xl px-4'>
                <Outlet />
                <ToastContainer />
            </div>
        </main>

    )
}
