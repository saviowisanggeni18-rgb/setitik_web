export const sectionTextMarker = '__SETITIK_SECTION_TEXTS__:'
export function decodeSectionTextContent(value: string) {
  if (!value.startsWith(sectionTextMarker)) return { description: value, textOverrides: {} as Record<string, string> }
  try {
    const parsed = JSON.parse(value.slice(sectionTextMarker.length)) as { description?: string; textOverrides?: Record<string, string> }
    return { description: parsed.description ?? '', textOverrides: parsed.textOverrides ?? {} }
  } catch { return { description: value, textOverrides: {} as Record<string, string> } }
}
export function encodeSectionTextContent(description: string, textOverrides: Record<string, string>) {
  if (Object.keys(textOverrides).length === 0) return description
  return `${sectionTextMarker}${JSON.stringify({ description, textOverrides })}`
}
export const editableTextSelector = 'h1,h2,h3,h4,h5,h6,p,span,figcaption'
export function collectEditableTextElements(root: HTMLElement) {
  const candidates = [...root.querySelectorAll<HTMLElement>(editableTextSelector)]
  return candidates.filter((element) => {
    if (element.closest('[data-section-editor-control="true"]') || !element.innerText.trim()) return false
    return !candidates.some((candidate) => candidate !== element && element.contains(candidate))
  })
}
