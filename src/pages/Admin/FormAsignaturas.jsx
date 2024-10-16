import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { useEstudiantes } from "../../Hooks/UseEstudiantes";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../Hooks/UseAdmin";

export const FormAsignaturas = () => {
    const initialState = {
        nombre: '',
        descripcion: '',
        codigo: '',
    };
    const { getAnosEscolares, anosEscolares } = useEstudiantes();
    const {fetchYears,years}= useAdmin();
    const [selectedAnoEscolar, setSelectedAnoEscolar] = useState('');
    const [yearId, setYearId] = useState('');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(initialState);
    const navigate= useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    useEffect(() => {
        getAnosEscolares();
        fetchYears();
    }, [])

    const handleSubmit =async (e) => {
        e.preventDefault()
        const token=localStorage.getItem('token')
        const url = `${import.meta.env.VITE_API_URL}/asignaturas`

        const data={
            nombre:formData.nombre,
            descripcion:formData.descripcion,
            codigo:formData.codigo,
            year_id:yearId,
            ano_escolar_id:selectedAnoEscolar
        }
        
        try {
            const response =await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            toast.success(response.data)
            setFormData(initialState)
            setSelectedAnoEscolar('')
            setYearId('')
            
            navigate('/index/asignaturas')
                
           
        } catch (error) {
            if(error.response.data.errors){
                setErrors(error.response.data.errors)
                setTimeout(() => {
                    setErrors([])
                }, 3000);
            }
            else if(error.response.data.error){
                toast.error(error.response.data.error)
            }
            else{
                toast.error('Ocurrio un error en el servidor')
            }
            console.log(error)
            
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 800 }}
                className='w-full max-w-lg p-8 bg-white shadow-md rounded-lg'
                noValidate
            >
                <h1 className='text-2xl mb-4 text-center uppercase'>Registrar Asignatura</h1>

                <TextField
                    label="Nombre"
                    variant="outlined"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                />
                {errors?.nombre && <p className="text-red-500">{errors?.nombre[0]}</p>}
                <TextField
                    label="Descripción"
                    variant="outlined"
                    name="descripcion"
                    onChange={handleChange}
                    value={formData.descripcion}
                    fullWidth
                />
                {errors?.descripcion && <p className="text-red-500">{errors?.descripcion[0]}</p>}
                <TextField
                    label="Código"
                    variant="outlined"
                    name="codigo"
                    onChange={handleChange}
                    value={formData.codigo}
                    fullWidth
                />
                {errors?.codigo && <p className="text-red-500">{errors?.codigo[0]}</p>}
                <Box>
                    <TextField
                        fullWidth
                        select
                        label="Año Académico"
                        value={yearId}
                        onChange={(e) => setYearId(e.target.value)}
                        variant="outlined"

                    >
                        <MenuItem value="">
                            <em>Seleccione un año académico</em>
                        </MenuItem>
                        {years.map((year) => (
                            <MenuItem key={year.id} value={year.id}>
                                {year.year} - {year.descripcion}
                            </MenuItem>
                        ))}
                    </TextField>
                    {errors?.year_id && <p className="text-red-500">{errors?.year_id[0]}</p>}
                </Box>


                <FormControl fullWidth margin="normal">
                    <InputLabel id="ano-escolar-label">Periodo Escolar</InputLabel>
                    <Select
                        labelId="ano-escolar-label"
                        label="Periodo Escolar"
                        value={selectedAnoEscolar}
                        onChange={(e) => setSelectedAnoEscolar(e.target.value)}
                    >
                        {anosEscolares.map((ano) => (
                            <MenuItem key={ano.id} value={ano.id}>
                                {ano.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                        {errors?.ano_escolar_id && <p className="text-red-500">{errors?.ano_escolar_id[0]}</p>}
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Registrar Asignatura
                </Button>

            </Box>
        </div>
    )
}
