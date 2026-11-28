import crypto from 'crypto'
import nodemailer from 'nodemailer'

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'yopmail.com',
  'trashmail.com',
  'fakeinbox.com',
  'dispostable.com',
  'getnada.com',
  'sharklasers.com',
  'maildrop.cc',
  'throwawaymail.com',
  'mintemail.com',
  'mohmal.com',
  'emailondeck.com',
  'tempail.com',
  'burnermail.io'
])

function getOtpSecret(): string {
  return (
    process.env.OTP_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY ||
    'prevu-local-dev-otp-secret'
  )
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim()
  if (!domain) return true
  return DISPOSABLE_DOMAINS.has(domain)
}

export function hashOtp(email: string, otp: string): string {
  return crypto
    .createHmac('sha256', getOtpSecret())
    .update(`${email.toLowerCase().trim()}:${otp.trim()}`)
    .digest('hex')
}

export function safeCompareHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
}

export function signTokenPayload<T extends object>(payload: T): string {
  const json = JSON.stringify(payload)
  const data = Buffer.from(json, 'utf8').toString('base64url')
  const sig = crypto
    .createHmac('sha256', getOtpSecret())
    .update(data)
    .digest('base64url')
  return `${data}.${sig}`
}

export function verifyTokenPayload<T>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [data, sig] = parts
    const expectedSig = crypto
      .createHmac('sha256', getOtpSecret())
      .update(data)
      .digest('base64url')

    const sigBuf = Buffer.from(sig, 'utf8')
    const expectedBuf = Buffer.from(expectedSig, 'utf8')
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null
    }

    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
    return decoded as T
  } catch {
    return null
  }
}

export async function sendOtpEmail(toEmail: string, otp: string): Promise<{ devMode?: boolean }> {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  const smtpPort = Number(process.env.SMTP_PORT || 465)

  if (!smtpUser || !smtpPass) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Prevu OTP Dev Mode] SMTP_USER/SMTP_PASS not set. OTP for ${toEmail}: ${otp}`)
      return { devMode: true }
    }
    throw new Error('Email verification service is not configured (missing SMTP credentials).')
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  })

  const fromAddress = process.env.SMTP_FROM || `"Prevu" <${smtpUser}>`

  await transporter.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: `${otp} is your Prevu verification code`,
    text: `Your Prevu email verification code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0b0f17; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
        <h2 style="margin: 0 0 8px; font-size: 20px; color: #22c55e;">Prevu Verification Code</h2>
        <p style="margin: 0 0 20px; font-size: 14px; color: #94a3b8;">
          Use the 6-digit code below to verify your email address and complete your student account registration.
        </p>
        <div style="background: #111827; border: 1px solid #334155; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ffffff;">${otp}</span>
        </div>
        <p style="margin: 0; font-size: 12px; color: #64748b;">
          This code expires in <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>
    `
  })

  return {}
}
