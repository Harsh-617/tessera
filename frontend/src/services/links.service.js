import api from './api'

export async function getLinks() {
  const res = await api.get('/links')
  return res.data
}

export async function getLink(id) {
  const res = await api.get(`/links/${id}`)
  return res.data
}

export async function activateLink(id) {
  const res = await api.put(`/links/${id}/activate`)
  return res.data
}

export async function completeLink(id, data) {
  const res = await api.put(`/links/${id}/complete`, data)
  return res.data
}

export async function getLinkEvents(id) {
  const res = await api.get(`/links/${id}/events`)
  return res.data
}
