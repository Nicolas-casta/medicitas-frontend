import api from './axios'
import type { Cita, CitaRequest } from '../types'

export const agendarCita = (data: CitaRequest) =>
    api.post<Cita>('/citas', data)

export const solicitarCita = (data: CitaRequest) =>
    api.post<Cita>('/citas/solicitar', data)

export const getMisCitas = () =>
    api.get<Cita[]>('/citas/mis-citas')

export const getCitasByPatient = (patientId: number) =>
    api.get<Cita[]>(`/citas/paciente/${patientId}`)

export const getCitasByDoctor = (doctorId: number, fecha: string) =>
    api.get<Cita[]>(`/citas/doctor/${doctorId}`, { params: { fecha } })

export const getSlotsDisponibles = (doctorId: number, fecha: string) =>
    api.get(`/citas/slots-disponibles`, { params: { doctorId, fecha } })