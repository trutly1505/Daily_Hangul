export function getApiErrorMessage(error, fallbackMessage) {
  const apiMessage = error?.response?.data?.message

  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the API server.'
  }

  return fallbackMessage
}
