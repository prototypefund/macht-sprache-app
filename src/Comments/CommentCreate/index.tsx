import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../Form/Button';
import { Textarea } from '../../Form/Input';
import InputContainer from '../../Form/InputContainer';
import { LoginHint } from '../../LoginHint';
import s from './style.module.css';

type CommentCreateProps = {
    onCreate: (newComment: string) => Promise<unknown>;
};

export function CommentCreate({ onCreate }: CommentCreateProps) {
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState('');
    const [hasFocus, setHasFocus] = useState(false);
    const { t } = useTranslation();
    const formRef = useRef<HTMLFormElement>(null);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        submit();
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && event.altKey === true) {
            submit();
        }
    };

    const submit = () => {
        setSubmitting(true);
        onCreate(comment)
            .then(() => setComment(''))
            .catch(error => console.error(error))
            .finally(() => setSubmitting(false));
    };

    return (
        <LoginHint i18nKey="comment.registerToAdd">
            <form ref={formRef} className={s.form} onSubmit={onSubmit}>
                <InputContainer>
                    <Textarea
                        value={comment}
                        disabled={submitting}
                        onChange={value => {
                            setComment(value.target.value);
                        }}
                        label={t('common.entities.comment.add')}
                        onFocus={() => {
                            setHasFocus(true);
                        }}
                        onBlur={() => {
                            setHasFocus(false);
                        }}
                        onKeyDown={onKeyDown}
                    />
                </InputContainer>
                <div className={hasFocus ? s.buttonWrapperWithFocus : s.buttonWrapper}>
                    <Button type="submit" disabled={!comment || submitting}>
                        {t('common.entities.comment.action')}
                    </Button>
                </div>
            </form>
        </LoginHint>
    );
}
