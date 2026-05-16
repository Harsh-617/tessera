import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseConfigured } from '../firebase'
import { verifyAuth } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRoleState] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const setRole = (r) => {
    if (r) localStorage.setItem('tessera_role', r)
    setRoleState(r)
  }

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        setToken(idToken)
        setUser(firebaseUser)
        try {
          const data = await verifyAuth(idToken)
          setRole(data.role)
        } catch {
          setRoleState(localStorage.getItem('tessera_role') || null)
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
    if (auth?.currentUser) {
      const idToken = await auth.currentUser.getIdToken(true)
      setToken(idToken)
      return idToken
    }
  }

  return (
    <AuthContext.Provider value={{ user, role, token, loading, refreshToken, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
