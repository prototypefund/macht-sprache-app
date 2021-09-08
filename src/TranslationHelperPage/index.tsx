import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button, { ButtonContainer } from '../Form/Button';
import { Select, Textarea } from '../Form/Input';
import InputContainer from '../Form/InputContainer';
import Header from '../Header';
import { langA, langB } from '../languages';
import { SingleColumn } from '../Layout/Columns';
import { Lang } from '../types';

type TextType = 'original' | 'translation';

export default function TranslationHelperPage() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState<Lang | undefined>();
    const [textType, setTextType] = useState<TextType | undefined>();
    const [text, setText] = useState('');

    return (
        <>
            <Header subLine="Get help with sensible translations">Translation Helper</Header>
            <SingleColumn>
                <InputContainer>
                    <Select
                        label="Language"
                        value={language}
                        span={2}
                        onChange={value => {
                            if (!value.target.value) {
                                setLanguage(undefined);
                            } else {
                                setLanguage(value.target.value === langA ? langA : langB);
                            }
                        }}
                    >
                        <option value=""></option>
                        <option value={langA}>{t(`common.langLabels.${langA}` as const)}</option>
                        <option value={langB}>{t(`common.langLabels.${langB}` as const)}</option>
                    </Select>
                    <Select
                        label="Type of the text"
                        value={textType}
                        span={2}
                        onChange={value => {
                            if (!value.target.value) {
                                setTextType(undefined);
                            } else {
                                setTextType(value.target.value === 'original' ? 'original' : 'translation');
                            }
                        }}
                    >
                        <option value=""></option>
                        <option value="original">original</option>
                        <option value="translation">translation</option>
                    </Select>
                    <Textarea
                        label="Text"
                        value={text}
                        minHeight="300px"
                        onChange={value => {
                            setText(value.target.value);
                        }}
                    />
                </InputContainer>
                <ButtonContainer>
                    <Button primary={true}>Help!</Button>
                </ButtonContainer>
            </SingleColumn>
        </>
    );
}
