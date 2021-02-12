import { Link, LinkProps } from 'react-router-dom';
import s from './style.module.css';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    primary?: boolean;
    size?: 'small' | 'medium';
}

export default function Button({ primary = false, size = 'medium', ...props }: Props) {
    let className = primary ? s.buttonPrimary : s.button;

    if (size === 'small') {
        className += ' ' + s.small;
    }

    return <button className={className} {...props} />;
}

interface ButtonLinkProps extends LinkProps {
    primary?: boolean;
}

export function ButtonLink({ primary = false, ...props }: ButtonLinkProps) {
    return <Link className={primary ? s.buttonPrimary : s.button} {...props} />;
}

type ButtonContainerProps = {
    children: React.ReactNode;
    align?: 'left' | 'right';
};

export function ButtonContainer({ children, align = 'right' }: ButtonContainerProps) {
    return <div className={align === 'right' ? s.buttonContainer : s.buttonContainerLeftAligned}>{children}</div>;
}
