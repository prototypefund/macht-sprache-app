import { useTranslation } from 'react-i18next';
import Header from '../Header';
import PageLoadingState from '../PageLoadingState';
import { useWpPage } from '../useWpHooks';
import s from './style.module.css';

type StaticContentPageProps = {
    slugs: { en: string; de: string };
};

export function StaticContentPage({ slugs }: StaticContentPageProps) {
    const { response, isLoading, error } = useWpPage(slugs);
    const { t } = useTranslation();

    if (error) {
        return (
            <>
                <Header>{t('common.error.general')}</Header>
                {error.message}
            </>
        );
    }

    if (!response || isLoading) {
        return <PageLoadingState />;
    }

    return (
        <>
            <Header>{response.title}</Header>
            <div className={s.body} dangerouslySetInnerHTML={{ __html: response.body }} />
        </>
    );
}
