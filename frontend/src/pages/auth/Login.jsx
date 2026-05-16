import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, firebaseConfigured } from '../../firebase'
import { verifyAuth } from '../../services/auth.service'

export default function Login() {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      const data = await verifyAuth(token)

      if (!data.role) navigate('/role-selection')
      else if (data.role === 'admin') navigate('/admin/dashboard')
      else if (data.role === 'mentor') navigate('/mentor')
      else if (data.role === 'startup') navigate('/startup')
    } catch (err) {
      console.error('Sign-in failed', err)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-12 text-center max-w-sm w-full mx-4">
        <h1 className="text-title-lg font-black text-on-background tracking-tighter mb-1">tessera</h1>
        <p className="text-body-sm text-on-surface-variant mb-8">AI-Powered Ecosystem Relationship Engine</p>

        {!firebaseConfigured ? (
          <div className="bg-surface-container border border-outline-variant rounded p-4 text-left">
            <p className="text-label-caps text-error uppercase tracking-widest mb-2">Firebase not configured</p>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Create <code className="text-primary">frontend/.env</code> from{' '}
              <code className="text-primary">frontend/.env.example</code> and fill in your Firebase project credentials.
            </p>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-primary text-[#131313] py-3 rounded font-title-md hover:opacity-90 transition-opacity"
          >
            Continue with Google
          </button>
        )}
      </div>
    </div>
  )
}
