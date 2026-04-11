import { useEffect, useState } from 'react'
import { getMyProfile, updateMyProfile } from '../../api/patients'
import type { Patient } from '../../types'
import { useForm } from 'react-hook-form'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export const MyProfilePage = () => {
    const [profile, setProfile] = useState<Patient | null>(null)
    const [editing, setEditing] = useState(false)
    const { register, handleSubmit, reset } = useForm<Partial<Patient>>()

    const load = async () => {
        const res = await getMyProfile()
        setProfile(res.data)
        reset(res.data)
    }

    useEffect(() => { load() }, [])

    const onSubmit = async (data: Partial<Patient>) => {
        await updateMyProfile({ email: data.email, telefono: data.telefono, direccion: data.direccion })
        setEditing(false)
        load()
    }

    if (!profile) return <p className="text-slate-400">Cargando...</p>

    return (
        <div className="max-w-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-100">👤 Mi perfil</h1>
                <Button variant="ghost" onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancelar' : 'Editar'}
                </Button>
            </div>

            {!editing ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">Nombre completo</span>
                        <span className="text-slate-100">{profile.nombre} {profile.apellido}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">Documento</span>
                        <span className="text-slate-100">{profile.documento}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">Email</span>
                        <span className="text-slate-100">{profile.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">Teléfono</span>
                        <span className="text-slate-100">{profile.telefono}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500">Dirección</span>
                        <span className="text-slate-100">{profile.direccion || '—'}</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500">EPS</span>
                            <span className="text-slate-100">{profile.eps || '—'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500">Tipo de sangre</span>
                            <span className="text-slate-100">{profile.tipoSangre || '—'}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-4">
                    <Input label="Email" type="email" register={register('email')} />
                    <Input label="Teléfono" register={register('telefono')} />
                    <Input label="Dirección" register={register('direccion')} />
                    <Button type="submit">Guardar cambios</Button>
                </form>
            )}
        </div>
    )
}