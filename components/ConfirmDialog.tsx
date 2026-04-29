'use client'

import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  cancelText?: string
  confirmText?: string
  variant?: 'danger' | 'default'
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  variant = 'default',
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            loading={isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
