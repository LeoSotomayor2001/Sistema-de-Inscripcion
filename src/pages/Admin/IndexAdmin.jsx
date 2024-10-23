
import { useAdmin } from "../../Hooks/UseAdmin"
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import CustomCard from "../../components/CustomCard";

export const IndexAdmin = () => {

  const { asignaturasContadas, fetchAllAsignaturas, fetchAllStudents, listadoEstudiantes, getAllProfesores, listadoProfesores
    , secciones, getAllSecciones,fetchAllInscripciones,inscripciones,loading
  } = useAdmin();


  useEffect(() => {
    fetchAllAsignaturas()
    fetchAllStudents()
    getAllProfesores()
    getAllSecciones()
    fetchAllInscripciones()
    document.title = "Inicio"
  }, [])


  if (loading) return <Spinner />;
  return (
    <div>
      <h1 className="text-3xl text-center">Inicio</h1>
      <p className="text-center mb-10">Administración</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CustomCard
          image={'img/asignatura.jpeg'}
          title="Imagen Asignatura"
          description={`Hay un total de: ${asignaturasContadas} asignaturas registradas`}
          link={'/index/asignaturas'}
          linkText={'Ver lista de asignaturas'}
        />

        <CustomCard
          image={'img/estudiante.jpeg'}
          title="Imagen Estudiantes"
          description={`Hay un total de: ${listadoEstudiantes} estudiantes registrados`}
          link={'/index/estudiantes'}
          linkText={'Ver lista de estudiantes'}
        />

        <CustomCard
          image={'img/teacher.jpeg'}
          title="Imagen profesores"
          description={`Hay un total de: ${listadoProfesores.length} profesores registrados`}
          link={'/index/profesores'}
          linkText={'Ver lista de profesores'}
        />

        <CustomCard
          image={'img/secciones.jpeg'}
          title="Imagen secciones"
          description={`Hay un total de: ${secciones.length} secciones registradas`}
          link={'/index/secciones'}
          linkText={'Ver lista de secciones'}
        />

      <CustomCard
          image={'img/inscripciones.svg'}
          title="Imagen inscripciones"
          description={`Hay un total de: ${inscripciones} inscripciones registradas`}
          link={'/index/inscripciones'}
          linkText={'Ver lista de inscripciones'}
        />

      </div>
    </div>
  )
}
