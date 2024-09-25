import PreinscripcionForm from "../Estudiantes/PreinscripcionForm"

export const PreinscribirEstudiante = () => {
    const representante=JSON.parse(localStorage.getItem("representante"));
  return (
    <div>
      <PreinscripcionForm representanteId={representante.id} />
    </div>
  )
}

