import { useState } from 'react'

const endpoints = [
    {
        us: 'US-001',
        title: 'Registro de pacientes',
        method: 'POST',
        path: '/api/v1/auth/register',
        roles: ['Público'],
        description: 'Registra un nuevo paciente y retorna tokens JWT.',
        body: `{
  "nombre": "Juan",
  "apellido": "Pérez",
  "documento": "123456789",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "fechaNacimiento": "1990-01-15",
  "password": "password123"
}`,
    },
    {
        us: 'US-002',
        title: 'Login',
        method: 'POST',
        path: '/api/v1/auth/login',
        roles: ['Público'],
        description: 'Inicia sesión y retorna access_token y refresh_token.',
        body: `{
  "email": "juan@email.com",
  "password": "password123"
}`,
    },
    {
        us: 'US-003',
        title: 'Refresh Token',
        method: 'POST',
        path: '/api/v1/auth/refresh',
        roles: ['Público'],
        description: 'Renueva el access token usando el refresh token.',
        body: `{
  "refreshToken": "eyJhbGci..."
}`,
    },
    {
        us: 'US-004',
        title: 'Crear especialidad',
        method: 'POST',
        path: '/api/v1/specialties',
        roles: ['ADMIN'],
        description: 'Crea una nueva especialidad médica.',
        body: `{
  "nombre": "Cardiología",
  "descripcion": "Especialidad del corazón"
}`,
    },
    {
        us: 'US-004',
        title: 'Listar especialidades',
        method: 'GET',
        path: '/api/v1/specialties',
        roles: ['Todos'],
        description: 'Lista todas las especialidades activas.',
        body: null,
    },
    {
        us: 'US-004',
        title: 'Actualizar especialidad',
        method: 'PUT',
        path: '/api/v1/specialties/{id}',
        roles: ['ADMIN'],
        description: 'Actualiza una especialidad existente.',
        body: `{
  "nombre": "Cardiología",
  "descripcion": "Nueva descripción"
}`,
    },
    {
        us: 'US-004',
        title: 'Desactivar especialidad',
        method: 'DELETE',
        path: '/api/v1/specialties/{id}',
        roles: ['ADMIN'],
        description: 'Desactiva una especialidad (borrado lógico).',
        body: null,
    },
    {
        us: 'US-005',
        title: 'Crear doctor',
        method: 'POST',
        path: '/api/v1/doctors',
        roles: ['ADMIN'],
        description: 'Crea un doctor y su usuario con rol DOCTOR.',
        body: `{
  "nombre": "Carlos",
  "apellido": "López",
  "documento": "987654321",
  "email": "carlos@clinica.com",
  "telefono": "3009876543",
  "fechaNacimiento": "1985-05-20",
  "specialtyId": 1,
  "licenciaMedica": "LIC-001"
}`,
    },
    {
        us: 'US-005',
        title: 'Listar doctores',
        method: 'GET',
        path: '/api/v1/doctors',
        roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'],
        description: 'Lista todos los doctores.',
        body: null,
    },
    {
        us: 'US-005',
        title: 'Actualizar doctor',
        method: 'PUT',
        path: '/api/v1/doctors/{id}',
        roles: ['ADMIN'],
        description: 'Actualiza datos del doctor.',
        body: `{
  "telefono": "3001112233",
  "specialtyId": 2,
  "licenciaMedica": "LIC-002"
}`,
    },
    {
        us: 'US-005',
        title: 'Desactivar doctor',
        method: 'DELETE',
        path: '/api/v1/doctors/{id}',
        roles: ['ADMIN'],
        description: 'Desactiva un doctor (borrado lógico).',
        body: null,
    },
    {
        us: 'US-006',
        title: 'Doctores por especialidad',
        method: 'GET',
        path: '/api/v1/doctors?specialtyId={id}',
        roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'],
        description: 'Lista doctores activos filtrados por especialidad.',
        body: null,
    },
    {
        us: 'US-007',
        title: 'Configurar horario',
        method: 'POST',
        path: '/api/v1/doctors/{id}/schedules',
        roles: ['ADMIN', 'DOCTOR'],
        description: 'Configura un bloque de horario semanal para el doctor.',
        body: `{
  "diaSemana": "MONDAY",
  "horaInicio": "08:00",
  "horaFin": "12:00",
  "duracionCitaMinutos": 30
}`,
    },
    {
        us: 'US-007',
        title: 'Ver horarios del doctor',
        method: 'GET',
        path: '/api/v1/doctors/{id}/schedules',
        roles: ['ADMIN', 'DOCTOR'],
        description: 'Lista todos los horarios configurados de un doctor.',
        body: null,
    },
    {
        us: 'US-008',
        title: 'Ver slots disponibles',
        method: 'GET',
        path: '/api/v1/doctors/{id}/schedules/slots?date=YYYY-MM-DD',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Retorna los slots disponibles de un doctor en una fecha.',
        body: null,
    },

    {
        us: 'US-009',
        title: 'Crear paciente',
        method: 'POST',
        path: '/api/v1/patients',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Crea un nuevo paciente en el sistema.',
        body: `{
  "nombre": "Carlos",
  "apellido": "Rodríguez",
  "documento": "987654321",
  "email": "carlos@email.com",
  "telefono": "3009876543",
  "fechaNacimiento": "1988-04-10",
  "direccion": "Calle 123",
  "eps": "Sura",
  "tipoSangre": "O+"
}`,
    },
    {
        us: 'US-009',
        title: 'Listar pacientes',
        method: 'GET',
        path: '/api/v1/patients?nombre=Carlos&page=0',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Lista pacientes paginados, con búsqueda opcional por nombre.',
        body: null,
    },
    {
        us: 'US-009',
        title: 'Buscar paciente por documento',
        method: 'GET',
        path: '/api/v1/patients/documento/{documento}',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Busca un paciente por su número de documento.',
        body: null,
    },
    {
        us: 'US-009',
        title: 'Actualizar paciente',
        method: 'PUT',
        path: '/api/v1/patients/{id}',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Actualiza los datos de un paciente.',
        body: `{
  "nombre": "Carlos",
  "apellido": "Rodríguez",
  "documento": "987654321",
  "email": "carlos@email.com",
  "telefono": "3001112233",
  "fechaNacimiento": "1988-04-10",
  "direccion": "Carrera 45",
  "eps": "Sura",
  "tipoSangre": "O+"
}`,
    },
    {
        us: 'US-009',
        title: 'Eliminar paciente',
        method: 'DELETE',
        path: '/api/v1/patients/{id}',
        roles: ['ADMIN'],
        description: 'Elimina un paciente del sistema.',
        body: null,
    },
    {
        us: 'US-010',
        title: 'Ver mi perfil',
        method: 'GET',
        path: '/api/v1/patients/me',
        roles: ['PACIENTE'],
        description: 'El paciente consulta su propia información personal.',
        body: null,
    },
    {
        us: 'US-010',
        title: 'Actualizar mi perfil',
        method: 'PATCH',
        path: '/api/v1/patients/me',
        roles: ['PACIENTE'],
        description: 'El paciente actualiza su teléfono, dirección o email.',
        body: `{
  "email": "nuevo@email.com",
  "telefono": "3001234567",
  "direccion": "Nueva dirección 123"
}`,
    },
    {
        us: 'US-011',
        title: 'Agendar cita (recepcionista)',
        method: 'POST',
        path: '/api/v1/citas',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'La recepcionista agenda una cita para un paciente.',
        body: `{
  "patientId": 1,
  "doctorId": 1,
  "fecha": "2026-05-10",
  "horaInicio": "09:00",
  "motivoConsulta": "Chequeo general"
}`,
    },
    {
        us: 'US-011',
        title: 'Ver slots disponibles',
        method: 'GET',
        path: '/api/v1/citas/slots-disponibles?doctorId=1&fecha=2026-05-10',
        roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'],
        description: 'Retorna los slots disponibles de un doctor en una fecha específica.',
        body: null,
    },
    {
        us: 'US-012',
        title: 'Paciente solicita cita',
        method: 'POST',
        path: '/api/v1/citas/solicitar',
        roles: ['PACIENTE'],
        description: 'El paciente solicita una cita para sí mismo.',
        body: `{
  "doctorId": 1,
  "fecha": "2026-05-10",
  "horaInicio": "10:00",
  "motivoConsulta": "Dolor de cabeza frecuente"
}`,
    },
    {
        us: 'US-013',
        title: 'Cancelar cita',
        method: 'PATCH',
        path: '/api/v1/citas/{id}/cancelar',
        roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'],
        description: 'Cancela una cita agendada. Paciente solo cancela las suyas, debe faltar más de 24h.',
        body: `{
  "motivoCancelacion": "No puedo asistir por motivos laborales"
}`,
    },
    {
        us: 'US-014',
        title: 'Confirmar llegada del paciente',
        method: 'PATCH',
        path: '/api/v1/citas/{id}/confirmar-llegada',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Confirma que el paciente llegó a su cita y registra la hora de llegada.',
        body: `{
  "horaLlegada": "09:15"
}`,
    },
    {
        us: 'US-015',
        title: 'Atender cita',
        method: 'PATCH',
        path: '/api/v1/citas/{id}/atender',
        roles: ['DOCTOR'],
        description: 'El doctor registra la atención de una cita confirmada.',
        body: `{
  "diagnostico": "Hipertensión arterial leve",
  "observaciones": "Paciente refiere dolor de cabeza frecuente",
  "indicaciones": "Reposo, dieta baja en sodio",
  "horaInicioAtencion": "09:00",
  "horaFinAtencion": "09:30"
}`,
    },
    {
        us: 'US-016',
        title: 'Ver historial de citas (paciente)',
        method: 'GET',
        path: '/api/v1/citas/mis-citas?estado=AGENDADA&desde=2026-01-01&hasta=2026-12-31',
        roles: ['PACIENTE'],
        description: 'El paciente ve su historial de citas con filtros por estado y rango de fechas.',
        body: null,
    },
    {
        us: 'US-017',
        title: 'Agenda del día (doctor)',
        method: 'GET',
        path: '/api/v1/citas/mi-agenda-hoy',
        roles: ['DOCTOR'],
        description: 'El doctor ve todas sus citas del día actual ordenadas por hora.',
        body: null,
    },
    {
        us: 'US-018',
        title: 'Reporte de citas por período',
        method: 'GET',
        path: '/api/v1/reportes/periodo?fechaInicio=2026-01-01&fechaFin=2026-12-31',
        roles: ['ADMIN'],
        description: 'Retorna estadísticas de citas en un rango de fechas: total, por estado y por especialidad.',
        body: null,
    },
    {
        us: 'US-019',
        title: 'Reporte de productividad por doctor',
        method: 'GET',
        path: '/api/v1/reportes/productividad?fechaInicio=2026-01-01&fechaFin=2026-12-31',
        roles: ['ADMIN'],
        description: 'Retorna productividad de cada doctor: citas atendidas, canceladas y tiempo promedio.',
        body: null,
    },
    {
        us: 'US-020',
        title: 'Enviar notificación',
        method: 'POST',
        path: '/api/v1/notifications',
        roles: ['ADMIN', 'RECEPCIONISTA'],
        description: 'Simula el microservicio de notificaciones. Tipos: CITA_AGENDADA, CITA_CANCELADA, RECORDATORIO.',
        body: `{
  "destinatario": "paciente@email.com",
  "tipo": "CITA_AGENDADA",
  "mensaje": "Tu cita fue agendada para el 2026-04-30 a las 09:00",
  "metadata": {
    "doctorId": 1,
    "fecha": "2026-04-30"
  }
}`,
    },
]

