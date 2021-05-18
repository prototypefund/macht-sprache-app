import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Button, { ButtonContainer } from '../../Form/Button';
import { Textarea } from '../../Form/Input';
import InputContainer from '../../Form/InputContainer';
import { useRequestState } from '../../hooks/useRequestState';
import { getCommentDomId } from '../CommentItem';
import s from './style.module.css';

type Props = {
    label: string;
    submitLabel: string;
    placeholder?: string;
    comment?: string;
    onSubmit: (comment: string) => Promise<unknown>;
    onClose?: () => void;
};

export function CommentEdit({
    label,
    submitLabel,
    placeholder,
    comment: existingComment = '',
    onSubmit,
    onClose,
}: Props) {
    const { t } = useTranslation();
    const [submitState, setSubmitState] = useRequestState();
    const [comment, setComment] = useState(existingComment);
    const [hasFocus, setHasFocus] = useState(false);
    const history = useHistory();

    const isValid = comment && comment !== existingComment;

    const save = (event?: React.FormEvent) => {
        event?.preventDefault();
        setSubmitState('IN_PROGRESS');
        onSubmit(comment).then(
            (commentRef: any) => {
                setSubmitState('INIT');
                if (!existingComment) {
                    setComment('');
                }
                onClose?.();
                history.replace('#' + getCommentDomId(commentRef.id));
            },
            error => setSubmitState('ERROR', error)
        );
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && event.altKey === true) {
            save();
        }
    };

    return (
        <form className={s.form} onSubmit={save}>
            <InputContainer>
                <Textarea
                    value={comment}
                    disabled={submitState === 'IN_PROGRESS'}
                    onChange={value => {
                        setComment(value.target.value);
                    }}
                    label={label}
                    onFocus={() => setHasFocus(true)}
                    onBlur={() => setHasFocus(false)}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    error={submitState === 'ERROR' ? t('common.error.general') : undefined}
                />
            </InputContainer>
            <div className={hasFocus ? s.buttonWrapperWithFocus : s.buttonWrapper}>
                <ButtonContainer>
                    {onClose && (
                        <Button type="button" onClick={onClose}>
                            {t('common.formNav.cancel')}
                        </Button>
                    )}
                    <Button type="submit" disabled={!isValid || submitState === 'IN_PROGRESS'}>
                        {submitLabel}
                    </Button>
                </ButtonContainer>
            </div>
        </form>
    );
}
