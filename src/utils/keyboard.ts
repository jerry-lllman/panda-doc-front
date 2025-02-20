import { PLATFORM } from "../constants"

export function getPlatform() {
  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return PLATFORM.MACOS
  }
  if (platform.includes('win') || userAgent.includes('win')) {
    return PLATFORM.WINDOWS
  }
  return PLATFORM.OTHER
}

export function isCommand(event: React.KeyboardEvent<HTMLElement>) {
  console.log('%c👉  event: ', 'background:#41b883;padding:1px; border-radius: 0 3px 3px 0;color: #fff', event) // 👈
  const platform = getPlatform()
  debugger
  return platform === PLATFORM.MACOS ? event.metaKey : event.ctrlKey
}