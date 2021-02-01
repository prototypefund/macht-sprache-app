import s from './style.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Comments from '../Comments';
import { collections, useTerm } from '../dataHooks';
import { FormatDate } from '../FormatDate';
import Header from '../Header';
import { TranslationsList } from '../TranslationsList';

export default function TermPage() {
    const { termId } = useParams<{ termId: string }>();
    const { t } = useTranslation();
    const [term] = useTerm(termId);

    if (!term) {
        return null;
    }

    return (
        <>
            <Header
                subLine={
                    <Trans
                        t={t}
                        i18nKey="term.addedOn"
                        components={{
                            User: 'timur',
                            FormatDate: <FormatDate date={term.createdAt && term.createdAt.toDate()} />,
                        }}
                    />
                }
                mainLang={term.lang}
            >
                {term.value}
            </Header>
            <div className={s.main}>
                <TranslationsList term={term} />
                <Comments entityRef={collections.terms.doc(termId)} />
            </div>
        </>
    );
}
