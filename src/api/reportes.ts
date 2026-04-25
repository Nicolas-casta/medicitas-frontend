import api from "./axios";
import type { ReportePeriodo, ReporteProductividad } from "../types";

export const getReportePeriodo = (fechaInicio: string, fechaFin: string) =>
  api.get<ReportePeriodo>("/reportes/periodo", {
    params: { fechaInicio, fechaFin },
  });

export const getReporteProductividad = (
  fechaInicio: string,
  fechaFin: string,
  doctorId?: number,
) =>
  api.get<ReporteProductividad[]>("/reportes/productividad", {
    params: { fechaInicio, fechaFin, ...(doctorId ? { doctorId } : {}) },
  });
