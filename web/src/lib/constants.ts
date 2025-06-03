export const API_BASE = `${location.protocol}//${
  location.port === '5173'
    ? `${location.hostname}:1337`
    : `${location.host}`
}/api`
