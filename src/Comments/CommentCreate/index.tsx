import { useState } from 'react';
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

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        onCreate(comment)
            .then(() => setComment(''))
            .catch(error => console.error(error))
            .finally(() => setSubmitting(false));
    };

    return (
        <LoginHint i18nKey="comment.registerToAdd">
            <form className={s.form} onSubmit={onSubmit}>
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
