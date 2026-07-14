import api from './axiosInstance'
import type { Client } from '../../modules/clients/types'

export interface CreateClientPayload {
  fullName: string
  email: string
  phone?: string
}

export interface UpdateClientPayload {
  fullName?: string
  email?: string
  phone?: string
}

export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients').then((r) => r.data),

  getById: (id: string) => api.get<Client>(`/clients/${id}`).then((r) => r.data),

  create: (data: CreateClientPayload) =>
    api.post<Client>('/clients', data).then((r) => r.data),

  update: (id: string, data: UpdateClientPayload) =>
    api.put<Client>(`/clients/${id}`, data).then((r) => r.data),

  deactivate: (id: string) =>
    api.patch<Client>(`/clients/${id}/deactivate`).then((r) => r.data),
}
