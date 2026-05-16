import api from './api'

export async function generateMatches(programmeId) {
  const res = await api.post(`/programmes/${programmeId}/match`)
  return res.data
}

export async function approveMatch(programmeId, data) {
  const res = await api.post(`/programmes/${programmeId}/match/approve`, data)
  return res.data
}
