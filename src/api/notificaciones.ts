import api from "./axios";
import type { NotificacionRequest } from "../types";

export const enviarNotificacion = (data: NotificacionRequest) =>
  api.post("/notifications", data);
