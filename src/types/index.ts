export interface AuthResponse {
    accessToken: string
    refreshToken: string
}

export interface User {
    userId: number
    email: string
    role: 'ADMIN' | 'DOCTOR' | 'RECEPCIONISTA' | 'PACIENTE'
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    nombre: string
    apellido: string
    documento: string
    email: string
    telefono: string
    fechaNacimiento: string
    password: string
}

export interface Specialty {
    id: number
    nombre: string
    descripcion: string
    activo: boolean
}

export interface Doctor {
    id: number
    nombreCompleto: string
    email: string
    telefono: string
    especialidad: string
    licenciaMedica: string
    activo: boolean
}

export interface DoctorRequest {
    nombre: string
    apellido: string
    documento: string
    email: string
    telefono: string
    fechaNacimiento: string
    specialtyId: number
    licenciaMedica: string
}

export interface Schedule {
    id: number
    diaSemana: string
    horaInicio: string
    horaFin: string
    duracionCitaMinutos: number
}

export interface ScheduleRequest {
    diaSemana: string
    horaInicio: string
    horaFin: string
    duracionCitaMinutos: number
}

export interface Slot {
    horaInicio: string
    horaFin: string
    disponible: boolean
}