import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import Button, { ButtonContainer } from '../Form/Button';
import Header from '../Header';
import { useTerm, useTranslationEntity } from '../hooks/data';
import { MultiStepIndicator, MultiStepIndicatorStep } from '../MultiStepIndicator';
import { TERM, TRANSLATION_EXAMPLE } from '../routes';
import { TermWithLang } from '../TermWithLang';
import s from './style.module.css';
import BookSearch from '../MediaSelection/BookSearch';
import { Book, SourceType } from '../types';
import { Columns } from '../Layout/Columns';
import InputContainer from '../Form/InputContainer';
import { Input, Textarea } from '../Form/Input';
import { addTranslationExample } from '../functions';
import SavingState from '../SavingState';
import { TypeSelector, TypeSelectorContainer } from './TypeSelector';

const SNIPPET_MAX_LENGTH = 350; // SHOULD MAYBE BE DECLARED SOMEWHERE ELSE?

export function AddTranslationExamplePage() {
    const { termId, translationId } = useParams<{ termId: string; translationId: string }>();
    const term = useTerm(termId);
    const history = useHistory();
    const translation = useTranslationEntity(translationId);
    const { t } = useTranslation();
    const [step, setStep] = useState<number>(0);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [type, setType] = useState<SourceType>();
    const [originalBook, setOriginalBook] = useState<Book | undefined>();
    const [translatedBook, setTranslatedBook] = useState<Book | undefined>();

    const [snippets, setSnippets] = useState<{
        original: string;
        originalPageNo?: string;
        translated: string;
        translatedPageNo?: string;
    }>({ original: '', originalPageNo: '', translated: '', translatedPageNo: '' });

    const incrementStep = () => {
        setStep(step + 1);
    };

    const save = () => {
        if (originalBook && translatedBook) {
            setSubmitting(true);

            addTranslationExample({
                termId,
                translationId,
                type: 'BOOK',
                original: {
                    text: snippets.original,
                    pageNumber: snippets.originalPageNo,
                    sourceId: originalBook.id,
                },
                translated: {
                    text: snippets.translated,
                    pageNumber: snippets.translatedPageNo,
                    sourceId: translatedBook.id,
                },
            }).then(translationExample => {
                setSubmitting(false);
                history.push(
                    generatePath(TRANSLATION_EXAMPLE, {
                        termId,
                        translationId,
                        translationExampleId: translationExample.data.translationExampleId,
                    })
                );
            });
        } else {
            console.log("books aren't set. should not be possible. what happened?!");
        }
    };

    const steps = [
        {
            label: t('translationExample.steps.type.label'),
            body: (
                <>
                    <Section>
                        <p>{t('translationExample.steps.type.description')}</p>
                        <TypeSelectorContainer name="type" value={type} onChange={setType}>
                            <TypeSelector value="BOOK" label={t('translationExample.types.BOOK')} />
                            <TypeSelector value="WEBPAGE" label={t('translationExample.types.WEBSITE')} />
                            <TypeSelector value="MOVIE" label={t('translationExample.types.MOVIE')} />
                            <TypeSelector value="OTHER" label={t('translationExample.types.OTHER')} disabled />
                        </TypeSelectorContainer>
                    </Section>
                    <ButtonContainer>
                        <Button primary onClick={incrementStep} disabled={!type}>
                            {t('common.formNav.next')}
                        </Button>
                    </ButtonContainer>
                </>
            ),
        },
        {
            label: t('translationExample.steps.source.label'),
            body: (
                <>
                    <p>{t('translationExample.steps.source.description')}</p>
                    <Section>
                        <h3 className={s.bookSearchHeading}>
                            {t('translationExample.steps.source.bookOriginalTitle')}
                        </h3>
                        <BookSearch
                            label={t('translationExample.steps.source.bookSearchOriginal')}
                            lang={term.lang}
                            selectedBook={originalBook}
                            onSelect={setOriginalBook}
                        />
                    </Section>
                    <Section>
                        <h3 className={s.bookSearchHeading}>
                            {t('translationExample.steps.source.bookTranslatedTitle')}
                        </h3>
                        <BookSearch
                            label={t('translationExample.steps.source.bookSearchTranslation')}
                            lang={translation.lang}
                            selectedBook={translatedBook}
                            onSelect={setTranslatedBook}
                        />
                    </Section>
                    <ButtonContainer>
                        <Button primary onClick={incrementStep} disabled={!(originalBook && translatedBook)}>
                            {t('common.formNav.next')}
                        </Button>
                    </ButtonContainer>
                </>
            ),
        },
        {
            label: t('translationExample.steps.example.label'),
            body: (
                <>
                    <Section>
                        <Columns>
                            <div>
                                <p>
                                    <Trans
                                        i18nKey="translationExample.snippet.description"
                                        values={{ book: originalBook?.title }}
                                        components={{ Term: <TermWithLang term={term} />, Book: <em /> }}
                                    />
                                </p>
                                <InputContainer>
                                    <Textarea
                                        label={t('translationExample.snippet.label')}
                                        value={snippets?.original}
                                        maxLength={SNIPPET_MAX_LENGTH}
                                        onChange={e =>
                                            setSnippets(prevProps => ({ ...prevProps, original: e.target.value }))
                                        }
                                        minHeight="15rem"
                                    />
                                    <Input
                                        type="text"
                                        label={t('translationExample.snippet.pageNumber')}
                                        value={snippets?.originalPageNo}
                                        onChange={e =>
                                            setSnippets(prevProps => ({ ...prevProps, originalPageNo: e.target.value }))
                                        }
                                    />
                                </InputContainer>
                            </div>
                            <div>
                                <p>
                                    <Trans
                                        i18nKey="translationExample.snippet.description"
                                        values={{ book: translatedBook?.title }}
                                        components={{ Term: <TermWithLang term={translation} />, Book: <em /> }}
                                    />
                                </p>
                                <InputContainer>
                                    <Textarea
                                        label={t('translationExample.snippet.label')}
                                        value={snippets?.translated}
                                        maxLength={SNIPPET_MAX_LENGTH}
                                        onChange={e =>
                                            setSnippets(prevProps => ({ ...prevProps, translated: e.target.value }))
                                        }
                                        minHeight="15rem"
                                    />
                                    <Input
                                        type="text"
                                        label={t('translationExample.snippet.pageNumber')}
                                        value={snippets?.translatedPageNo}
                                        onChange={e =>
                                            setSnippets(prevProps => ({
                                                ...prevProps,
                                                translatedPageNo: e.target.value,
                                            }))
                                        }
                                    />
                                </InputContainer>
                            </div>
                        </Columns>
                    </Section>
                    <ButtonContainer>
                        <Button primary onClick={save}>
                            {t('common.formNav.save')}
                        </Button>
                    </ButtonContainer>
                </>
            ),
        },
    ];

    return (
        <>
            <Header
                mainLang={translation.lang}
                topHeading={[
                    {
                        to: generatePath(TERM, { termId: term.id }),
                        inner: term.value,
                        lang: term.lang,
                    },
                ]}
            >
                {translation.value}
            </Header>
            <p>
                <Trans
                    t={t}
                    i18nKey="translationExample.add"
                    components={{
                        Term: <TermWithLang term={term} />,
                        Translation: <TermWithLang term={translation} />,
                    }}
                />
            </p>
            {submitting ? (
                <SavingState />
            ) : (
                <>
                    <MultiStepIndicator>
                        {steps.map(({ label }, index) => (
                            <MultiStepIndicatorStep key={index} active={index === step}>
                                {label}
                            </MultiStepIndicatorStep>
                        ))}
                    </MultiStepIndicator>
                    <div className={s.steps}>{steps[step].body}</div>
                </>
            )}
        </>
    );
}

const Section = ({ children }: { children: React.ReactNode }) => <div className={s.section}>{children}</div>;
