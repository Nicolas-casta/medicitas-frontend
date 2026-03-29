interface Props {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    variant?: 'primary' | 'danger' | 'ghost'
    disabled?: boolean
    className?: string
}

export const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled, className }: Props) => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50'
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    }
    return (
        <button type={type} onClick={onClick} disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </button>
    )
}