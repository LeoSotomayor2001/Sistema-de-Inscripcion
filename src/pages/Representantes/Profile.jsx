import { useEffect, useState } from "react";
import { ModalEditarRepre } from "../../components/ModalEditarRepre";

// Estilos personalizados para el modal

// Asegúrate de que el elemento root sea correcto


export const Profile = () => {
  const representante = JSON.parse(localStorage.getItem("representante"));
  const imageUrl = `${import.meta.env.VITE_API_URL}/imagen/${representante.image}`;

  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    document.title = "Sistema de Inscripción - Perfil";

  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">Perfil</h2>

      <div className="w-full md:w-2/3 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <img
            className="w-32 h-32 md:w-44 md:h-44 mb-4 rounded-full shadow-lg"
            src={representante.image ? `${imageUrl}` : "img/usuario.svg"}
            alt="Profile"
          />
          <button title="Editar Perfil" onClick={openModal} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 md:w-8 md:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center justify-center mt-4">
            <h5 className="mb-1 text-lg md:text-2xl font-medium text-gray-900">
              {representante.name + " " + representante.apellido}
            </h5>
            <span className="text-sm md:text-xl text-gray-500 dark:text-gray-400">
              Correo: {representante.email}
            </span>
            <span className="text-sm md:text-xl text-gray-500 dark:text-gray-400">
              Cédula: {representante.cedula}
            </span>
            <span className="text-sm md:text-xl text-gray-500 dark:text-gray-400">
              Teléfono: {representante.telefono}
            </span>
            <span className="text-sm md:text-xl text-gray-500 dark:text-gray-400">
              Ciudad: {representante.ciudad}
            </span>
            <span className="text-sm md:text-xl text-gray-500 dark:text-gray-400">
              Dirección: {representante.direccion}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalEditarRepre modalIsOpen={modalIsOpen} closeModal={closeModal} representante={representante} />
    </div>

  );
};
