"use client"

import { useState, useRef, useCallback } from "react"

export const useHistory = <T,>(initialState: T) => {
  const [state, _setState] = useState(initialState)
  const history = useRef<T[]>([initialState])
  const redoStack = useRef<T[]>([])

  const setState = useCallback((newState: T | ((prevState: T) => T), recordHistory = true) => {
    _setState((prevState) => {
      const resolvedState = typeof newState === "function" ? (newState as (prevState: T) => T)(prevState) : newState

      if (recordHistory) {
        // Quando um novo estado é definido, limpamos a pilha de redo.
        redoStack.current = []
        history.current.push(resolvedState)
      }
      return resolvedState
    })
  }, [])

  const undo = useCallback(() => {
    if (history.current.length > 1) {
      const currentState = history.current.pop()!
      redoStack.current.push(currentState)
      _setState(history.current[history.current.length - 1])
    }
  }, [])

  const redo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop()!
      history.current.push(nextState)
      _setState(nextState)
    }
  }, [])

  const canUndo = history.current.length > 1
  const canRedo = redoStack.current.length > 0

  return { state, setState, undo, redo, canUndo, canRedo }
}
