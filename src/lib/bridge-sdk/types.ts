/**
 * Events sent from Preview (bridge-sdk) to Editor Shell
 */
export interface BridgeEvent {
  source: 'bridge-sdk'
  type: 'ready' | 'map-changed' | 'select' | 'hover' | 'deselect' | 'error' | 'inline-editor-open' | 'inline-editor-close'
  elementId?: string
  rect?: DOMRect
  className?: string
  textContent?: string
  tagName?: string
  error?: { message: string; stack?: string }
  position?: { x: number; y: number }
}

export interface BridgeCommand {
  source: 'editor-shell'
  type: 'highlight' | 'scroll-to' | 'refresh-map' | 'set-pick-mode' | 'inline-editor-request'
  payload?: {
    selector?: string
    enabled?: boolean
    elementId?: string
  }
}

export interface BridgeConfig {
  origin?: string
  captureConsole?: boolean
  projectId?: string
  apiBaseUrl?: string
}

export interface BridgeState {
  initialized: boolean
  allowedOrigin: string | null
  pickModeEnabled: boolean
  hoveredElementId: string | null
  selectedElementId: string | null
}
