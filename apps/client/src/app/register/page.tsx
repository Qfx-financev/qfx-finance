'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../../apps_client_authStore'
import { api } from '../../../apps_client_api'

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const setUser = useAuthStore((state: any) => state.setUser)
  const setToken = useAuthStore((state: any) => state.setToken)

  const fullName = watch('fullName')
  const email = watch('email')
  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const isFormValid = fullName && email && password && confirmPassword && !errors.fullName && !errors.email && !errors.password && !errors.confirmPassword && passwordsMatch

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true)
      setApiError(null)

      const response = await api.post('/auth/register', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })

      const { user, token } = response.data
      setUser(user)
      setToken(token)
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', token)
      
      setSuccess(true)
      
      // Redirect after 1.5 seconds to show success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      setApiError(message)
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark via-dark-50 to-dark-100 flex items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden">
        {/* Animated background gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-success/15 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-success/15 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="w-full max-w-md sm:max-w-lg relative z-10 animate-fadeInUp text-center">
          <div className="glass-card p-7 sm:p-9 lg:p-11">
            <div className="mb-8 sm:mb-10 flex justify-center">
              <div className="icon-badge animate-pulse pulse-glow">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Account Created!
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-8 sm:mb-10">
              Welcome to QFX Finance. Your secure banking account is ready to use.
            </p>

            <div className="flex gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-success/70 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-success/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-3 h-3 rounded-full bg-success/30 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark via-dark-50 to-dark-100 flex items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden">
      {/* Animated background gradient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md sm:max-w-lg relative z-10 animate-fadeInUp">
        {/* Premium glass card */}
        <div className="glass-card p-7 sm:p-9 lg:p-11">
          {/* Header section with premium styling */}
          <div className="mb-9 sm:mb-12 text-center">
            <div className="icon-badge mb-6 mx-auto">
              <User className="w-6 h-6 text-primary" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Open Account
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-sm mx-auto">
              Join QFX Finance and start your crypto banking journey
            </p>
          </div>

          {/* Animated error message */}
          {apiError && (
            <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-danger/10 border border-danger/40 flex items-start gap-3 animate-slideDown error-shake">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-danger/95 font-medium">{apiError}</p>
            </div>
          )}

          {/* Form with improved spacing */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-section mb-8 sm:mb-10">
            {/* Full Name field */}
            <div className="space-y-2.5">
              <label htmlFor="fullName" className="input-label">
                Full Name
              </label>

              <div className="relative group">
                <User className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none transition-colors group-focus-within:text-primary/70" />
                <input
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="glass-input pl-12 sm:pl-14 text-base"
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              {errors.fullName && (
                <p className="text-xs sm:text-sm text-danger font-medium flex items-center gap-1.5 mt-2.5 animate-slideDown">
                  <span className="text-lg">⚠</span> {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2.5">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>

              <div className="relative group">
                <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none transition-colors group-focus-within:text-primary/70" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="glass-input pl-12 sm:pl-14 text-base"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {errors.email && (
                <p className="text-xs sm:text-sm text-danger font-medium flex items-center gap-1.5 mt-2.5 animate-slideDown">
                  <span className="text-lg">⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2.5">
              <label htmlFor="password" className="input-label">
                Password
              </label>

              <div className="relative group">
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none transition-colors group-focus-within:text-primary/70" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must contain uppercase, lowercase, and number',
                    },
                  })}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="glass-input pl-12 sm:pl-14 pr-12 sm:pr-14 text-base"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs sm:text-sm text-danger font-medium flex items-center gap-1.5 mt-2.5 animate-slideDown">
                  <span className="text-lg">⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2.5">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password
              </label>

              <div className="relative group">
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none transition-colors group-focus-within:text-primary/70" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                  })}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="glass-input pl-12 sm:pl-14 pr-12 sm:pr-14 text-base"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50"
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {!passwordsMatch && confirmPassword && (
                <p className="text-xs sm:text-sm text-danger font-medium flex items-center gap-1.5 mt-2.5 animate-slideDown">
                  <span className="text-lg">⚠</span> Passwords do not match
                </p>
              )}
            </div>

            {/* Terms checkbox with improved styling */}
            <label className="flex items-start gap-3 cursor-pointer group pt-2">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-md bg-white/5 border border-white/20 accent-primary cursor-pointer transition-all hover:border-white/30 flex-shrink-0 mt-1"
                disabled={loading}
                required
              />
              <span className="text-xs sm:text-sm text-white/70 group-hover:text-white/90 transition-colors leading-relaxed font-medium">
                I agree to the <span className="text-primary font-semibold">Terms of Service</span> and acknowledge the <span className="text-primary font-semibold">Privacy Policy</span>
              </span>
            </label>

            {/* Premium submit button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="glass-button-primary w-full py-4 sm:py-5 text-base sm:text-lg font-bold flex items-center justify-center gap-2 mt-8 sm:mt-10"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Secure Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Premium divider */}
          <div className="form-divider mb-8 sm:mb-10" />

          {/* Login link */}
          <p className="text-center text-white/70 text-sm sm:text-base">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-secondary font-bold transition-all hover:underline decoration-2 underline-offset-2"
            >
              Sign In
            </Link>
          </p>

          {/* Security footer */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
            <p className="text-xs text-white/50 text-center leading-relaxed">
              🔐 Enterprise-grade encryption • 2FA support • Non-custodial wallets
            </p>
          </div>
        </div>

        {/* Decorative accent dots */}
        <div className="mt-8 sm:mt-10 flex justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-secondary/70 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-accent/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-2 h-2 rounded-full bg-secondary/40 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </main>
  )
}
