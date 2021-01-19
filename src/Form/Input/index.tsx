import s from './style.module.css';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: React.ReactNode;
    span?: number;
}

export function Input({ label, value, span = 4, ...props }: InputProps) {
    const empty = !value;
    const inputProps = { value, ...props };

    return (
        <label className={s.container} style={{ gridColumn: `span ${span}` }}>
            <div className={empty ? s.labelEmpty : s.label}>{label}</div>
            <input className={s.input} {...inputProps} />
        </label>
    );
}

interface SelectProps
    extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    label: React.ReactNode;
    children: React.ReactNode;
    span?: number;
}

export function Select({ label, span = 4, children, value, ...props }: SelectProps) {
    const empty = !value;
    const selectProps = { value, ...props };

    return (
        <label className={s.selectContainer} style={{ gridColumn: `span ${span}` }}>
            <div className={empty ? s.selectLabelEmpty : s.selectLabel}>{label}</div>
            <select className={s.select} {...selectProps}>
                {children}
            </select>
        </label>
    );
}

interface TextareaProps
    extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    label: React.ReactNode;
    span?: number;
}

export function Textarea({ label, span = 4, value, ...props }: TextareaProps) {
    const empty = !value;
    const testareaProps = { value, ...props };

    return (
        <label className={s.textareaContainer} style={{ gridColumn: `span ${span}` }}>
            <div className={empty ? s.textareaLabelEmpty : s.textareaLabel}>{label}</div>
            <textarea className={s.textarea} {...testareaProps} />
        </label>
    );
}
