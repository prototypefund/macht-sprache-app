import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { ContentItemList } from '../../components/ContentItemList';
import { ButtonContainer, ButtonLink } from '../../components/Form/Button';
import { useUser } from '../../hooks/appContext';
import { collections } from '../../hooks/data';
import { useCollection } from '../../hooks/fetch';
import { useWpPage } from '../../hooks/wp';
import { ColumnHeading, Columns } from '../../components/Layout/Columns';
import { ABOUT, TERMS } from '../../routes';
import { Terms } from '../../components/Terms/TermsSmall';
import { TermsWeekHighlights } from '../../components/Terms/TermsWeekHighlights';
import { WpStyle } from '../../components/WpStyle';
import { HomePageHeader } from './Header';
import s from './style.module.css';

const ABOUT_SLUGS = {
    en: 'about-macht-sprache-short-version-landing-page',
    de: 'ueber-macht-sprache-kurzversion-startseite',
};

const EVENT_SLUGS = {
    en: 'macht-sprache-events-short-version-landing-page',
    de: 'macht-sprache-veranstaltungen-kurzversion-startseite',
};

export default function Home() {
    const { t } = useTranslation();
    const getTerms = useCollection(collections.terms.where('adminTags.hideFromList', '==', false));
    const user = useUser();

    return (
        <>
            <HomePageHeader />
            <ColumnHeading>{t('home.termsOfTheWeek')}</ColumnHeading>
            <Columns>
                <TermsWeekHighlights />
            </Columns>
            <Columns>
                <div>
                    {user ? (
                        <Suspense fallback={null}>
                            <LatestActivity />
                        </Suspense>
                    ) : (
                        <WpContent />
                    )}
                </div>
                <div>
                    <ColumnHeading>{t('common.entities.term.all')}</ColumnHeading>
                    <Suspense fallback={null}>
                        <Terms getTerms={getTerms} />
                        <div className={s.button}>
                            <ButtonContainer align="left">
                                <ButtonLink to={TERMS}>{t('home.viewAllTerms')}</ButtonLink>
                            </ButtonContainer>
                        </div>
                    </Suspense>
                    {user ? (
                        <WpContent />
                    ) : (
                        <Suspense fallback={null}>
                            <LatestActivity />
                        </Suspense>
                    )}
                </div>
            </Columns>
        </>
    );
}

function WpContent() {
    return (
        <ErrorBoundary fallbackRender={() => null}>
            <Suspense fallback={null}>
                <About />
                <Events />
            </Suspense>
        </ErrorBoundary>
    );
}

function About() {
    const getPage = useWpPage(ABOUT_SLUGS);
    const { t } = useTranslation();

    return (
        <>
            <ColumnHeading>{t('home.about')}</ColumnHeading>
            <WpStyle body={getPage().body} />
            <ButtonContainer align="left">
                <ButtonLink to={ABOUT}>{t('home.moreAbout')}</ButtonLink>
            </ButtonContainer>
        </>
    );
}

function Events() {
    const getPage = useWpPage(EVENT_SLUGS);
    const { t } = useTranslation();

    return (
        <>
            <ColumnHeading>{t('home.events')}</ColumnHeading>
            <WpStyle body={getPage().body} />
        </>
    );
}

function LatestActivity() {
    const { t } = useTranslation();
    const getComments = useCollection(collections.comments.orderBy('createdAt', 'desc').limit(10));
    const getTerms = useCollection(collections.terms.orderBy('createdAt', 'desc').limit(5));
    const getTranslations = useCollection(collections.translations.orderBy('createdAt', 'desc').limit(5));
    const getTranslationExamples = useCollection(collections.translationExamples.orderBy('createdAt', 'desc').limit(5));

    return (
        <>
            <ColumnHeading>{t('common.activity')}</ColumnHeading>
            <ContentItemList
                comments={getComments()}
                terms={getTerms()}
                translations={getTranslations()}
                translationExamples={getTranslationExamples()}
            />
        </>
    );
}