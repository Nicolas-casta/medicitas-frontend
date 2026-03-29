interface Props {
    label: string
    type?: string
    placeholder?: string
    error?: string
    register?: any
}

export const Input = ({ label, type = 'text', placeholder, error, register }: Props) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            {...register}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100
                 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
)