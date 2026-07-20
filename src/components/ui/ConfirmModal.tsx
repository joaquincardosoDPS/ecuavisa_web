import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loadingLabel = "Procesando...",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 flex flex-col items-center gap-5 min-w-[350px]">
        <p className="text-(--clr-primary-title) text-center">{message}</p>
        <div className="flex gap-4 w-full mt-2">
          <Button
            variant="tertiary"
            onClick={onClose}
            className="flex-1 uppercase"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 uppercase"
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
