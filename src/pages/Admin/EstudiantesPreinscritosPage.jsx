
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import { TablaEstudiantesPreinscritos } from "../../components/TablaEstudiantesPreinscritos";
import { useAdmin } from "../../Hooks/UseAdmin";

export const EstudiantesPreinscritosPage = () => {


  const { loading, inscripciones, obtenerEstudiantes } = useAdmin();
  useEffect(() => {
    obtenerEstudiantes();
    document.title = "Inscripciones";
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <h1 className="text-3xl text-center my-3">Lista de Estudiantes Inscritos</h1>
      <TablaEstudiantesPreinscritos inscripciones={inscripciones} admin={true} />
    </>
  )
}
