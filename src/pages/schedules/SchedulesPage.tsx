import { useEffect, useState } from 'react'
import { getDoctors } from '../../api/doctors'
import { getSchedules, createSchedule, getSlots } from '../../api/schedules'
import type { Doctor, Schedule, ScheduleRequest, Slot } from '../../types'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { useForm } from 'react-hook-form'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAYS_ES: Record<string, string> = {
    MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves', FRIDAY: 'Viernes', SATURDAY: 'Sábado', SUNDAY: 'Domingo'
}

export const SchedulesPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [slots, setSlots] = useState<Slot[]>([])
    const [selectedDate, setSelectedDate] = useState('')
    const [showModal, setShowModal] = useState(false)
    const { register, handleSubmit, reset } = useForm<ScheduleRequest>()

    useEffect(() => {
        getDoctors().then(r => setDoctors(r.data))
    }, [])

    useEffect(() => {
        if (selectedDoctor) getSchedules(selectedDoctor).then(r => setSchedules(r.data))
    }, [selectedDoctor])

    useEffect(() => {
        if (selectedDoctor && selectedDate)
            getSlots(selectedDoctor, selectedDate).then(r => setSlots(r.data))
    }, [selectedDoctor, selectedDate])

    const onSubmit = async (data: ScheduleRequest) => {
        if (!selectedDoctor) return
        await createSchedule(selectedDoctor, { ...data, duracionCitaMinutos: Number(data.duracionCitaMinutos) })
        setShowModal(false)
        reset()
        getSchedules(selectedDoctor).then(r => setSchedules(r.data))
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Horarios y Slots</h1>
                {selectedDoctor && <Button onClick={() => setShowModal(true)}>+ Agregar horario</Button>}
            </div>

            <div className="mb-6">
                <label className="text-sm text-slate-400 block mb-1">Seleccionar doctor</label>
                <select onChange={e => setSelectedDoctor(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100">
                    <option value="">-- Selecciona un doctor --</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.nombreCompleto}</option>)}
                </select>
            </div>

            {selectedDoctor && (
                <>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-200 mb-3">Horarios configurados</h2>
                        <div className="grid gap-2">
                            {schedules.map(s => (
                                <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex gap-4 text-sm">
                                    <span className="text-indigo-400 font-medium">{DAYS_ES[s.diaSemana]}</span>
                                    <span className="text-slate-300">{s.horaInicio} - {s.horaFin}</span>
                                    <span className="text-slate-400">Cada {s.duracionCitaMinutos} min</span>
                                </div>
                            ))}
                            {schedules.length === 0 && <p className="text-slate-500 text-sm">Sin horarios configurados.</p>}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-200 mb-3">Ver slots disponibles</h2>
                        <input type="date" value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 mb-4" />
                        <div className="flex flex-wrap gap-2">
                            {slots.map((slot, i) => (
                                <div key={i} className={`px-3 py-2 rounded-lg text-sm font-medium ${slot.disponible
                                        ? 'bg-green-900 text-green-300 border border-green-700'
                                        : 'bg-slate-700 text-slate-500 border border-slate-600'
                                    }`}>
                                    {slot.horaInicio} - {slot.horaFin}
                                </div>
                            ))}
                            {selectedDate && slots.length === 0 && (
                                <p className="text-slate-500 text-sm">No hay slots para esta fecha.</p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {showModal && (
                <Modal title="Agregar horario" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-slate-400">Día de la semana</label>
                            <select {...register('diaSemana', { required: true })}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100">
                                {DAYS.map(d => <option key={d} value={d}>{DAYS_ES[d]}</option>)}
                            </select>
                        </div>
                        <Input label="Hora inicio" type="time" register={register('horaInicio', { required: true })} />
                        <Input label="Hora fin" type="time" register={register('horaFin', { required: true })} />
                        <Input label="Duración por cita (minutos)" type="number" register={register('duracionCitaMinutos', { required: true, min: 10 })} />
                        <Button type="submit">Guardar horario</Button>
                    </form>
                </Modal>
            )}
        </div>
    )
}