const methodColors: Record<string, string> = {
    GET: 'bg-blue-900 text-blue-300 border-blue-700',
    POST: 'bg-green-900 text-green-300 border-green-700',
    PUT: 'bg-yellow-900 text-yellow-300 border-yellow-700',
    DELETE: 'bg-red-900 text-red-300 border-red-700',
    PATCH: 'bg-orange-900 text-orange-300 border-orange-700',
}

const usColors: Record<string, string> = {
    'US-001': 'bg-purple-900 text-purple-300',
    'US-002': 'bg-purple-900 text-purple-300',
    'US-003': 'bg-purple-900 text-purple-300',
    'US-004': 'bg-indigo-900 text-indigo-300',
    'US-005': 'bg-cyan-900 text-cyan-300',
    'US-006': 'bg-cyan-900 text-cyan-300',
    'US-007': 'bg-orange-900 text-orange-300',
    'US-008': 'bg-orange-900 text-orange-300',
    'US-009': 'bg-teal-900 text-teal-300',
    'US-010': 'bg-teal-900 text-teal-300',
    'US-011': 'bg-pink-900 text-pink-300',
    'US-012': 'bg-pink-900 text-pink-300',
    'US-013': 'bg-red-900 text-red-300',
    'US-014': 'bg-green-900 text-green-300',
    'US-015': 'bg-blue-900 text-blue-300',
    'US-016': 'bg-pink-900 text-pink-300',
    'US-017': 'bg-blue-900 text-blue-300',
    'US-018': 'bg-yellow-900 text-yellow-300',
    'US-019': 'bg-yellow-900 text-yellow-300',
    'US-020': 'bg-slate-700 text-slate-300',
}

