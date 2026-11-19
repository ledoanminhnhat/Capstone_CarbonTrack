import type { Activity, NewActivity } from "../types";
import { request } from "@/services/http";

export const getActivities = () => request<Activity[]>("/api/activities");

export const logActivity = (input: NewActivity) =>
  request<Activity>("/api/activities", { method: "POST", body: input });

export const deleteActivity = (id: string) => request(`/api/activities/${id}`, { method: "DELETE" });
