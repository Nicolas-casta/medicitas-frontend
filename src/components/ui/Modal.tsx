import type { ReactNode } from 'react'

interface Props {
    title: string
    children: ReactNode
    onClose: () => void
}

export const Modal = ({ title, children, onClose }: Props) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            {children}
        </div>
    </div>
)