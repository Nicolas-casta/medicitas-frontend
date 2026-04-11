import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { SpecialtiesPage } from '../pages/specialties/SpecialtiesPage'
import { DoctorsPage } from '../pages/doctors/DoctorsPage'
import { SchedulesPage } from '../pages/schedules/SchedulesPage'
import { Layout } from '../components/layout/Layout'
import { DocsPage } from '../pages/docs/DocsPage'
import { PatientsPage } from '../pages/patients/PatientsPage'
import { MyProfilePage } from '../pages/patients/MyProfilePage'
import { CitasPage } from '../pages/citas/CitasPage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/doctors" />} />
                <Route path="specialties" element={<SpecialtiesPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="schedules" element={<SchedulesPage />} />
                <Route path="docs" element={<DocsPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="profile" element={<MyProfilePage />} />
                <Route path="citas" element={<CitasPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
)