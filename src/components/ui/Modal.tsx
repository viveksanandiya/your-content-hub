interface ModalProps{
  isOpen: boolean;
  onClose: ()=> void;
  title?: string;
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children}: ModalProps){
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>

      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
          </button>
        </div>
        

        <div>{children}</div>
      </div>
    </div>
  );
}