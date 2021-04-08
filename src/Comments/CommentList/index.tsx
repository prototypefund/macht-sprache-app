import { Trans, useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import { useDocument } from '../../hooks/fetch';
import { TERM, TRANSLATION_EXAMPLE_REDIRECT } from '../../routes';
import { Comment, DocReference, Source, Term, Translation, TranslationExample, UserMini } from '../../types';
import { UserInlineDisplay } from '../../UserInlineDisplay';
import { CommentItem } from '../CommentItem';
import s from './style.module.css';

type CommentListProps = {
    comments: Comment[];
};

export function CommentList({ comments }: CommentListProps) {
    return (
        <div className={s.container}>
            {comments.map(comment => {
                return <CommentItem key={comment.id} comment={comment} />;
            })}
        </div>
    );
}

export function CommentListWithLinks({ comments }: CommentListProps) {
    return (
        <div className={s.container}>
            {comments.map(comment => {
                return <CommentWithLink key={comment.id} comment={comment} />;
            })}
        </div>
    );
}

function CommentWithLink({ comment }: { comment: Comment }) {
    const getDocument = useDocument(comment.ref);
    const linkedDocument = getDocument();

    return (
        <div>
            <div className={s.linkToDocument}>
                <LinkToDocument document={linkedDocument} documentRef={comment.ref} creator={comment.creator} />
            </div>
            <CommentItem key={comment.id} comment={comment} />
        </div>
    );
}

function LinkToDocument({
    document,
    documentRef,
    creator,
}: {
    document: Term | Translation | TranslationExample;
    documentRef: DocReference<Term | Translation | TranslationExample>;
    creator: UserMini;
}) {
    const { t } = useTranslation();
    if (documentRef.parent.id === 'terms') {
        const term = document as Term;

        return (
            <Trans
                t={t}
                i18nKey="comment.commentedBy"
                components={{
                    User: <UserInlineDisplay {...creator} />,
                    DocumentLink: <Link to={generatePath(TERM, { termId: documentRef.id })} />,
                }}
                values={{ title: term.value }}
            />
        );
    }

    if (documentRef.parent.id === 'translationExamples') {
        const example = document as TranslationExample;

        return (
            <Trans
                t={t}
                i18nKey="comment.commentedBy"
                components={{
                    User: <UserInlineDisplay {...creator} />,
                    DocumentLink: <LinkToTranslationExample example={example} exampleId={documentRef.id} />,
                }}
            />
        );
    }

    return null;
}

function LinkToTranslationExample({ example, exampleId }: { example: TranslationExample; exampleId: string }) {
    const getOriginalSource = useDocument(example.original.source as DocReference<Source>);
    const original = getOriginalSource();

    return (
        <Link to={generatePath(TRANSLATION_EXAMPLE_REDIRECT, { translationExampleId: exampleId })}>
            {original.title}
        </Link>
    );
}
