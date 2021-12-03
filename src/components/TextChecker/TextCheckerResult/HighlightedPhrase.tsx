import clsx from 'clsx';
import Tooltip from 'rc-tooltip';
import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collections, getTranslationsRef } from '../../../hooks/data';
import { useCollection, useDocument } from '../../../hooks/fetch';
import { DocReference, Lang, Term, Translation } from '../../../types';
import DividedList from '../../DividedList';
import { Redact } from '../../RedactSensitiveTerms';
import { WrappedInLangColor } from '../../TermWithLang';
import { sortTranslations } from '../../TranslationsList/service';
import { getLongestEntity, useLangIdentifier, useTerms, useTranslations } from '../service';
import PhraseModal from './Modal';
import s from './style.module.css';

type BaseProps = {
    termRefs: DocReference<Term>[];
    translationRefs: DocReference<Translation>[];
};

type Props = BaseProps & {
    lang: Lang;
    showModal: boolean;
    openModal: () => void;
    closeModal: () => void;
    onTooltipVisibleChange: (isVisible: boolean) => void;
};

type TooltipProps = BaseProps & {
    onClick: () => void;
};

const HighlightedPhrase: React.FC<Props> = ({
    children,
    termRefs,
    translationRefs,
    lang,
    showModal,
    openModal,
    closeModal,
    onTooltipVisibleChange,
}) => {
    const { t } = useTranslation();
    const [tooltipOpen, setTooltipOpen] = useState(false);

    return (
        <>
            <Tooltip
                overlay={
                    <Suspense
                        fallback={
                            <>
                                {/* TODO: nicer loading state */}
                                {t('common.loading')}
                            </>
                        }
                    >
                        <PhraseTooltip termRefs={termRefs} translationRefs={translationRefs} onClick={openModal} />
                    </Suspense>
                }
                placement="bottom"
                onVisibleChange={visible => {
                    setTooltipOpen(visible);
                    onTooltipVisibleChange(visible);
                }}
                mouseEnterDelay={0.2}
                mouseLeaveDelay={0.2}
            >
                <button
                    onClick={openModal}
                    className={clsx(s.sensitiveWord, { [s.sensitiveWordHovered]: tooltipOpen })}
                    lang={lang}
                >
                    {children}
                </button>
            </Tooltip>
            {showModal && (
                <Suspense fallback={null}>
                    <PhraseModal
                        title={<WrappedInLangColor lang={lang}>{children}</WrappedInLangColor>}
                        termRefs={termRefs}
                        translationRefs={translationRefs}
                        onClose={closeModal}
                    />
                </Suspense>
            )}
        </>
    );
};

const PhraseTooltip = ({ termRefs, translationRefs, onClick }: TooltipProps) => {
    return (
        <div className={s.tooltip} onClick={onClick}>
            {!!termRefs.length && <TooltipTerms termRefs={termRefs} />}
            {!!translationRefs.length && !termRefs.length && <TooltipTranslations translationRefs={translationRefs} />}
        </div>
    );
};

const TooltipTerms = ({ termRefs }: Pick<BaseProps, 'termRefs'>) => {
    const getTerms = useTerms(termRefs);
    const terms = getTerms();
    const longestTerm = getLongestEntity(terms);

    return <>{longestTerm && <TooltipTerm term={longestTerm} />}</>;
};

const TooltipTerm = ({ term }: { term: Term }) => {
    const { t } = useTranslation();
    const langIdentifier = useLangIdentifier();
    const getTranslations = useCollection(getTranslationsRef(collections.terms.doc(term.id)));
    const translations = sortTranslations(getTranslations());
    const termDefinition = term.definition[langIdentifier];

    return (
        <>
            {termDefinition && <p className={s.tooltipDefinition}>{termDefinition}</p>}
            {!!translations.length ? (
                <p>
                    <strong>{t('textChecker.result.translationsHeading')}</strong>{' '}
                    <DividedList divider=", ">
                        {translations.map(translation => (
                            <Redact key={translation.id}>{translation.value}</Redact>
                        ))}
                    </DividedList>
                </p>
            ) : (
                <p>{t('translation.emptyShort')}</p>
            )}
        </>
    );
};

const TooltipTranslations = ({ translationRefs }: Pick<BaseProps, 'translationRefs'>) => {
    const { t } = useTranslation();
    const getTranslations = useTranslations(translationRefs);
    const translations = getTranslations();

    return (
        <p>
            <strong>{t('textChecker.result.translationsHeading')}</strong>{' '}
            <DividedList divider=", ">
                {translations.map(translation => (
                    <TooltipTranslationTerm key={translation.id} translation={translation} />
                ))}
            </DividedList>
        </p>
    );
};

const TooltipTranslationTerm = ({ translation }: { translation: Translation }) => {
    const getTerm = useDocument(translation.term);
    return <Redact>{getTerm().value}</Redact>;
};

export default HighlightedPhrase;