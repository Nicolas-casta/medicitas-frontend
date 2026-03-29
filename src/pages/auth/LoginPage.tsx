import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import type { LoginRequest } from '../../types'

export const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>()
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (data: LoginRequest) => {
        try {
            const res = await login(data)
            loginUser(res.data.accessToken, res.data.refreshToken)
            navigate('/doctors')
        } catch {
            alert('Credenciales inválidas')
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700">
                <h1 className="text-2xl font-bold text-indigo-400 mb-1">MediCitas</h1>
                <p className="text-slate-400 text-sm mb-6">Inicia sesión para continuar</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input label="Email" type="email" placeholder="doctor@clinica.com"
                        register={register('email', { required: 'Email requerido' })}
                        error={errors.email?.message} />
                    <Input label="Contraseña" type="password" placeholder="••••••••"
                        register={register('password', { required: 'Contraseña requerida' })}
                        error={errors.password?.message} />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                    </Button>
                </form>

                <p className="text-slate-500 text-sm mt-4 text-center">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-indigo-400 hover:underline">Regístrate</Link>
                </p>
            </div>
        </div>
    )
}