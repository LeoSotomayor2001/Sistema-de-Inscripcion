import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export const AuthLayout = () => {
    return (
        <main className='flex items-center justify-center h-screen bg-univercity bg-cover bg-center'>
            <div className='w-full max-w-xl px-4'>
                <Outlet />
                <ToastContainer/>
            </div>
        </main>

    )
}
