import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  open: boolean;
  close: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  close,
  title,
  message,
  onConfirm,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      close={close}
      title={title}
    >
      <div className="space-y-6">

        <p className="text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          

          <Button
  variant="danger"
  disabled={loading}
  onClick={onConfirm}
>
  {loading ? "Deleting..." : "Delete"}
</Button>

        </div>

      </div>
    </Modal>
  );
}