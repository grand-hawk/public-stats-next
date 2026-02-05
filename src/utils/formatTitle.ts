export function formatTitle(text?: string | null, initials?: string | null) {
  return `${text ? `${text} - ` : ''}${(initials || 'MTC').toUpperCase()} Stats`;
}
