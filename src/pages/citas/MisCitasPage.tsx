import { useEffect, useState } from "react";
import { getMisCitasFiltradas } from "../../api/citas";
import { cancelarCita } from "../../api/citas";
import type { CitaDetalle } from "../../types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useForm } from "react-hook-form";

const estadoColors: Record<string, string> = {
  AGENDADA: "bg-yellow-900 text-yellow-300 border-yellow-700",
  CONFIRMADA: "bg-green-900 text-green-300 border-green-700",
  CANCELADA: "bg-red-900 text-red-300 border-red-700",
  ATENDIDA: "bg-blue-900 text-blue-300 border-blue-700",
  NO_ASISTIO: "bg-slate-700 text-slate-400 border-slate-600",
};

export const MisCitasPage = () => {
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDetalle | null>(
    null,
  );
  const [showCancelar, setShowCancelar] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const { register, handleSubmit, reset } = useForm<{
    motivoCancelacion: string;
  }>();

  const load = async () => {
    const res = await getMisCitasFiltradas({
      estado: estadoFiltro || undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
    });
    setCitas(res.data);
  };

  useEffect(() => {
    load();
  }, [estadoFiltro, desde, hasta]);

  const onCancelar = async (data: { motivoCancelacion: string }) => {
    if (!citaSeleccionada) return;
    await cancelarCita(citaSeleccionada.id, data);
    setShowCancelar(false);
    reset();
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">📋 Mis citas</h1>

      {/* Filtros */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="AGENDADA">Agendada</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="ATENDIDA">Atendida</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="NO_ASISTIO">No asistió</option>
        </select>
        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm"
        />
        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm"
        />
        <Button
          variant="ghost"
          onClick={() => {
            setEstadoFiltro("");
            setDesde("");
            setHasta("");
          }}
        >
          Limpiar filtros
        </Button>
      </div>

      <div className="grid gap-3">
        {citas.map((c) => (
          <div
            key={c.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-100">
                  Dr. {c.nombreDoctor}
                </p>
                <p className="text-sm text-slate-400">{c.especialidad}</p>
                <p className="text-sm text-slate-300 mt-1">
                   {c.fecha} ·  {c.horaInicio}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Motivo: {c.motivoConsulta}
                </p>
                {c.diagnostico && (
                  <p className="text-xs text-indigo-400 mt-1">
                    Diagnóstico: {c.diagnostico}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full border ${estadoColors[c.estado]}`}
                >
                  {c.estado}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCitaSeleccionada(c);
                      setShowDetalle(true);
                    }}
                  >
                    Ver detalle
                  </Button>
                  {c.estado === "AGENDADA" && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setCitaSeleccionada(c);
                        setShowCancelar(true);
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {citas.length === 0 && (
          <p className="text-slate-500 text-sm">No hay citas registradas.</p>
        )}
      </div>

      {/* Modal cancelar */}
      {showCancelar && (
        <Modal title="Cancelar cita" onClose={() => setShowCancelar(false)}>
          <form
            onSubmit={handleSubmit(onCancelar)}
            className="flex flex-col gap-4"
          >
            <p className="text-slate-400 text-sm">
              ¿Estás seguro de cancelar tu cita con Dr.{" "}
              {citaSeleccionada?.nombreDoctor} el {citaSeleccionada?.fecha}?
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">
                Motivo de cancelación
              </label>
              <textarea
                {...register("motivoCancelacion", { required: true })}
                rows={3}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none"
              />
            </div>
            <Button type="submit" variant="danger">
              Confirmar cancelación
            </Button>
          </form>
        </Modal>
      )}

      {/* Modal detalle */}
      {showDetalle && citaSeleccionada && (
        <Modal title="Detalle de cita" onClose={() => setShowDetalle(false)}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">Doctor</span>
                <p className="text-slate-100">
                  Dr. {citaSeleccionada.nombreDoctor}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Especialidad</span>
                <p className="text-slate-100">
                  {citaSeleccionada.especialidad}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Fecha</span>
                <p className="text-slate-100">{citaSeleccionada.fecha}</p>
              </div>
              <div>
                <span className="text-slate-500">Hora</span>
                <p className="text-slate-100">{citaSeleccionada.horaInicio}</p>
              </div>
            </div>
            <div>
              <span className="text-slate-500">Motivo</span>
              <p className="text-slate-100">
                {citaSeleccionada.motivoConsulta}
              </p>
            </div>
            {citaSeleccionada.horaLlegada && (
              <div>
                <span className="text-slate-500">Hora llegada</span>
                <p className="text-slate-100">{citaSeleccionada.horaLlegada}</p>
              </div>
            )}
            {citaSeleccionada.diagnostico && (
              <>
                <div>
                  <span className="text-slate-500">Diagnóstico</span>
                  <p className="text-slate-100">
                    {citaSeleccionada.diagnostico}
                  </p>
                </div>
                {citaSeleccionada.observaciones && (
                  <div>
                    <span className="text-slate-500">Observaciones</span>
                    <p className="text-slate-100">
                      {citaSeleccionada.observaciones}
                    </p>
                  </div>
                )}
                {citaSeleccionada.indicaciones && (
                  <div>
                    <span className="text-slate-500">Indicaciones</span>
                    <p className="text-slate-100">
                      {citaSeleccionada.indicaciones}
                    </p>
                  </div>
                )}
              </>
            )}
            {citaSeleccionada.motivoCancelacion && (
              <div>
                <span className="text-slate-500">Motivo cancelación</span>
                <p className="text-red-400">
                  {citaSeleccionada.motivoCancelacion}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
