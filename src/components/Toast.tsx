"use client"

import { createContext, useCallback, useContext, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  let nextId = 0

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const remove = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const icons = {
    success: <CheckCircle size={18} className="text-secondary" />,
    error: <AlertCircle size={18} className="text-accent" />,
    info: <Info size={18} className="text-primary" />,
  }

  const borders = {
    success: 'border-secondary/30',
    error: 'border-accent/30',
    info: 'border-primary/30',
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`bg-dark-surface border ${borders[t.type]} p-4 flex items-start gap-3 shadow-xl animate-slide-up`}
          >
            <span className="mt-0.5 flex-shrink-0">{icons[t.type]}</span>
            <p className="text-sm text-gray-200 flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-gray-500 hover:text-white flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
