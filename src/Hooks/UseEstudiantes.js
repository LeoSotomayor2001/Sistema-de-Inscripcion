import { useContext } from "react";
import EstudiantesContext from "../Context/EstudiantesProvider";

export const useEstudiantes = () => {
    return useContext(EstudiantesContext);
  };
  