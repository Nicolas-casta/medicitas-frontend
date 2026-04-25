import { useEffect, useState } from "react";
import {
  getCitasByPatient,
  cancelarCita,
  confirmarLlegada,
} from "../../api/citas";
import { getPatients } from "../../api/patients";
import type { Patient, Cita } from "../../types";
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

export const GestionCitasPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [citas, setCitas] = useState<Cita[]>([])
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [showCancelar, setShowCancelar] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const {
    register: regCancel,
    handleSubmit: handleCancel,
    reset: resetCancel,
  } = useForm<{ motivoCancelacion: string }>();
  const {
    register: regConfirm,
    handleSubmit: handleConfirm,
    reset: resetConfirm,
  } = useForm<{ horaLlegada: string }>();

  useEffect(() => {
    getPatients().then((r) => setPatients(r.data.content));
  }, []);

  useEffect(() => {
    if (selectedPatient)
      getCitasByPatient(selectedPatient).then((r) => setCitas(r.data));
  }, [selectedPatient]);

  const onCancelar = async (data: { motivoCancelacion: string }) => {
    if (!citaSeleccionada) return;
    await cancelarCita(citaSeleccionada.id, data);
    setShowCancelar(false);
    resetCancel();
    if (selectedPatient)
      getCitasByPatient(selectedPatient).then((r) => setCitas(r.data));
  };

  const onConfirmar = async (data: { horaLlegada: string }) => {
    if (!citaSeleccionada) return;
    await confirmarLlegada(citaSeleccionada.id, data);
    setShowConfirmar(false);
    resetConfirm();
    if (selectedPatient)
      getCitasByPatient(selectedPatient).then((r) => setCitas(r.data));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-100 mb-6">
        🗂 Gestión de citas
      </h1>

      <div className="mb-6">
        <label className="text-sm text-slate-400 block mb-1">
          Seleccionar paciente
        </label>
        <select
          onChange={(e) => setSelectedPatient(Number(e.target.value))}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
        >
          <option value="">-- Selecciona un paciente --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido} · {p.documento}
            </option>
          ))}
        </select>
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
                  Dr. {c.nombreDoctor} · {c.especialidad}
                </p>
                <p className="text-sm text-slate-300">
                  📅 {c.fecha} · ⏰ {c.horaInicio}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Motivo: {c.motivoConsulta}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full border ${estadoColors[c.estado]}`}
                >
                  {c.estado}
                </span>
                <div className="flex gap-2">
                  {c.estado === "AGENDADA" && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCitaSeleccionada(c);
                          setShowConfirmar(true);
                        }}
                      >
                        ✅ Confirmar llegada
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setCitaSeleccionada(c);
                          setShowCancelar(true);
                        }}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {selectedPatient && citas.length === 0 && (
          <p className="text-slate-500 text-sm">
            Sin citas para este paciente.
          </p>
        )}
      </div>

      {showCancelar && (
        <Modal title="Cancelar cita" onClose={() => setShowCancelar(false)}>
          <form
            onSubmit={handleCancel(onCancelar)}
            className="flex flex-col gap-4"
          >
            <p className="text-slate-400 text-sm">
              Cita del {citaSeleccionada?.fecha} a las{" "}
              {citaSeleccionada?.horaInicio}
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">
                Motivo de cancelación
              </label>
              <textarea
                {...regCancel("motivoCancelacion", { required: true })}
                rows={3}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none"
              />
            </div>
            <Button type="submit" variant="danger">
              Cancelar cita
            </Button>
          </form>
        </Modal>
      )}

      {showConfirmar && (
        <Modal
          title="Confirmar llegada del paciente"
          onClose={() => setShowConfirmar(false)}
        >
          <form
            onSubmit={handleConfirm(onConfirmar)}
            className="flex flex-col gap-4"
          >
            <p className="text-slate-400 text-sm">
              Registra la hora de llegada del paciente.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">Hora de llegada</label>
              <input
                type="time"
                {...regConfirm("horaLlegada", { required: true })}
                className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
              />
            </div>
            <Button type="submit">Confirmar llegada</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

