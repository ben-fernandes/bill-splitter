import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'

interface ConfigResetConfirmationModalProps {
  isOpen: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfigResetConfirmationModal({ isOpen, onConfirm, onClose }: ConfigResetConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset All Configuration"
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button onClick={onConfirm}>Reset All</Button>
        </div>
      }
    >
      <p className="text-gray-700">
        Are you sure you want to reset all configuration? This will clear all people, items, bill splits, and settings.
      </p>
      <p className="text-red-600 font-semibold mt-4">
        This action cannot be undone.
      </p>
    </Modal>
  )
}