export const DocsPage = () => {
    const [expanded, setExpanded] = useState<number | null>(null)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">📋 Documentación de endpoints</h1>
                    <p className="text-slate-400 text-sm mt-1">Historias de usuario US-001 a US-020</p>
                </div>
                <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm transition-colors">
                    🔗 Abrir Swagger UI
                </a>
            </div>

            <div className="flex flex-col gap-3">
                {endpoints.map((ep, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-750 transition-colors">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${usColors[ep.us]}`}>
                                {ep.us}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded border ${methodColors[ep.method]}`}>
                                {ep.method}
                            </span>
                            <code className="text-slate-300 text-sm font-mono flex-1">{ep.path}</code>
                            <span className="text-slate-400 text-sm hidden md:block">{ep.title}</span>
                            <span className="text-slate-500 text-xs ml-2">{expanded === i ? '▲' : '▼'}</span>
                        </button>

                        {expanded === i && (
                            <div className="border-t border-slate-700 p-4 flex flex-col gap-3">
                                <p className="text-slate-300 text-sm">{ep.description}</p>

                                <div className="flex gap-2 flex-wrap">
                                    {ep.roles.map(r => (
                                        <span key={r} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                                            🔒 {r}
                                        </span>
                                    ))}
                                </div>

                                {ep.body && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Request body:</p>
                                        <pre className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-green-300 text-xs overflow-auto">
                                            {ep.body}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}