import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, firebaseConfigured } from '../../firebase'
import { verifyAuth } from '../../services/auth.service'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      try {
        const data = await verifyAuth(token)
        if (!data.role) navigate('/role-selection')
        else if (data.role === 'admin') navigate('/admin/dashboard')
        else if (data.role === 'mentor') navigate('/mentor')
        else if (data.role === 'startup') navigate('/startup')
        else navigate('/role-selection')
      } catch {
        // Backend unreachable — Google auth succeeded, proceed to role selection
        navigate('/role-selection')
      }
    } catch (err) {
      console.error('Sign-in failed', err)
      setError(err?.code || err?.message || 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#ededee] flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <div className="ds-vignette" />

      <header className="relative z-10 flex items-center justify-between px-9 py-7 text-[#8a8a92] text-[12px] tracking-[0.14em] uppercase">
        <div className="flex items-center">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#6fcf97] mr-2.5"
            style={{ boxShadow: '0 0 0 4px rgba(111,207,151,0.12)' }}
          />
          System online
        </div>
        <a href="#" className="text-[#8a8a92] hover:text-[#ededee] no-underline transition-colors duration-200">Need help?</a>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[440px] flex flex-col items-center gap-10">

          <h1
            className="font-fraunces font-light text-[#ededee] text-center leading-[0.95] tracking-[-0.045em] m-0"
            style={{ fontSize: 'clamp(72px, 11vw, 128px)', fontFeatureSettings: '"ss01" on' }}
          >
            tessera
            <span
              className="inline-block rounded-full bg-[#ededee] ml-[0.06em]"
              style={{ width: '0.12em', height: '0.12em', transform: 'translateY(-0.08em)', verticalAlign: 'middle' }}
            />
          </h1>

          <p className="text-[#8a8a92] text-[13px] tracking-[0.28em] uppercase text-center -mt-6 m-0">
            AI-Powered Ecosystem Relationship Engine
          </p>

          <div className="w-full flex flex-col gap-3.5">
            {!firebaseConfigured ? (
              <div className="bg-[#131316] border border-[#232327] rounded-xl p-4 text-left">
                <p className="text-[11px] text-red-400 uppercase tracking-widest mb-2 m-0">Firebase not configured</p>
                <p className="text-[12px] text-[#8a8a92] leading-relaxed m-0">
                  Create <code className="text-[#ededee]">frontend/.env</code> from{' '}
                  <code className="text-[#ededee]">frontend/.env.example</code> and fill in your Firebase credentials.
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="h-[52px] rounded-full bg-[#ededee] text-[#0b0b0c] font-medium text-[15px] tracking-[0.01em] flex items-center justify-center gap-2.5 hover:bg-white transition-colors duration-200 disabled:opacity-60 active:translate-y-px border-0 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M21.6 12.227c0-.682-.061-1.337-.175-1.965H12v3.717h5.385a4.6 4.6 0 0 1-1.997 3.022v2.51h3.232c1.892-1.743 2.98-4.31 2.98-7.284Z" fill="#4285F4"/>
                    <path d="M12 22c2.7 0 4.964-.895 6.62-2.43l-3.232-2.51c-.896.6-2.042.955-3.388.955-2.605 0-4.81-1.76-5.598-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22Z" fill="#34A853"/>
                    <path d="M6.402 13.892A5.99 5.99 0 0 1 6.09 12c0-.658.114-1.297.312-1.892V7.518H3.064A9.997 9.997 0 0 0 2 12c0 1.614.386 3.14 1.064 4.482l3.338-2.59Z" fill="#FBBC05"/>
                    <path d="M12 5.985c1.47 0 2.787.505 3.823 1.498l2.868-2.868C16.96 2.99 14.695 2 12 2 8.09 2 4.71 4.24 3.064 7.518l3.338 2.59C7.19 7.745 9.395 5.985 12 5.985Z" fill="#EA4335"/>
                  </svg>
                  {loading ? 'Signing in…' : 'Sign in with Google'}
                </button>

                <div className="ds-divider">or</div>

                <button className="h-[52px] rounded-full bg-transparent text-[#ededee] font-medium text-[15px] border border-[#232327] hover:border-[#3a3a40] hover:bg-white/[0.02] transition-all duration-200 flex items-center justify-center cursor-pointer active:translate-y-px">
                  Sign in with email
                </button>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-left">
                    <p className="text-[11px] text-red-400 uppercase tracking-widest mb-1 m-0">Error</p>
                    <p className="text-[12px] text-red-400/80 m-0">{error}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-[#5b5b62] text-[12px] text-center leading-relaxed m-0">
            By continuing you agree to our{' '}
            <a href="#" className="text-[#8a8a92] no-underline border-b border-[#232327] pb-px hover:text-[#ededee] transition-colors duration-200">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#8a8a92] no-underline border-b border-[#232327] pb-px hover:text-[#ededee] transition-colors duration-200">Privacy Policy</a>.
          </p>
        </div>
      </main>

      <footer className="relative z-10 h-16 flex items-center justify-between px-9 text-[#5b5b62] text-[11px] tracking-[0.2em] uppercase">
        <div>© 2026 Tessera</div>
        <div className="flex gap-7">
          {['Status', 'Docs', 'Contact'].map(link => (
            <a key={link} href="#" className="text-[#5b5b62] no-underline hover:text-[#ededee] transition-colors duration-200">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}