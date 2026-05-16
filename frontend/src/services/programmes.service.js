import api from './api'

export async function getProgrammes() {
  const res = await api.get('/programmes')
  return res.data
}

export async function getProgramme(id) {
  const res = await api.get(`/programmes/${id}`)
  return res.data
}

export async function createProgramme(data) {
  const res = await api.post('/programmes', data)
  return res.data
}

export async function updateProgramme(id, data) {
  const res = await api.put(`/programmes/${id}`, data)
  return res.data
}

export async function enrollActor(programmeId, data) {
  const res = await api.post(`/programmes/${programmeId}/enroll`, data)
  return res.data
}

export async function getProgrammeActors(programmeId) {
  const res = await api.get(`/programmes/${programmeId}/actors`)
  return res.data
}
