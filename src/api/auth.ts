import api from './axios'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export const login = (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data)

export const register = (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data)

export const refreshToken = (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refreshToken })