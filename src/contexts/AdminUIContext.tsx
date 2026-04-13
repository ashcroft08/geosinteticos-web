'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import Toast, { ToastType } from '@/components/admin/Toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface ToastState {
    message: string
    type: ToastType
    isVisible: boolean
}

interface ConfirmState {
    message: string
    isVisible: boolean
    onConfirm: () => void
    onCancel: () => void
}

interface AdminUIContextType {
    showToast: (message: string, type?: ToastType) => void
    confirmAction: (message: string) => Promise<boolean>
}

const AdminUIContext = createContext<AdminUIContextType | undefined>(undefined)

export function AdminUIProvider({ children }: { children: ReactNode }) {
    // Toast State
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        isVisible: false,
    })

    // Confirm Dialog State
    const [confirm, setConfirm] = useState<ConfirmState>({
        message: '',
        isVisible: false,
        onConfirm: () => { },
        onCancel: () => { }
    })

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        setToast({ message, type, isVisible: true })
        // Auto hide after 3 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }))
        }, 3000)
    }, [])

    const confirmAction = useCallback((message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirm({
                message,
                isVisible: true,
                onConfirm: () => {
                    setConfirm(prev => ({ ...prev, isVisible: false }))
                    resolve(true)
                },
                onCancel: () => {
                    setConfirm(prev => ({ ...prev, isVisible: false }))
                    resolve(false)
                }
            })
        })
    }, [])

    return (
        <AdminUIContext.Provider value={{ showToast, confirmAction }}>
            {children}

            {/* Render global UI components */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            <ConfirmDialog
                message={confirm.message}
                isVisible={confirm.isVisible}
                onConfirm={confirm.onConfirm}
                onCancel={confirm.onCancel}
            />
        </AdminUIContext.Provider>
    )
}

export function useAdminUI() {
    const context = useContext(AdminUIContext)
    if (context === undefined) {
        throw new Error('useAdminUI must be used within an AdminUIProvider')
    }
    return context
}
