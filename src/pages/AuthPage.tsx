import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../contexts/AuthContext'
import { isValidEmail } from '../lib/utils'
import { Sparkles, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Github } from 'lucide-react'

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  general?: string
}

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading, error: authError, signIn, signUp, signInWithGithub, clearError } = useAuth()
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Check URL params for mode
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const urlMode = urlParams.get('mode')
    if (urlMode === 'signup') {
      setMode('signup')
    }
  }, [location])

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [user, authLoading, navigate, location])

  // Clear errors when switching modes
  useEffect(() => {
    clearError()
    setFormErrors({})
    setSuccessMessage('')
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
  }, [mode, clearError])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    // Signup-specific validation
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        errors.name = 'Name is required'
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    clearError()
    setSuccessMessage('')
    setFormErrors({})

    try {
      let result
      
      if (mode === 'signup') {
        result = await signUp(formData.email, formData.password, {
          name: formData.name
        })
        
        if (!result.error) {
          setSuccessMessage('Account created successfully! Please check your email to verify your account.')
        }
      } else {
        result = await signIn(formData.email, formData.password)
        
        if (!result.error) {
          setSuccessMessage('Welcome back! Redirecting to your dashboard...')
          // Navigation will be handled by the useEffect above
        }
      }

      if (result.error) {
        setFormErrors({ general: result.error.message })
      }
    } catch (error) {
      console.error('Unexpected auth error:', error)
      setFormErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsSubmitting(true)
    clearError()
    setFormErrors({})
    
    try {
      const result = await signInWithGithub()
      if (result.error) {
        setFormErrors({ general: result.error.message })
      }
    } catch (error) {
      console.error('GitHub login error:', error)
      setFormErrors({ general: 'GitHub login failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear general error when user makes changes
    if (formErrors.general) {
      setFormErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading AI Universe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Universe
            </span>
          </Link>
        </div>

        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {mode === 'signup' 
                ? 'Start building your AI universe today'
                : 'Sign in to your AI universe'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
                </div>
              )}

              {/* Error Messages */}
              {(authError || formErrors.general) && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {authError || formErrors.general}
                  </p>
                </div>
              )}

              {/* Name Field (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={formErrors.name ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                />
                {formErrors.email && (
                  <p id="email-error" className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={formErrors.password ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.password}
                  aria-describedby={formErrors.password ? 'password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {formErrors.password && (
                  <p id="password-error" className="text-sm text-red-500 mt-1">{formErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={formErrors.confirmPassword ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                    aria-invalid={!!formErrors.confirmPassword}
                    aria-describedby={formErrors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  {formErrors.confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-red-500 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>

              {/* GitHub Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full" 
                onClick={handleGithubLogin}
                disabled={isSubmitting}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </form>

            {/* Mode Switch */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="text-primary hover:underline font-medium"
                  disabled={isSubmitting}
                >
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}