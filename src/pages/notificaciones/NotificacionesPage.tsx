import { useForm } from "react-hook-form";
import { enviarNotificacion } from "../../api/notificaciones";
import type { NotificacionRequest } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useState } from "react";

export const NotificacionesPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NotificacionRequest>();
  const [enviado, setEnviado] = useState(false);

  const onSubmit = async (data: NotificacionRequest) => {
    await enviarNotificacion(data);
    setEnviado(true);
    reset();
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">
        🔔 Notificaciones
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Simula el microservicio de notificaciones (US-020)
      </p>

      {enviado && (
        <div className="bg-green-900 border border-green-700 text-green-300 rounded-xl px-4 py-3 text-sm mb-4">
          ✅ Notificación enviada correctamente
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-4"
      >
        <Input
          label="Destinatario (email)"
          type="email"
          register={register("destinatario", { required: true })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Tipo de notificación</label>
          <select
            {...register("tipo", { required: true })}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
          >
            <option value="CITA_AGENDADA">CITA_AGENDADA</option>
            <option value="CITA_CANCELADA">CITA_CANCELADA</option>
            <option value="RECORDATORIO">RECORDATORIO</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Mensaje</label>
          <textarea
            {...register("mensaje", { required: true })}
            rows={3}
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 resize-none"
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "📤 Enviar notificación"}
        </Button>
      </form>
    </div>
  );
};
