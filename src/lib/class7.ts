// Validate against IATA DGR section 4.2 — Class 7 (Radioactive) UN numbers
// excluded from the DG Pre-Check service.
export const CLASS7_UN_NUMBERS = new Set([
  'UN2908','UN2909','UN2910','UN2911','UN2912','UN2913','UN2915','UN2916','UN2917',
  'UN2919','UN2977','UN2978','UN3321','UN3322','UN3323','UN3324','UN3325','UN3326',
  'UN3327','UN3328','UN3329','UN3330','UN3331','UN3332','UN3333','UN3507',
])

export function isClass7Excluded(unNumber: string, hazardClass: string): boolean {
  const normalized = unNumber.toUpperCase().replace(/^UN/, '')
  const classNum   = hazardClass?.match(/^Class\s*(\d+)/i)?.[1]
  return classNum === '7' || CLASS7_UN_NUMBERS.has('UN' + normalized)
}
