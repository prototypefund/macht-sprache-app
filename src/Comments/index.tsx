import { useTranslation } from 'react-i18next';
import { useUser } from '../authHooks';
import { addComment, useComments } from '../dataHooks';
import { Comment } from '../types';
import { CommentCreate } from './CommentCreate';
import { CommentList } from './CommentList';
import { CommentWrapper } from './CommentWrapper';

type Props = {
    entityRef: Comment['ref'];
};

export default function Comments({ entityRef: ref }: Props) {
    const user = useUser();
    const [comments] = useComments(ref);
    const { t } = useTranslation();
    const commentCount = comments ? comments.length : 0;
    const onCreate = async (comment: string) => user && addComment(user, ref, comment);

    return (
        <CommentWrapper>
            <h2>
                {commentCount} {t('common.entities.comment.value', { count: commentCount })}
            </h2>
            <CommentList comments={comments || []} />
            {user && <CommentCreate onCreate={onCreate} />}
        </CommentWrapper>
    );
}
