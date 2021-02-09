import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, Link, useParams } from 'react-router-dom';
import Button, { ButtonContainer } from '../Form/Button';
import Header from '../Header';
import { useTerm, useTranslationEntity } from '../hooks/data';
import { MultiStepIndicator, MultiStepIndicatorStep } from '../MultiStepIndicator';
import { TERM } from '../routes';
import { TermWithLang } from '../TermWithLang';
import s from './style.module.css';
import BookSearch from '../BookSearch';
import { Book } from '../types';
import { Columns } from '../Layout/Columns';
import InputContainer from '../Form/InputContainer';
import { Input, Textarea } from '../Form/Input';

export function AddTranslationExamplePage() {
    const { termId, translationId } = useParams<{ termId: string; translationId: string }>();
    const term = useTerm(termId);
    const translation = useTranslationEntity(translationId);
    const { t } = useTranslation();
    const [step, setStep] = useState<number>(0);

    const [type, setType] = useState<'BOOK'>();
    const [originalBook, setOriginalBook] = useState<Book | undefined>();
    const [translatedBook, setTranslatedBook] = useState<Book | undefined>();

    const [snippets, setSnippets] = useState<{
        original?: string;
        originalPageNo?: string;
        translated?: string;
        translatedPageNo?: string;
    }>({ original: '', originalPageNo: '', translated: '', translatedPageNo: '' });

    const incrementStep = () => {
        setStep(step + 1);
    };

    const save = () => {
        console.log('saving...', originalBook, translatedBook, snippets);
    };

    const steps = [
        {
            label: t('translationExample.steps.type'),
            body: (
                <>
                    <input
                        type="radio"
                        id="book"
                        name="type"
                        value="BOOK"
                        onChange={el => {
                            setType(el.target.value as 'BOOK');
                        }}
                    />
                    <label htmlFor="book">Book</label>
                    <ButtonContainer>
                        <Button primary onClick={incrementStep} disabled={!type}>
                            Next
                        </Button>
                    </ButtonContainer>
                </>
            ),
        },
        {
            label: t('translationExample.steps.source'),
            body: (
                <>
                    <h3>Original Book</h3>
                    <BookSearch
                        label={t('translationExample.bookSearchOriginal')}
                        lang={term.lang}
                        selectedBook={originalBook}
                        onSelect={setOriginalBook}
                    />
                    <h3>Translated Book</h3>
                    <BookSearch
                        label={t('translationExample.bookSearchTranslation')}
                        lang={translation.lang}
                        selectedBook={translatedBook}
                        onSelect={setTranslatedBook}
                    />
                    <ButtonContainer>
                        <Button primary onClick={incrementStep} disabled={!(originalBook && translatedBook)}>
                            Next
                        </Button>
                    </ButtonContainer>
                </>
            ),
        },
        {
            label: t('translationExample.steps.example'),
            body: (
                <>
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
                                    onChange={e =>
                                        setSnippets(prevProps => ({ ...prevProps, original: e.target.value }))
                                    }
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
                                    onChange={e =>
                                        setSnippets(prevProps => ({ ...prevProps, translated: e.target.value }))
                                    }
                                />
                                <Input
                                    type="text"
                                    label={t('translationExample.snippet.pageNumber')}
                                    value={snippets?.translatedPageNo}
                                    onChange={e =>
                                        setSnippets(prevProps => ({ ...prevProps, translatedPageNo: e.target.value }))
                                    }
                                />
                            </InputContainer>
                        </div>
                    </Columns>

                    <ButtonContainer>
                        <Button primary onClick={save}>
                            Save
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
                subHeading={
                    <Link lang={term.lang} className={s.termLink} to={generatePath(TERM, { termId: term.id })}>
                        {term.value}
                    </Link>
                }
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
            <MultiStepIndicator>
                {steps.map(({ label }, index) => (
                    <MultiStepIndicatorStep key={index} active={index === step}>
                        {label}
                    </MultiStepIndicatorStep>
                ))}
            </MultiStepIndicator>
            <div className={s.steps}>{steps[step].body}</div>
        </>
    );
}
