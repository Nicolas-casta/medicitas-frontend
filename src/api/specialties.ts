import api from './axios'
import type { Specialty } from '../types'

export const getSpecialties = () =>
    api.get<Specialty[]>('/specialties')

export const createSpecialty = (data: { nombre: string; descripcion: string }) =>
    api.post<Specialty>('/specialties', data)

export const updateSpecialty = (id: number, data: { nombre: string; descripcion: string }) =>
    api.put<Specialty>(`/specialties/${id}`, data)

export const deactivateSpecialty = (id: number) =>
    api.delete(`/specialties/${id}`)