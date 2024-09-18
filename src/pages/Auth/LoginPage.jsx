import { Link } from "react-router-dom"

export const LoginPage = () => {
    return (
        <div className="relative">
            <div className="absolute inset-x-0 top-0 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-t-lg">
                <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
            </div>
            <form className="bg-white p-6 rounded-lg shadow-xl">
                <div className="">
                    <div className="my-2">
                        <label htmlFor="email" className="mb-2 block uppercase font-bold">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Ej: 8Tq5J@example.com"
                            className="border p-3 w-full rounded-lg"
                        />
                    </div>
                    <div className="my-2">
                        <label htmlFor="password" className="mb-2 block uppercase font-bold">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            className="border p-3 w-full rounded-lg"
                        />
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
