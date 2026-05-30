import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Stethoscope,
  Users,
  UserRound,
  CalendarPlus,
  CalendarClock,
  Clock,
  CalendarCheck,
  CalendarDays,
  BarChart2,
  Bell,
  LogOut,
  Shield,
} from 'lucide-react'

const links = [
  { to: '/specialties',   label: 'Especialidades',    icon: Stethoscope,    roles: ['ADMIN'] },
  { to: '/doctors',       label: 'Doctores',           icon: UserRound,      roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'] },
  { to: '/patients',      label: 'Pacientes',          icon: Users,          roles: ['ADMIN', 'RECEPCIONISTA'] },
  { to: '/citas',         label: 'Agendar cita',       icon: CalendarPlus,   roles: ['ADMIN', 'RECEPCIONISTA'] },
  { to: '/gestion-citas', label: 'Gestión de citas',   icon: CalendarClock,  roles: ['ADMIN', 'RECEPCIONISTA'] },
  { to: '/schedules',     label: 'Horarios',           icon: Clock,          roles: ['ADMIN', 'DOCTOR', 'RECEPCIONISTA'] },
  { to: '/agenda-hoy',    label: 'Mi agenda hoy',      icon: CalendarCheck,  roles: ['DOCTOR'] },
  { to: '/mis-citas',     label: 'Mis citas',          icon: CalendarDays,   roles: ['PACIENTE'] },
  { to: '/profile',       label: 'Mi perfil',          icon: UserRound,      roles: ['PACIENTE'] },
  { to: '/reportes',      label: 'Reportes',           icon: BarChart2,      roles: ['ADMIN'] },
  { to: '/notificaciones',label: 'Notificaciones',     icon: Bell,           roles: ['ADMIN', 'RECEPCIONISTA'] },
]

export const Sidebar = () => {
  const { user, logout } = useAuth()

  return (
    <aside className="w-16 bg-slate-800 min-h-screen flex flex-col items-center py-4 border-r border-slate-700">

      {/* Logo */}
      <div className="mb-6 flex flex-col items-center group relative">
        <span className="text-indigo-400 font-bold text-lg leading-none">M</span>
        {/* Tooltip nombre completo */}
        <div className="absolute left-14 top-0 z-50 hidden group-hover:flex items-center">
          <div className="bg-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg border border-slate-600">
            <p className="font-bold text-indigo-400">MediCitas</p>
            <p className="text-slate-400 text-xs mt-0.5">{user?.email}</p>
            {user?.role === 'ADMIN' && (
              <span className="text-indigo-300 text-xs">Administrador</span>
            )}
          </div>
        </div>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {links
          .filter(l => l.roles.includes(user?.role || ''))
          .map(({ to, label, icon: Icon }) => (
            <div key={to} className="relative group">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center justify-center w-full h-10 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
              </NavLink>
              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none">
                <div className="bg-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg border border-slate-600">
                  {label}
                </div>
              </div>
            </div>
          ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="relative group w-full px-2">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full h-10 rounded-lg text-red-400 hover:bg-slate-700 transition-colors"
        >
          <LogOut size={18} />
        </button>
        <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none">
          <div className="bg-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg border border-slate-600">
            Cerrar sesión
          </div>
        </div>
      </div>

    </aside>
  )
}