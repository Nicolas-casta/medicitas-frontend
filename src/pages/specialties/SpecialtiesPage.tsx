import { useEffect, useState } from "react";
import {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deactivateSpecialty,
} from "../../api/specialties";
import type { Specialty } from "../../types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { IconButton } from "../../components/ui/IconButton";
import { useForm } from "react-hook-form";
import { Pencil, PowerOff } from "lucide-react";

export const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Specialty | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<{
    nombre: string;
    descripcion: string;
  }>();

  const load = async () => {
    const res = await getSpecialties();
    setSpecialties(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset();
    setShowModal(true);
  };

  const openEdit = (s: Specialty) => {
    setEditing(s);
    setValue("nombre", s.nombre);
    setValue("descripcion", s.descripcion);
    setShowModal(true);
  };

  const onSubmit = async (data: { nombre: string; descripcion: string }) => {
    if (editing) await updateSpecialty(editing.id, data);
    else await createSpecialty(data);
    setShowModal(false);
    load();
  };

  const handleDeactivate = async (id: number) => {
    if (confirm("¿Desactivar esta especialidad?")) {
      try {
        await deactivateSpecialty(id);
        load();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Error al desactivar");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Especialidades</h1>
        <Button onClick={openCreate}>+ Nueva especialidad</Button>
      </div>

      <div className="grid gap-3">
        {specialties.map((s) => (
          <div
            key={s.id}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-slate-100">{s.nombre}</p>
              <p className="text-sm text-slate-400">{s.descripcion}</p>
            </div>
            <div className="flex gap-1">
              <IconButton
                icon={Pencil}
                tooltip="Editar especialidad"
                onClick={() => openEdit(s)}
              />
              <IconButton
                icon={PowerOff}
                tooltip="Desactivar especialidad"
                onClick={() => handleDeactivate(s.id)}
                color="text-red-400 hover:text-red-300 hover:bg-slate-700"
              />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editing ? "Editar especialidad" : "Nueva especialidad"}
          onClose={() => setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Nombre"
              register={register("nombre", { required: true })}
            />
            <Input label="Descripción" register={register("descripcion")} />
            <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};