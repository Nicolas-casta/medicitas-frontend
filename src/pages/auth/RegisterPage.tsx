import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import type { RegisterRequest } from '../../types'

export const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>()
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (data: RegisterRequest) => {
        try {
            const res = await registerApi(data)
            loginUser(res.data.accessToken, res.data.refreshToken)
            navigate('/doctors')
        } catch {
            alert('Error al registrarse. Verifica los datos.')
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center py-8">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                <h1 className="text-2xl font-bold text-indigo-400 mb-1">Crear cuenta</h1>
                <p className="text-slate-400 text-sm mb-6">Regístrate como paciente</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Nombre" register={register('nombre', { required: true })} error={errors.nombre?.message} />
                        <Input label="Apellido" register={register('apellido', { required: true })} error={errors.apellido?.message} />
                    </div>
                    <Input label="Documento" register={register('documento', { required: true })} error={errors.documento?.message} />
                    <Input label="Email" type="email" register={register('email', { required: true })} error={errors.email?.message} />
                    <Input label="Teléfono" register={register('telefono', { required: true })} error={errors.telefono?.message} />
                    <Input label="Fecha de nacimiento" type="date" register={register('fechaNacimiento', { required: true })} error={errors.fechaNacimiento?.message} />
                    <Input label="Contraseña" type="password" register={register('password', { required: true, minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} error={errors.password?.message} />
                    <Button type="submit" disabled={isSubmitting} className="mt-2">
                        {isSubmitting ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </form>

                <p className="text-slate-500 text-sm mt-4 text-center">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-indigo-400 hover:underline">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}