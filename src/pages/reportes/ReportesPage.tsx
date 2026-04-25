import { useState } from "react";
import { getReportePeriodo, getReporteProductividad } from "../../api/reportes";
import type { ReportePeriodo, ReporteProductividad } from "../../types";
import { Button } from "../../components/ui/Button";

export const ReportesPage = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reportePeriodo, setReportePeriodo] = useState<ReportePeriodo | null>(
    null,
  );
  const [reporteProductividad, setReporteProductividad] = useState<
    ReporteProductividad[]
  >([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!fechaInicio || !fechaFin) return;
    setLoading(true);
    try {
      const [periodo, productividad] = await Promise.all([
        getReportePeriodo(fechaInicio, fechaFin),
        getReporteProductividad(fechaInicio, fechaFin),
      ]);
      setReportePeriodo(periodo.data);
      setReporteProductividad(productividad.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">📊 Reportes</h1>

      {/* Filtros */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6 flex gap-4 items-end flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
          />
        </div>
        <Button onClick={buscar} disabled={loading}>
          {loading ? "Cargando..." : "🔍 Generar reporte"}
        </Button>
      </div>

      {/* US-018 Reporte por período */}
      {reportePeriodo && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">
            📅 Citas por período
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {[
              {
                label: "Total",
                value: reportePeriodo.totalCitas,
                color: "text-slate-100",
              },
              {
                label: "Agendadas",
                value: reportePeriodo.agendadas,
                color: "text-yellow-300",
              },
              {
                label: "Atendidas",
                value: reportePeriodo.atendidas,
                color: "text-blue-300",
              },
              {
                label: "Canceladas",
                value: reportePeriodo.canceladas,
                color: "text-red-300",
              },
              {
                label: "No asistió",
                value: reportePeriodo.noAsistio,
                color: "text-slate-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-300 mb-3">
              Por especialidad
            </p>
            <div className="grid gap-2">
              {Object.entries(reportePeriodo.porEspecialidad).map(
                ([esp, total]) => (
                  <div key={esp} className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">{esp}</span>
                    <span className="text-sm font-medium text-indigo-300">
                      {total} citas
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* US-019 Productividad por doctor */}
      {reporteProductividad.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-3">
            👨‍⚕️ Productividad por doctor
          </h2>
          <div className="grid gap-3">
            {reporteProductividad.map((r) => (
              <div
                key={r.doctorId}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-100">
                      Dr. {r.nombreDoctor}
                    </p>
                    <p className="text-sm text-slate-400">{r.especialidad}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-right">
                    <div>
                      <p className="text-blue-300 font-bold">
                        {r.citasAtendidas}
                      </p>
                      <p className="text-xs text-slate-500">Atendidas</p>
                    </div>
                    <div>
                      <p className="text-red-300 font-bold">
                        {r.citasCanceladas}
                      </p>
                      <p className="text-xs text-slate-500">Canceladas</p>
                    </div>
                    <div>
                      <p className="text-indigo-300 font-bold">
                        {r.tiempoPromedioAtencionMinutos.toFixed(1)} min
                      </p>
                      <p className="text-xs text-slate-500">Promedio</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
