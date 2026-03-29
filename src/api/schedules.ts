import api from './axios'
import type { Schedule, ScheduleRequest, Slot } from '../types'

export const getSchedules = (doctorId: number) =>
    api.get<Schedule[]>(`/doctors/${doctorId}/schedules`)

export const createSchedule = (doctorId: number, data: ScheduleRequest) =>
    api.post<Schedule>(`/doctors/${doctorId}/schedules`, data)

export const getSlots = (doctorId: number, date: string) =>
    api.get<Slot[]>(`/doctors/${doctorId}/schedules/slots`, { params: { date } })