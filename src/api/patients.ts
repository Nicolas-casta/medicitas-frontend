import api from './axios'
import type { Patient, PatientRequest } from '../types'

export const getPatients = (nombre?: string, page = 0) =>
    api.get<{ content: Patient[]; totalPages: number }>('/patients', {
        params: { nombre, page, size: 10 }
    })

export const getPatientByDocumento = (documento: string) =>
    api.get<Patient>(`/patients/documento/${documento}`)

export const createPatient = (data: PatientRequest) =>
    api.post<Patient>('/patients', data)

export const updatePatient = (id: number, data: PatientRequest) =>
    api.put<Patient>(`/patients/${id}`, data)

export const deletePatient = (id: number) =>
    api.delete(`/patients/${id}`)

export const getMyProfile = () =>
    api.get<Patient>('/patients/me')

export const updateMyProfile = (data: Partial<PatientRequest>) =>
    api.patch<Patient>('/patients/me', data)