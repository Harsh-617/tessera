import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../../firebase'
import { verifyAuth } from '../../services/auth.service'

export default function Login() {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      const data = await verifyAuth(token)

      if (!data.role) {
        navigate('/role-selection')
      } else if (data.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (data.role === 'mentor') {
        navigate('/mentor')
      } else if (data.role === 'startup') {
        navigate('/startup')
      }
    } catch (err) {
      console.error('Sign-in failed', err)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f9fafb',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 48,
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)', textAlign: 'center',
        maxWidth: 400, width: '100%',
      }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: '#6366f1', marginBottom: 8 }}>
          tessera
        </div>
        <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 15 }}>
          AI-Powered Ecosystem Relationship Engine
        </p>
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}
