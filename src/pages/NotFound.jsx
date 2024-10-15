import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate=useNavigate();
    const [contador, setContador] = useState(3);

    useEffect(() => {
        const intervalo = setInterval(() => {
          setContador((prevContador) => prevContador - 1);
        }, 1000);
    
        if (contador === 0) {
          navigate(-1);
        }
    
        return () => clearInterval(intervalo);
      }, [contador, navigate]);
   
  return (
    <div className='bg-gray-700 absolute top-0 bottom-0 right-0 left-0'>
      <h1 className='text-3xl text-white font-bold text-center'>Página No Encontrada</h1>
      <p className='text-white text-center'>La pagina que intentas buscar no existe</p>
      <img src="../img/404.svg" alt="" className='w-96 mx-auto'/>
      <p className='text-white text-center'>Serás redirigido a la pagina anterior en {contador}...</p>
    </div>
  )
}
