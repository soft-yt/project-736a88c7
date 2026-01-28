import type { BridgeEvent, BridgeCommand, BridgeConfig, BridgeState } from './types'

export type { BridgeEvent, BridgeCommand, BridgeConfig, BridgeState }

const HOVER_THROTTLE_MS = 50
const MAX_TEXT_CONTENT_LENGTH = 500
const SAFE_SELECTOR_REGEX = /^[\w\-\[\]="'.:# >+~()]+$/

const state: BridgeState = {
  initialized: false,
  allowedOrigin: null,
  pickModeEnabled: false,
  hoveredElementId: null,
  selectedElementId: null,
}

let lastHoverTime = 0

export function initBridge(config?: BridgeConfig): void {
  if (state.initialized) {
    console.warn('[bridge-sdk] Already initialized')
    return
  }

  // Get origin from: 1) config, 2) URL param, 3) env var
  const urlParams = new URLSearchParams(window.location.search)
  const origin = config?.origin
    || urlParams.get('shell_origin')
    || import.meta.env?.VITE_SHELL_ORIGIN

  if (!origin || origin === '*') {
    console.error('[bridge-sdk] shell_origin is required. Pass via URL param ?shell_origin=... or VITE_SHELL_ORIGIN env')
    return
  }

  state.allowedOrigin = origin
  state.initialized = true

  postToShell({ type: 'ready' })

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('click', handleClick, true)
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('message', handleCommand)

  console.log('[bridge-sdk] Initialized with origin:', origin)
}

export function destroyBridge(): void {
  if (!state.initialized) return

  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('click', handleClick, true)
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('message', handleCommand)

  state.initialized = false
  state.allowedOrigin = null
  state.pickModeEnabled = false
  state.hoveredElementId = null
  state.selectedElementId = null

  console.log('[bridge-sdk] Destroyed')
}

export function getBridgeState(): Readonly<BridgeState> {
  return { ...state }
}

export function setPickMode(enabled: boolean): void {
  state.pickModeEnabled = enabled
}

function postToShell(event: Omit<BridgeEvent, 'source'>): void {
  if (!state.initialized || !state.allowedOrigin) return
  const fullEvent: BridgeEvent = { source: 'bridge-sdk', ...event }
  window.parent.postMessage(fullEvent, state.allowedOrigin)
}

function handleClick(e: MouseEvent): void {
  const el = (e.target as HTMLElement).closest('[data-ve-id]') as HTMLElement | null
  if (!el) return

  if (!state.pickModeEnabled && !e.altKey) return

  e.preventDefault()
  e.stopPropagation()

  const elementId = el.getAttribute('data-ve-id')
  if (!elementId) return

  state.selectedElementId = elementId

  postToShell({
    type: 'select',
    elementId,
    rect: el.getBoundingClientRect(),
    className: el.className || '',
    textContent: (el.textContent || '').trim().slice(0, MAX_TEXT_CONTENT_LENGTH),
    tagName: el.tagName.toLowerCase(),
  })
}

function handleMouseMove(e: MouseEvent): void {
  if (!state.pickModeEnabled) return

  const now = Date.now()
  if (now - lastHoverTime < HOVER_THROTTLE_MS) return
  lastHoverTime = now

  const el = (e.target as HTMLElement).closest('[data-ve-id]') as HTMLElement | null

  if (!el) {
    if (state.hoveredElementId) {
      state.hoveredElementId = null
      postToShell({ type: 'deselect' })
    }
    return
  }

  const elementId = el.getAttribute('data-ve-id')
  if (!elementId) return

  if (elementId !== state.hoveredElementId) {
    state.hoveredElementId = elementId
    postToShell({
      type: 'hover',
      elementId,
      rect: el.getBoundingClientRect(),
    })
  }
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && state.selectedElementId) {
    state.selectedElementId = null
    postToShell({ type: 'deselect' })
  }
}

function handleCommand(e: MessageEvent): void {
  if (!state.allowedOrigin || e.origin !== state.allowedOrigin) return
  if (e.data?.source !== 'editor-shell') return

  const cmd = e.data as BridgeCommand

  switch (cmd.type) {
    case 'highlight':
      if (cmd.payload?.selector) highlightElement(cmd.payload.selector)
      break
    case 'scroll-to':
      if (cmd.payload?.selector) scrollToElement(cmd.payload.selector)
      break
    case 'refresh-map':
      postToShell({ type: 'map-changed' })
      break
    case 'set-pick-mode':
      state.pickModeEnabled = cmd.payload?.enabled ?? false
      break
  }
}

function isValidSelector(selector: string): boolean {
  return SAFE_SELECTOR_REGEX.test(selector) && selector.length < 500
}

function highlightElement(selector: string): void {
  if (!isValidSelector(selector)) return
  const el = document.querySelector(selector) as HTMLElement | null
  if (!el) return

  const originalOutline = el.style.outline
  el.style.outline = '2px solid #3b82f6'
  setTimeout(() => { el.style.outline = originalOutline }, 1500)
}

function scrollToElement(selector: string): void {
  if (!isValidSelector(selector)) return
  const el = document.querySelector(selector) as HTMLElement | null
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
