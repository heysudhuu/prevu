import { initializeApp, getApps, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp()
  }
  try {
    return initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "prevu-f35a3",
    })
  } catch {
    return getApp()
  }
}

export const authAdmin = {
  async verifyIdToken(token: string) {
    try {
      const app = getFirebaseAdminApp()
      const auth = getAuth(app)
      return await auth.verifyIdToken(token)
    } catch (err) {
      console.warn("Firebase token verification failed:", err)
      throw err
    }
  }
}
