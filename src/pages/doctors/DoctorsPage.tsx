import { useEffect, useState } from "react";
import { getDoctors, createDoctor, deactivateDoctor } from "../../api/doctors";
import { getSpecialties } from "../../api/specialties";
import type { Doctor, DoctorRequest, Specialty } from "../../types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

export const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState<number | undefined>();
  const { register, handleSubmit, reset } = useForm<DoctorRequest>();
  const { user } = useAuth();

  const load = async () => {
    const res = await getDoctors(filterSpecialty);
    setDoctors(res.data);
  };

  useEffect(() => {
    getSpecialties().then((r) => setSpecialties(r.data));
  }, []);

  useEffect(() => {
    load();
  }, [filterSpecialty]);

  const onSubmit = async (data: DoctorRequest) => {
    await createDoctor({ ...data, specialtyId: Number(data.specialtyId) });
    setShowModal(false);
    reset();
    load();
  };

  const handleDeactivate = async (id: number) => {
    if (confirm("¿Desactivar este doctor?")) {
      try {
        await deactivateDoctor(id);
        load();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Error al desactivar");
        }
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Doctores</h1>
        {user?.role === "ADMIN" && (
          <Button onClick={() => setShowModal(true)}>+ Nuevo doctor</Button>
        )}
      </div>

      <div className="mb-4">
        <select
          onChange={(e) =>
            setFilterSpecialty(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
        >
          <option value="">Todas las especialidades</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3">
        {doctors.map((d) => (
          <div
            key={d.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-slate-100">{d.nombreCompleto}</p>
              <p className="text-sm text-slate-400">
                {d.especialidad} · {d.email}
              </p>
              <p className="text-xs text-slate-500">
                Licencia: {d.licenciaMedica}
              </p>
            </div>
            <div className="flex gap-2">
              {user?.role === "ADMIN" && (
                <Button variant="danger" onClick={() => handleDeactivate(d.id)}>
                  Desactivar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Nuevo doctor" onClose={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                register={register("nombre", { required: true })}
              />
              <Input
                label="Apellido"
                register={register("apellido", { required: true })}
              />
            </div>
            <Input
              label="Documento"
              register={register("documento", { required: true })}
            />
            <Input
              label="Email"
              type="email"
              register={register("email", { required: true })}
            />
            <Input
              label="Teléfono"
              register={register("telefono", { required: true })}
            />
            <Input
              label="Fecha nacimiento"
              type="date"
              register={register("fechaNacimiento", { required: true })}
            />
            <Input
              label="Licencia médica"
              register={register("licenciaMedica", { required: true })}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400">Especialidad</label>
              <select
                {...register("specialtyId", { required: true })}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Crear doctor</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
