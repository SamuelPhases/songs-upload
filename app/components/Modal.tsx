interface ModalProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Modal = ({ children, ...props }: ModalProps) => {
  return (
    <div {...props} className="fixed inset-0 bg-gray-700/20 text-white z-50 flex items-center justify-center">
        <div className="w-11/12 h-10/12 max-w-[500px] max-h-[450px] py-5 p-7 flex items-center justify-center gap-5 flex-col bg-gray-900 rounded-lg overflow-y-auto">
            {children}
        </div>
    </div>
  )
}

export default Modal