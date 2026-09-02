export function getFriendlyAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.'
  
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (
    errorMessage.includes('auth/invalid-credential') || 
    errorMessage.includes('auth/wrong-password') || 
    errorMessage.includes('auth/user-not-found')
  ) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }
  if (errorMessage.includes('auth/email-already-in-use')) {
    return 'An account already exists with this email address. Please sign in instead.'
  }
  if (errorMessage.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.'
  }
  if (errorMessage.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.'
  }
  if (errorMessage.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.'
  }
  if (errorMessage.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please wait a few moments and try again.'
  }
  if (errorMessage.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in was closed before completion. Please try again.'
  }
  if (errorMessage.includes('auth/popup-blocked')) {
    return 'Sign-in popup was blocked by your browser. Please allow popups for this site.'
  }
  if (errorMessage.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection.'
  }
  if (errorMessage.includes('auth/requires-recent-login')) {
    return 'Please log in again to perform this sensitive action.'
  }
  
  const match = errorMessage.match(/\(auth\/([a-zA-Z0-9-]+)\)/)
  if (match) {
    const formatted = match[1].replace(/-/g, ' ')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1) + '.'
  }

  return errorMessage.replace(/^Firebase:\s*/, '').replace(/Error\s*\((.*?)\):?\s*/g, '')
}
