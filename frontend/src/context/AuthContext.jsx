import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { verifyAuth } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        setToken(idToken)
        setUser(firebaseUser)
        try {
          const data = await verifyAuth(idToken)
          setRole(data.role)
        } catch {
          setRole(null)
        }
      } else {
        setUser(null)
        setRole(null)
        setToken(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const refreshToken = async () => {
    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken(true)
      setToken(idToken)
      return idToken
    }
  }

  return (
    <AuthContext.Provider value={{ user, role, token, loading, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
