import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import loginBg from '@/assets/login-bg.svg'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { defaultRouteForRole } from '@/routes/access'
import { roleLabels, users } from '@/mocks/users'
import { toast } from '@/store/toast.store'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'

export default function Login() {
  const navigate = useNavigate()
  const loginAs = useAuthStore((s) => s.loginAs)
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [userIdError, setUserIdError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [roleError, setRoleError] = useState('')
  const [formError, setFormError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true

    if (!userId.trim()) {
      setUserIdError('User ID is required')
      valid = false
    }
    if (!password) {
      setPasswordError('Password is required')
      valid = false
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters')
      valid = false
    }
    if (!selectedUserId) {
      setRoleError('Please select a user')
      valid = false
    }
    if (!valid) return

    const user = users.find((u) => u.id === selectedUserId)
    if (!user) return
    loginAs(user.id)
    toast.success('Welcome back', `Signed in as ${user.name} (${roleLabels[user.role]}).`)
    navigate(defaultRouteForRole(user.role), { replace: true })
  }

  return (
    <div className="relative flex min-h-screen flex-col items-stretch overflow-x-hidden bg-[#0a1430] text-white lg:h-screen lg:flex-row lg:items-start lg:overflow-hidden">
      {/* Abstract background image */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={loginBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1430]/55 via-transparent to-[#0a1430]/25" />
      </div>

      {/* Brand / headline */}
      <div className="relative z-10 flex flex-1 flex-col justify-start px-8 pt-10 sm:px-12 lg:pl-32 lg:pr-20 lg:pt-14">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            P
          </span>
          <div className="leading-tight">
            <p className="text-lg font-bold tracking-wide">Procura</p>
            <p className="text-xs text-white/50">Saifee Hospital</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 max-w-xl lg:mt-12"
        >
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            <span className="text-sky-400">Procurement</span> Intelligence
          </h1>
          <p className="mt-4 text-lg text-white/60">Smart Sourcing, Real Savings.</p>
        </motion.div>
      </div>

      {/* Sign-in card */}
      <div className="relative z-10 flex w-full justify-center px-6 pb-12 lg:w-[44%] lg:justify-end lg:px-12 lg:pb-12 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">Sign in to Procura</h2>
            <p className="mt-1 text-sm text-white/60">Access your procurement workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="User ID" error={userIdError}>
              <input
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setUserIdError(''); setFormError('') }}
                placeholder="Enter your User ID"
                className="login-input w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </Field>

            <Field label="Password" error={passwordError}>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); setFormError('') }}
                  placeholder="Enter your password"
                  className="login-input w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-white/40 transition-colors hover:text-white/80"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            <Field label="Sign in as" error={roleError}>
              <select
                value={selectedUserId}
                onChange={(e) => { setSelectedUserId(e.target.value); setRoleError(''); setFormError('') }}
                className="login-input w-full bg-transparent text-sm text-white outline-none [&>option]:bg-[#0b1426] [&>option]:text-white"
              >
                <option value="" disabled>Select a user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {roleLabels[u.role]}
                    {u.role === UserRole.HOD ? ` · ${u.department}` : ''}
                  </option>
                ))}
              </select>
            </Field>

            {formError && <p className="text-sm text-rose-400">{formError}</p>}

            <Button
              type="submit"
              className="mt-2 h-12 w-full bg-primary text-base font-semibold hover:bg-primary/90"
            >
              Login
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              Object.keys(localStorage)
                .filter((k) => k.startsWith('procura.'))
                .forEach((k) => localStorage.removeItem(k))
              window.location.reload()
            }}
            className="mt-5 w-full text-center text-xs text-white/40 transition-colors hover:text-white/70"
          >
            Reset demo data
          </button>
        </motion.div>
      </div>
    </div>
  )
}

/** Floating-label field shell matching the reference design. */
function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        className={cn(
          'rounded-xl border bg-[#0b1426] px-4 pb-2.5 pt-2 transition-colors',
          error
            ? 'border-rose-500 focus-within:border-rose-500'
            : 'border-white/15 focus-within:border-sky-400/60',
        )}
      >
        <label className={cn('text-[11px] font-medium', error ? 'text-rose-400' : 'text-white/50')}>
          {label}
        </label>
        {children}
      </div>
      {error && <p className="mt-1.5 pl-1 text-xs text-rose-400">{error}</p>}
    </div>
  )
}
