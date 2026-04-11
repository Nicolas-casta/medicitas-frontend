import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
    { to: '/docs', label: '📋 Endpoints', roles: ['ADMIN', 'DOCTOR', 'RECEPCIONISTA', 'PACIENTE'] },
    { to: '/specialties', label: '🏥 Especialidades', roles: ['ADMIN'] },
    { to: '/doctors', label: '👨‍⚕️ Doctores', roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'] },
    { to: '/schedules', label: '📅 Horarios', roles: ['ADMIN', 'DOCTOR', 'RECEPCIONISTA'] },
    { to: '/patients', label: '🧑‍⚕️ Pacientes', roles: ['ADMIN', 'RECEPCIONISTA'] },
    { to: '/citas', label: '📅 Citas', roles: ['ADMIN', 'RECEPCIONISTA', 'PACIENTE'] },
    { to: '/profile', label: '👤 Mi perfil', roles: ['PACIENTE'] },
]

export const Sidebar = () => {
    const { user, logout } = useAuth()

    return (
        <aside className="w-64 bg-slate-800 min-h-screen flex flex-col p-4 border-r border-slate-700">
            <div className="mb-8">
                <h1 className="text-xl font-bold text-indigo-400">🏨 MediCitas</h1>
                <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
                <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full">
                    {user?.role}
                </span>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                {links
                    .filter(l => l.roles.includes(user?.role || ''))
                    .map(link => (
                        <NavLink key={link.to} to={link.to}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`
                            }>
                            {link.label}
                        </NavLink>
                    ))}
            </nav>

            <button onClick={logout}
                className="mt-auto px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                🚪 Cerrar sesión
            </button>
        </aside>
    )
}