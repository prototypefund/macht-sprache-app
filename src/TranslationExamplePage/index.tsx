import { generatePath, Link, useParams } from 'react-router-dom';
import Header from '../Header';
import { useDocument, useTerm, useTranslationEntity, useTranslationExample } from '../hooks/data';
import { Columns } from '../Layout/Columns';
import { TRANSLATION } from '../routes';
import { BookTranslationExample, Term, Translation } from '../types';
import s from './style.module.css';

export function TranslationExamplePage() {
    const { termId, translationId, translationExampleId } = useParams<{
        termId: string;
        translationId: string;
        translationExampleId: string;
    }>();
    const term = useTerm(termId);
    const translation = useTranslationEntity(translationId);
    const translationExample = useTranslationExample(translationExampleId);

    if (translationExample.type === 'BOOK') {
        return <BookPage term={term} translation={translation} translationExample={translationExample} />;
    }

    return <>no book! it's a {translationExample.type}</>;
}

function BookPage({
    term,
    translation,
    translationExample,
}: {
    term: Term;
    translation: Translation;
    translationExample: BookTranslationExample;
}) {
    const bookOriginal = useDocument(translationExample.original.source);
    const bookTranslated = useDocument(translationExample.translated.source);

    return (
        <>
            <Header
                // mainLang={translation.lang}
                subHeadingLang={term.lang}
                subHeading={
                    <Link
                        className={s.termLink}
                        to={generatePath(TRANSLATION, { termId: term.id, translationId: translation.id })}
                    >
                        {term.value} → {translation.value}
                    </Link>
                }
            >
                {bookOriginal.title} → {bookTranslated.title}
            </Header>

            <Columns>
                <div>beispiel!!</div>
            </Columns>
        </>
    );
}
