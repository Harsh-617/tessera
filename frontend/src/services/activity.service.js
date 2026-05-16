import api from './api'

export async function getCheckins(linkId) {
  const res = await api.get(`/links/${linkId}/checkins`)
  return res.data
}

export async function createCheckin(linkId, data) {
  const res = await api.post(`/links/${linkId}/checkins`, data)
  return res.data
}

export async function getMilestones(linkId) {
  const res = await api.get(`/links/${linkId}/milestones`)
  return res.data
}

export async function createMilestone(linkId, data) {
  const res = await api.post(`/links/${linkId}/milestones`, data)
  return res.data
}

export async function updateMilestone(milestoneId, data) {
  const res = await api.put(`/milestones/${milestoneId}`, data)
  return res.data
}
