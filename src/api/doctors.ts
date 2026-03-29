import api from './axios'
import type { Doctor, DoctorRequest } from '../types'

export const getDoctors = (specialtyId?: number) =>
    api.get<Doctor[]>('/doctors', { params: specialtyId ? { specialtyId } : {} })

export const createDoctor = (data: DoctorRequest) =>
    api.post<Doctor>('/doctors', data)

export const updateDoctor = (id: number, data: Partial<DoctorRequest>) =>
    api.put<Doctor>(`/doctors/${id}`, data)

export const deactivateDoctor = (id: number) =>
    api.delete(`/doctors/${id}`)