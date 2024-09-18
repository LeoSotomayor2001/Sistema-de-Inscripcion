import { Link } from "react-router-dom"

export const RegisterPage = () => {
    return (
        <div className="relative">
            <div className="absolute inset-x-0 top-0 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-t-lg">
                <h1 className="text-2xl font-bold text-center">Registrarse</h1>
            </div>
            <form className="bg-white p-6 rounded-lg shadow-xl">
                <div className="grid grid-cols-2 gap-3">
                    <div className="my-2">
                        <label htmlFor="name" className="mb-2 block uppercase font-bold">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Ej: Ana"
                            className="border p-3 w-full rounded-lg"
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="apellido" className="mb-2 block uppercase font-bold">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            placeholder="Ej: Perez"
                            className="border p-3 w-full rounded-lg"
                        />
                    </div>

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
                        <label htmlFor="cedula" className="mb-2 block uppercase font-bold">Cedula</label>
                        <input type="number" id="cedula" name="cedula" placeholder="Ej: 28456215" className="border p-3 w-full rounded-lg" />

                    </div>

                    <div className="my-2">
                        <label htmlFor="password" className="mb-2 block uppercase font-bold">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            className="border p-3 w-full rounded-lg"
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="password_confirmation" className="mb-2 block uppercase font-bold">Repetir Contraseña</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            placeholder="********"
                            className="border p-3 w-full rounded-lg"
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
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="ciudad" className="mb-2 block uppercase font-bold">Ciudad </label>
                        <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            placeholder="Ej: Lezama"
                            className="border p-3 w-full rounded-lg"
                        />
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
                    ></textarea>
                </div>


                <input type="submit" value="Registrar" className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-lg hover:bg-indigo-700 cursor-pointer" />
                <Link to="/auth" className="block text-center my-3 text-indigo-600">
                    ¿Ya tienes cuenta? Inicia Sesion
                </Link>
            </form>
        </div>
    )
}
