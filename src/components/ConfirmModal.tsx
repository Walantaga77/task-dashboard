type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-black">
          Apakah yakin ingin menghapus Task?
        </h2>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
