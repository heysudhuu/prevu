import { initializeApp, getApps, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin for server-side auth verification
// We only need projectId to verify ID tokens, no service account needed for this specific feature.
const app = getApps().length > 0 ? getApp() : initializeApp({
  projectId: "prevu-f35a3",
})

export const authAdmin = getAuth(app)
