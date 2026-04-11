import { useEffect, useState } from 'react'
import { agendarCita, solicitarCita, getMisCitas, getCitasByPatient, getSlotsDisponibles } from '../../api/citas'
import { getDoctors } from '../../api/doctors'
import { getPatients } from '../../api/patients'
import type { Cita, CitaRequest, Doctor, Patient } from '../../types'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'

const estadoColors: Record<string, string> = {
    PENDIENTE: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    CONFIRMADA: 'bg-green-900 text-green-300 border-green-700',
    CANCELADA: 'bg-red-900 text-red-300 border-red-700',
    COMPLETADA: 'bg-blue-900 text-blue-300 border-blue-700',
}

export const CitasPage = () => {
    const { user } = useAuth()
    const isPaciente = user?.role === 'PACIENTE'
    const [citas, setCitas] = useState<Cita[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [slots, setSlots] = useState<string[]>([])
    const [showModal, setShowModal] = useState(false)
    const { register, handleSubmit, watch, reset } = useForm<CitaRequest>()

    const watchDoctor = watch('doctorId')
    const watchFecha = watch('fecha')

    const load = async () => {
        if (isPaciente) {
            const res = await getMisCitas()
            setCitas(res.data)
        } else {
            // ADMIN/RECEPCIONISTA ven citas del primer paciente por defecto
            setCitas([])
        }
    }

    useEffect(() => {
        load()
        getDoctors().then(r => setDoctors(r.data))
        if (!isPaciente) getPatients().then(r => setPatients(r.data.content))
    }, [])

    useEffect(() => {
        if (watchDoctor && watchFecha) {
            getSlotsDisponibles(Number(watchDoctor), watchFecha)
                .then(r => setSlots(r.data.slotsDisponibles || []))
                .catch(() => setSlots([]))
        }
    }, [watchDoctor, watchFecha])

    const onSubmit = async (data: CitaRequest) => {
        const payload = { ...data, doctorId: Number(data.doctorId), patientId: Number(data.patientId) }
        if (isPaciente) await solicitarCita(payload)
        else await agendarCita(payload)
        setShowModal(false)
        reset()
        load()
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-100">
                    {isPaciente ? '📋 Mis citas' : '📋 Gestión de citas'}
                </h1>
                <Button onClick={() => setShowModal(true)}>
                    {isPaciente ? '+ Solicitar cita' : '+ Agendar cita'}
                </Button>
            </div>

            <div className="grid gap-3">
                {citas.map(c => (
                    <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-slate-100">Dr. {c.nombreDoctor}</p>
                                <p className="text-sm text-slate-400">{c.especialidad}</p>
                                {!isPaciente && <p className="text-sm text-slate-400">Paciente: {c.nombrePaciente}</p>}
                                <p className="text-sm text-slate-300 mt-1">📅 {c.fecha} · ⏰ {c.horaInicio}</p>
                                <p className="text-xs text-slate-500 mt-1">Motivo: {c.motivoConsulta}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${estadoColors[c.estado]}`}>
                                {c.estado}
                            </span>
                        </div>
                    </div>
                ))}
                {citas.length === 0 && <p className="text-slate-500 text-sm">No hay citas registradas.</p>}
            </div>

            {showModal && (
                <Modal title={isPaciente ? 'Solicitar cita' : 'Agendar cita'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        {!isPaciente && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-slate-400">Paciente</label>
                                <select {...register('patientId', { required: true })}
                                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100">
                                    <option value="">-- Selecciona paciente --</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-400">Doctor</label>
                            <select {...register('doctorId', { required: true })}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100">
                                <option value="">-- Selecciona doctor --</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.nombreCompleto} · {d.especialidad}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-400">Fecha</label>
                            <input type="date" {...register('fecha', { required: true })}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100" />
                        </div>
                        {slots.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-slate-400">Hora disponible</label>
                                <select {...register('horaInicio', { required: true })}
                                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100">
                                    <option value="">-- Selecciona hora --</option>
                                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-400">Motivo de consulta</label>
                            <textarea {...register('motivoConsulta', { required: true })}
                                rows={3}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none focus:outline-none focus:border-indigo-500" />
                        </div>
                        <Button type="submit">{isPaciente ? 'Solicitar' : 'Agendar'}</Button>
                    </form>
                </Modal>
            )}
        </div>
    )
}