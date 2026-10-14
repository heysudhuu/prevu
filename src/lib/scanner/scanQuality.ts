/**
 * Client-side scan quality and readability analyzer.
 * Checks for image blurriness (Variance of Laplacian), extreme low-light exposure,
 * and low resolution before uploading to prevent moderation rejections.
 */

export interface QualityAnalysisResult {
  isBlurry: boolean
  isTooDark: boolean
  isLowRes: boolean
  isAcceptable: boolean
  score: number // 0 to 100
  issues: string[]
  previewUrl?: string
}

/**
 * Evaluates an image file for sharpness, contrast, and lighting.
 */
export async function analyzeImageQuality(file: File): Promise<QualityAnalysisResult> {
  // Only analyze images
  if (!file.type.startsWith('image/')) {
    return {
      isBlurry: false,
      isTooDark: false,
      isLowRes: false,
      isAcceptable: true,
      score: 100,
      issues: []
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      try {
        const issues: string[] = []
        const isLowRes = img.naturalWidth < 700 || img.naturalHeight < 700
        if (isLowRes) {
          issues.push('Low resolution (below 700px). Small text may not be readable.')
        }

        // Downscale to max 400px width for fast 60fps canvas analysis
        const canvas = document.createElement('canvas')
        const scale = Math.min(1, 400 / img.naturalWidth)
        canvas.width = Math.round(img.naturalWidth * scale)
        canvas.height = Math.round(img.naturalHeight * scale)

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) {
          URL.revokeObjectURL(objectUrl)
          return resolve({
            isBlurry: false,
            isTooDark: false,
            isLowRes,
            isAcceptable: true,
            score: 85,
            issues
          })
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        const len = data.length

        // 1. Grayscale luminance and average brightness
        let totalBrightness = 0
        const grayscale = new Float32Array(canvas.width * canvas.height)
        let gIdx = 0

        for (let i = 0; i < len; i += 4) {
          // Standard ITU-R BT.601 luminance
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          grayscale[gIdx++] = lum
          totalBrightness += lum
        }

        const avgBrightness = totalBrightness / (canvas.width * canvas.height)
        const isTooDark = avgBrightness < 50
        if (isTooDark) {
          issues.push('Scan appears too dark or shadowed. Document marks might be obscured.')
        }

        // 2. Variance of Laplacian (Blurriness metric)
        const w = canvas.width
        const h = canvas.height
        let laplacianSum = 0
        let laplacianSqSum = 0
        let lapCount = 0

        // 3x3 Laplacian kernel:
        // [  0,  1,  0 ]
        // [  1, -4,  1 ]
        // [  0,  1,  0 ]
        for (let y = 1; y < h - 1; y++) {
          const rowOffset = y * w
          for (let x = 1; x < w - 1; x++) {
            const idx = rowOffset + x
            const lapVal =
              grayscale[idx - w] +
              grayscale[idx + w] +
              grayscale[idx - 1] +
              grayscale[idx + 1] -
              4 * grayscale[idx]

            laplacianSum += lapVal
            laplacianSqSum += lapVal * lapVal
            lapCount++
          }
        }

        const lapMean = laplacianSum / (lapCount || 1)
        const varianceOfLaplacian = (laplacianSqSum / (lapCount || 1)) - (lapMean * lapMean)

        // Threshold for downscaled document photos: < 75 is noticeably blurry
        const isBlurry = varianceOfLaplacian < 75
        if (isBlurry) {
          issues.push('Document appears blurry or out of focus. Camera shake detected.')
        }

        // Compute overall readability score (0 - 100)
        let score = 100
        if (isBlurry) score -= 40
        if (isTooDark) score -= 30
        if (isLowRes) score -= 20
        score = Math.max(10, Math.min(100, score))

        URL.revokeObjectURL(objectUrl)
        resolve({
          isBlurry,
          isTooDark,
          isLowRes,
          isAcceptable: issues.length === 0,
          score,
          issues,
          previewUrl: objectUrl
        })
      } catch (err) {
        console.warn('Scan quality analysis skipped:', err)
        URL.revokeObjectURL(objectUrl)
        resolve({
          isBlurry: false,
          isTooDark: false,
          isLowRes: false,
          isAcceptable: true,
          score: 90,
          issues: []
        })
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        isBlurry: false,
        isTooDark: false,
        isLowRes: false,
        isAcceptable: true,
        score: 90,
        issues: []
      })
    }

    img.src = objectUrl
  })
}

/**
 * Auto-enhances an image scan by boosting contrast, brightening paper background,
 * and darkening question text (adaptive document threshold filter).
 * Returns a new enhanced File object.
 */
export async function autoEnhanceDocumentScan(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(objectUrl)
          return resolve(file)
        }

        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = imgData.data

        // Apply document contrast curve:
        // Whitens paper background while darkening ink
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i]
          const g = d[i + 1]
          const b = d[i + 2]

          // High-contrast S-curve
          // Make values above 160 brighter, values below 110 darker
          d[i] = Math.min(255, Math.max(0, ((r - 128) * 1.35) + 140))
          d[i + 1] = Math.min(255, Math.max(0, ((g - 128) * 1.35) + 140))
          d[i + 2] = Math.min(255, Math.max(0, ((b - 128) * 1.35) + 140))
        }

        ctx.putImageData(imgData, 0, 0)

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl)
          if (!blob) return resolve(file)

          const enhancedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '') + '_enhanced.jpg',
            { type: 'image/jpeg', lastModified: Date.now() }
          )
          resolve(enhancedFile)
        }, 'image/jpeg', 0.92)
      } catch (err) {
        URL.revokeObjectURL(objectUrl)
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}
