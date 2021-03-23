import { useTranslation } from 'react-i18next';
import { ButtonContainer, ButtonLink } from '../Form/Button';
import { ColumnHeading, Columns } from '../Layout/Columns';
import { ABOUT, TERMS } from '../routes';
import { Terms } from '../Terms/TermsSmall';
import { TermsWeekHighlights } from '../Terms/TermsWeekHighlights';
import { useWpPage } from '../useWpHooks';
import { HomePageHeader } from './Header';
import s from './style.module.css';

const ABOUT_SLUGS = {
    en: 'about-macht-sprache-short-version-landing-page',
    de: 'ueber-macht-sprache-kurzversion-startseite',
};

export default function Home() {
    const { t } = useTranslation();
    const { response } = useWpPage(ABOUT_SLUGS);

    return (
        <>
            <HomePageHeader />
            <p className={s.intro}>{t('home.termsOfTheWeekDescription')}</p>
            <Columns>
                <TermsWeekHighlights />
            </Columns>
            <Columns>
                <div>
                    <ColumnHeading>{t('common.entities.term.all')}</ColumnHeading>
                    <Terms />
                    <div className={s.button}>
                        <ButtonContainer align="left">
                            <ButtonLink to={TERMS}>{t('home.viewAllTerms')}</ButtonLink>
                        </ButtonContainer>
                    </div>
                </div>
                <div>
                    <ColumnHeading>{t('home.about')}</ColumnHeading>
                    <div
                        className={s.text}
                        dangerouslySetInnerHTML={{ __html: response ? response.body : t('common.loading') }}
                    />
                    <ButtonContainer align="left">
                        <ButtonLink to={ABOUT}>{t('home.moreAbout')}</ButtonLink>
                    </ButtonContainer>
                </div>
            </Columns>
        </>
    );
}
