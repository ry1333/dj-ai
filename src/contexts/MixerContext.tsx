import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

// Control identifiers for the mixer
export type MixerControlId =
  | 'deckA.play'
  | 'deckA.pause'
  | 'deckA.cue'
  | 'deckA.eq.low'
  | 'deckA.eq.mid'
  | 'deckA.eq.high'
  | 'deckA.tempo'
  | 'deckB.play'
  | 'deckB.pause'
  | 'deckB.cue'
  | 'deckB.eq.low'
  | 'deckB.eq.mid'
  | 'deckB.eq.high'
  | 'deckB.tempo'
  | 'crossfader'
  | 'masterVolume'

// Mixer events
export type MixerEvent =
  | { type: 'controlChange'; controlId: MixerControlId; value: number; timestamp: number }
  | { type: 'timeUpdate'; deck: 'A' | 'B'; time: number; timestamp: number }
  | { type: 'playStateChange'; deck: 'A' | 'B'; playing: boolean; timestamp: number }
  | { type: 'trackLoaded'; deck: 'A' | 'B'; filename: string; duration: number; timestamp: number }

// Deck state
export interface DeckState {
  playing: boolean
  currentTime: number
  duration: number
  bpm: number
  filename: string
  eq: {
    low: number  // -12 to +12 dB
    mid: number
    high: number
  }
  tempo: number // 0.8 to 1.2 (playback rate)
}

// Mixer state
export interface MixerState {
  decks: {
    A: DeckState
    B: DeckState
  }
  crossfader: number // 0 to 1 (0 = A, 0.5 = center, 1 = B)
  masterVolume: number // 0 to 1
}

// Event subscriber type
type EventSubscriber = (event: MixerEvent) => void

// Mixer API
export interface MixerApi {
  state: MixerState
  setControl: (controlId: MixerControlId, value: number) => void
  updateDeckTime: (deck: 'A' | 'B', time: number) => void
  updatePlayState: (deck: 'A' | 'B', playing: boolean) => void
  loadTrack: (deck: 'A' | 'B', filename: string, duration: number, bpm: number) => void
  subscribe: (fn: EventSubscriber) => () => void
  getControlValue: (controlId: MixerControlId) => number
}

const MixerContext = createContext<MixerApi | null>(null)

// Initial state
const initialDeckState: DeckState = {
  playing: false,
  currentTime: 0,
  duration: 0,
  bpm: 120,
  filename: '',
  eq: { low: 0, mid: 0, high: 0 },
  tempo: 1.0
}

const initialState: MixerState = {
  decks: {
    A: { ...initialDeckState },
    B: { ...initialDeckState }
  },
  crossfader: 0.5,
  masterVolume: 0.8
}

export function MixerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MixerState>(initialState)
  const subscribersRef = useRef<Set<EventSubscriber>>(new Set())

  // Emit event to all subscribers
  const emit = useCallback((event: MixerEvent) => {
    subscribersRef.current.forEach(fn => fn(event))
  }, [])

  // Subscribe to events
  const subscribe = useCallback((fn: EventSubscriber) => {
    subscribersRef.current.add(fn)
    return () => {
      subscribersRef.current.delete(fn)
    }
  }, [])

  // Set a control value
  const setControl = useCallback((controlId: MixerControlId, value: number) => {
    setState(prev => {
      const next = { ...prev }

      // Parse control ID
      const parts = controlId.split('.')

      if (parts[0] === 'deckA' || parts[0] === 'deckB') {
        const deck = parts[0] === 'deckA' ? 'A' : 'B'
        const deckState = { ...next.decks[deck] }

        if (parts[1] === 'eq') {
          const eqParam = parts[2] as 'low' | 'mid' | 'high'
          deckState.eq = { ...deckState.eq, [eqParam]: Math.max(-12, Math.min(12, value)) }
        } else if (parts[1] === 'tempo') {
          deckState.tempo = Math.max(0.8, Math.min(1.2, value))
        }

        next.decks[deck] = deckState
      } else if (controlId === 'crossfader') {
        next.crossfader = Math.max(0, Math.min(1, value))
      } else if (controlId === 'masterVolume') {
        next.masterVolume = Math.max(0, Math.min(1, value))
      }

      return next
    })

    // Emit event
    emit({
      type: 'controlChange',
      controlId,
      value,
      timestamp: Date.now()
    })
  }, [emit])

  // Get current control value
  const getControlValue = useCallback((controlId: MixerControlId): number => {
    const parts = controlId.split('.')

    if (parts[0] === 'deckA' || parts[0] === 'deckB') {
      const deck = parts[0] === 'deckA' ? 'A' : 'B'
      const deckState = state.decks[deck]

      if (parts[1] === 'eq') {
        const eqParam = parts[2] as 'low' | 'mid' | 'high'
        return deckState.eq[eqParam]
      } else if (parts[1] === 'tempo') {
        return deckState.tempo
      }
    } else if (controlId === 'crossfader') {
      return state.crossfader
    } else if (controlId === 'masterVolume') {
      return state.masterVolume
    }

    return 0
  }, [state])

  // Update deck time
  const updateDeckTime = useCallback((deck: 'A' | 'B', time: number) => {
    setState(prev => ({
      ...prev,
      decks: {
        ...prev.decks,
        [deck]: { ...prev.decks[deck], currentTime: time }
      }
    }))

    emit({
      type: 'timeUpdate',
      deck,
      time,
      timestamp: Date.now()
    })
  }, [emit])

  // Update play state
  const updatePlayState = useCallback((deck: 'A' | 'B', playing: boolean) => {
    setState(prev => ({
      ...prev,
      decks: {
        ...prev.decks,
        [deck]: { ...prev.decks[deck], playing }
      }
    }))

    emit({
      type: 'playStateChange',
      deck,
      playing,
      timestamp: Date.now()
    })
  }, [emit])

  // Load track
  const loadTrack = useCallback((deck: 'A' | 'B', filename: string, duration: number, bpm: number) => {
    setState(prev => ({
      ...prev,
      decks: {
        ...prev.decks,
        [deck]: {
          ...prev.decks[deck],
          filename,
          duration,
          bpm,
          currentTime: 0
        }
      }
    }))

    emit({
      type: 'trackLoaded',
      deck,
      filename,
      duration,
      timestamp: Date.now()
    })
  }, [emit])

  const api: MixerApi = {
    state,
    setControl,
    updateDeckTime,
    updatePlayState,
    loadTrack,
    subscribe,
    getControlValue
  }

  return (
    <MixerContext.Provider value={api}>
      {children}
    </MixerContext.Provider>
  )
}

// Hook to use mixer context
export function useMixer() {
  const ctx = useContext(MixerContext)
  if (!ctx) {
    throw new Error('useMixer must be used within MixerProvider')
  }
  return ctx
}
