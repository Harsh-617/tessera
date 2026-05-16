import api from './api'

export async function createMentorProfile(data) {
  const res = await api.post('/profiles/mentor', data)
  return res.data
}

export async function getMentorProfile(userId) {
  const res = await api.get(`/profiles/mentor/${userId}`)
  return res.data
}

export async function updateMentorProfile(data) {
  const res = await api.put('/profiles/mentor', data)
  return res.data
}

export async function createStartupProfile(data) {
  const res = await api.post('/profiles/startup', data)
  return res.data
}

export async function getStartupProfile(userId) {
  const res = await api.get(`/profiles/startup/${userId}`)
  return res.data
}

export async function updateStartupProfile(data) {
  const res = await api.put('/profiles/startup', data)
  return res.data
}
