import api from './api'

export async function verifyAuth(token) {
  const res = await api.post('/auth/verify', {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data
}

export async function setRole(role) {
  const res = await api.post('/auth/verify', { role })
  return res.data
}
