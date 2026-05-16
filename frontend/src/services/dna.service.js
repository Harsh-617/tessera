import api from './api'

export async function getDnaBlueprints(params = {}) {
  const res = await api.get('/dna', { params })
  return res.data
}

export async function getDnaBlueprint(id) {
  const res = await api.get(`/dna/${id}`)
  return res.data
}
