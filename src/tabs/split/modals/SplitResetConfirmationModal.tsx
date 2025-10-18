import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'

interface SplitResetConfirmationModalProps {
  isOpen: boolean
  onConfirm: () => void
  onClose: () => void
}

export function SplitResetConfirmationModal({ isOpen, onConfirm, onClose }: SplitResetConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset All Shares"
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
        Are you sure you want to reset all share percentages? This will clear all the splits you've entered.
      </p>
      <p className="text-red-600 font-semibold mt-4">
        This action cannot be undone.
      </p>
    </Modal>
  )
}
