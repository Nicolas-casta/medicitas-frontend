import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { SpecialtiesPage } from "../pages/specialties/SpecialtiesPage";
import { DoctorsPage } from "../pages/doctors/DoctorsPage";
import { SchedulesPage } from "../pages/schedules/SchedulesPage";
import { Layout } from "../components/layout/Layout";
import { DocsPage } from "../pages/docs/DocsPage";
import { PatientsPage } from "../pages/patients/PatientsPage";
import { MyProfilePage } from "../pages/patients/MyProfilePage";
import { CitasPage } from "../pages/citas/CitasPage";
import { MisCitasPage } from "../pages/citas/MisCitasPage";
import { GestionCitasPage } from "../pages/citas/GestionCitasPage";
import { AgendaHoyPage } from "../pages/citas/AgendaHoyPage";
import { ReportesPage } from "../pages/reportes/ReportesPage";
import { NotificacionesPage } from "../pages/notificaciones/NotificacionesPage";

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 className="text-4xl font-bold text-slate-400">404</h1>
    <p className="text-slate-500">Página no encontrada</p>
    <a href="/doctors" className="text-indigo-400 hover:underline text-sm">
      Volver al inicio
    </a>
  </div>
)

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/doctors" />} />
        <Route path="specialties" element={<SpecialtiesPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="schedules" element={<SchedulesPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="citas" element={<CitasPage />} />
        <Route path="mis-citas" element={<MisCitasPage />} />
        <Route path="gestion-citas" element={<GestionCitasPage />} />
        <Route path="agenda-hoy" element={<AgendaHoyPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="notificaciones" element={<NotificacionesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
