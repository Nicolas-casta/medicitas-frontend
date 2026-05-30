import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../api/patients";
import { refreshToken } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import type { Patient } from "../../types";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Pencil, X } from "lucide-react";

export const MyProfilePage = () => {
  const [profile, setProfile] = useState<Patient | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { loginUser } = useAuth();
  const { register, handleSubmit, reset } = useForm<Partial<Patient>>();

  const load = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      reset(res.data);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: Partial<Patient>) => {
    try {
      setSaving(true);
      const res = await updateMyProfile({
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
      });
      loginUser(res.data.accessToken, res.data.refreshToken);
      setEditing(false);
      await load();
    } catch {
      alert("No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (profile === undefined)
    return <p className="text-slate-400 text-sm">Cargando perfil...</p>;

  if (profile === null)
    return <p className="text-red-400 text-sm">Error al cargar el perfil.</p>;

  return (
    <div className="max-w-2xl">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Mi perfil</h1>
        <div className="relative group">
          <button
            onClick={() => setEditing(!editing)}
            className={`p-2 rounded-lg transition-colors ${
              editing
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {editing ? <X size={16} /> : <Pencil size={16} />}
          </button>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none">
            <div className="bg-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg border border-slate-600">
              {editing ? "Cancelar" : "Editar perfil"}
            </div>
          </div>
        </div>
      </div>

      {!editing ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          {/* Fila 1 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Nombre completo</span>
              <p className="text-slate-100 mt-1">{profile.nombre} {profile.apellido}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Documento</span>
              <p className="text-slate-100 mt-1">{profile.documento}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Email</span>
              <p className="text-slate-100 mt-1">{profile.email}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Teléfono</span>
              <p className="text-slate-100 mt-1">{profile.telefono}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Dirección</span>
              <p className="text-slate-100 mt-1">{profile.direccion || "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">EPS</span>
                <p className="text-slate-100 mt-1">{profile.eps || "—"}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Tipo de sangre</span>
                <p className="text-slate-100 mt-1">{profile.tipoSangre || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Email" type="email" register={register("email")} />
            </div>
            <Input label="Teléfono" register={register("telefono")} />
            <Input label="Dirección" register={register("direccion")} />
            <div className="col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};