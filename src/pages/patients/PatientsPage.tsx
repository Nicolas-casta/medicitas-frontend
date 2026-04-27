import { useEffect, useState } from 'react'
import { getPatients, createPatient, updatePatient, deletePatient } from '../../api/patients'
import type { Patient, PatientRequest } from '../../types'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { useForm } from 'react-hook-form'

export const PatientsPage = () => {
    const [patients, setPatients] = useState<Patient[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Patient | null>(null)
    const [search, setSearch] = useState('')
    const { register, handleSubmit, reset, setValue } = useForm<PatientRequest>()

    const load = async () => {
        const res = await getPatients(search || undefined)
        setPatients(res.data.content)
    }

    useEffect(() => { load() }, [search])

    const openCreate = () => { setEditing(null); reset(); setShowModal(true) }
    const openEdit = (p: Patient) => {
        setEditing(p)
        setValue('nombre', p.nombre)
        setValue('apellido', p.apellido)
        setValue('documento', p.documento)
        setValue('email', p.email)
        setValue('telefono', p.telefono)
        setValue('fechaNacimiento', p.fechaNacimiento)
        setValue('direccion', p.direccion)
        setValue('eps', p.eps)
        setValue('tipoSangre', p.tipoSangre)
        setShowModal(true)
    }

    const onSubmit = async (data: PatientRequest) => {
        if (editing) await updatePatient(editing.id, data)
        else await createPatient(data)
        setShowModal(false)
        load()
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Eliminar este paciente?')) {
            await deletePatient(id)
            load()
        }
    }

    const estadoColor: Record<string, string> = {
        A: 'bg-green-900 text-green-300',
        B: 'bg-blue-900 text-blue-300',
        AB: 'bg-purple-900 text-purple-300',
        O: 'bg-yellow-900 text-yellow-300',
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Pacientes</h1>
                <Button onClick={openCreate}>+ Nuevo paciente</Button>
            </div>

            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />

            <div className="grid gap-3">
                {patients.map(p => (
                    <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-slate-100">{p.nombre} {p.apellido}</p>
                            <p className="text-sm text-slate-400"> {p.documento} ·  {p.email} ·  {p.telefono}</p>
                            <div className="flex gap-2 mt-1">
                                {p.eps && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">EPS: {p.eps}</span>}
                                {p.tipoSangre && <span className={`text-xs px-2 py-0.5 rounded-full ${estadoColor[p.tipoSangre.replace('+', '').replace('-', '')] || 'bg-slate-700 text-slate-300'}`}> {p.tipoSangre}</span>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => openEdit(p)}>Editar</Button>
                            <Button variant="danger" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                        </div>
                    </div>
                ))}
                {patients.length === 0 && <p className="text-slate-500 text-sm">No se encontraron pacientes.</p>}
            </div>

            {showModal && (
                <Modal title={editing ? 'Editar paciente' : 'Nuevo paciente'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Nombre" register={register('nombre', { required: true })} />
                            <Input label="Apellido" register={register('apellido', { required: true })} />
                        </div>
                        <Input label="Documento" register={register('documento', { required: true })} />
                        <Input label="Email" type="email" register={register('email', { required: true })} />
                        <Input label="Teléfono" register={register('telefono', { required: true })} />
                        <Input label="Fecha nacimiento" type="date" register={register('fechaNacimiento', { required: true })} />
                        <Input label="Dirección" register={register('direccion')} />
                        <Input label="EPS" register={register('eps')} />
                        <Input label="Tipo de sangre" placeholder="A+, B-, O+..." register={register('tipoSangre')} />
                        <Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button>
                    </form>
                </Modal>
            )}
        </div>
    )
}