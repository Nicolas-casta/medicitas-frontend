import { useEffect, useState } from "react";
import { getAgendaHoy, atenderCita } from "../../api/citas";
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

interface AtencionForm {
  diagnostico: string;
  observaciones: string;
  indicaciones: string;
  horaInicioAtencion: string;
  horaFinAtencion: string;
}

export const AgendaHoyPage = () => {
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDetalle | null>(
    null,
  );
  const [showAtender, setShowAtender] = useState(false);
  const { register, handleSubmit, reset } = useForm<AtencionForm>();

  const load = async () => {
    const res = await getAgendaHoy();
    setCitas(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const onAtender = async (data: AtencionForm) => {
    if (!citaSeleccionada) return;
    await atenderCita(citaSeleccionada.id, data);
    setShowAtender(false);
    reset();
    load();
  };

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">
          🩺 Mi agenda de hoy
        </h1>
        <p className="text-slate-400 text-sm mt-1 capitalize">{today}</p>
      </div>

      <div className="grid gap-3">
        {citas.map((c) => (
          <div
            key={c.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-100">{c.nombrePaciente}</p>
                <p className="text-xs text-slate-500">
                  Doc: {c.documentoPaciente}
                </p>
                <p className="text-sm text-slate-300 mt-1"> {c.horaInicio}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Motivo: {c.motivoConsulta}
                </p>
                {c.horaLlegada && (
                  <p className="text-xs text-green-400 mt-1">
                    Llegó a las: {c.horaLlegada}
                  </p>
                )}
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
                {c.estado === "CONFIRMADA" && (
                  <Button
                    onClick={() => {
                      setCitaSeleccionada(c);
                      setShowAtender(true);
                    }}
                  >
                    🩺 Atender
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {citas.length === 0 && (
          <p className="text-slate-500 text-sm">
            No tienes citas programadas para hoy.
          </p>
        )}
      </div>

      {showAtender && (
        <Modal title="Registrar atención" onClose={() => setShowAtender(false)}>
          <form
            onSubmit={handleSubmit(onAtender)}
            className="flex flex-col gap-3"
          >
            <p className="text-slate-400 text-sm">
              Paciente: {citaSeleccionada?.nombrePaciente}
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">Diagnóstico *</label>
              <textarea
                {...register("diagnostico", { required: true })}
                rows={2}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">Observaciones</label>
              <textarea
                {...register("observaciones")}
                rows={2}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">Indicaciones</label>
              <textarea
                {...register("indicaciones")}
                rows={2}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">
                  Hora inicio atención *
                </label>
                <input
                  type="time"
                  {...register("horaInicioAtencion", { required: true })}
                  className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">
                  Hora fin atención *
                </label>
                <input
                  type="time"
                  {...register("horaFinAtencion", { required: true })}
                  className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>
            </div>
            <Button type="submit">Guardar atención</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
