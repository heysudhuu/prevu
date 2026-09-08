/**
 * Sends transactional verification emails using the Resend REST API.
 * Gracefully falls back to console logging if RESEND_API_KEY is not configured.
 */
export async function sendOtpEmail({
  toEmail,
  otp
}: {
  toEmail: string
  otp: string
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Prevu Verification <onboarding@resend.dev>'

  if (!apiKey) {
    console.info(`[Prevu Auth] RESEND_API_KEY not configured. Simulated OTP for ${toEmail}: ${otp}`)
    return { success: true, simulated: true }
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090d; color: #fafafa; padding: 24px; margin: 0; }
            .container { max-width: 520px; margin: 0 auto; background: #121218; border: 1px solid #20202c; border-radius: 16px; padding: 32px; }
            .badge { display: inline-block; padding: 4px 12px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 9999px; color: #a78bfa; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
            h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 8px; }
            p { color: #9494a6; font-size: 14px; line-height: 1.6; margin: 8px 0; }
            .otp-box { background: #1c1c27; border: 1px solid #2d2d3f; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
            .otp-code { font-family: 'Courier New', monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #c084fc; }
            .footer { font-size: 12px; color: #64647a; margin-top: 28px; border-top: 1px solid #20202c; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">Prevu • Academic Vault</div>
            <h1>Verify your Chandigarh University Email</h1>
            <p>You requested an institutional verification code to unlock the verified contributor badge on Prevu.</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>

            <p>This code expires in <strong>15 minutes</strong>. If you did not request this verification, you can safely ignore this email.</p>
            
            <div class="footer">
              Prevu • Chandigarh University Student Resource Archive
            </div>
          </div>
        </body>
      </html>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `Your Prevu Verification Code: ${otp}`,
        html: htmlContent
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[Prevu Auth] Resend API error:', errText)
      return { success: false, error: 'Failed to deliver email through transactional mail provider.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[Prevu Auth] Failed to send email:', err)
    return { success: false, error: 'Network error communicating with mail provider.' }
  }
}
