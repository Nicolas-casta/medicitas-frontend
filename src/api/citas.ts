import api from './axios'
import type { AtencionRequest, Cita, CitaRequest } from '../types'

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

export const cancelarCita = (id: number, data: { motivoCancelacion: string }) =>
  api.patch(`/citas/${id}/cancelar`, data)

export const confirmarLlegada = (id: number, data: { horaLlegada: string }) =>
  api.patch(`/citas/${id}/confirmar-llegada`, data)

export const atenderCita = (id: number, data: AtencionRequest) =>
  api.patch(`/citas/${id}/atender`, data)

export const getMisCitasFiltradas = (params: {
  estado?: string
  desde?: string
  hasta?: string
}) => api.get('/citas/mis-citas', { params })

export const getAgendaHoy = () =>
  api.get('/citas/mi-agenda-hoy')