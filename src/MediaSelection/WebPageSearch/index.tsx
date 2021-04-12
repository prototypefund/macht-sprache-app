import { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Input } from '../../Form/Input';
import InputContainer from '../../Form/InputContainer';
import { FormatDate } from '../../FormatDate';
import { findWebPage } from '../../functions';
import { Lang, WebPage } from '../../types';
import { WebsiteCoverIcon } from '../../CoverIcon/WebsiteCoverIcon';
import SelectedItem from '../SelectedItem';
import { isValidUrl } from '../../utils';

type Props = {
    label: string;
    lang: Lang;
    selectedPage?: WebPage;
    onSelect: (page: WebPage | undefined) => void;
};

type State = {
    url: string;
    searching: boolean;
    result: WebPage | null;
    error: null | unknown;
};

export default function WebPageSearch({ label, lang, selectedPage, onSelect }: Props) {
    const { t } = useTranslation();
    const [{ url, searching, result, error }, setState] = useState<State>({
        url: '',
        searching: false,
        error: null,
        result: null,
    });
    const isValid = !url || isValidUrl(url);

    useEffect(() => {
        if (url && isValidUrl(url)) {
            setState(prev => ({ ...prev, searching: true, error: null }));
            findWebPage(url, lang).then(
                page => {
                    setState(prev => ({ ...prev, error: null, result: page }));
                },
                error => setState(prev => ({ ...prev, searching: false, error }))
            );
        }
    }, [lang, url]);

    useEffect(() => {
        if (result) {
            setState(prev => ({ ...prev, searching: false, result: null }));
            onSelect(result);
        }
    }, [onSelect, result]);

    if (selectedPage) {
        return (
            <SelectedItem
                item={selectedPage}
                onCancel={() => onSelect(undefined)}
                coverComponent={WebsiteCoverIcon}
                metaInfo={getMeta(selectedPage)}
                cancelLabel={t('mediaSearch.webpage.cancelSelection')}
            />
        );
    }

    return (
        <InputContainer>
            <Input
                label={label}
                value={url}
                onChange={event => setState(prev => ({ ...prev, url: event.target.value }))}
                busy={searching}
                disabled={searching}
                error={getErrorMessage(t, isValid, error)}
            />
        </InputContainer>
    );
}

function getMeta(page: WebPage) {
    return (
        <>
            {page.description && (
                <>
                    {page.description}
                    <br />
                </>
            )}
            {page.author && (
                <>
                    {page.author}
                    <br />
                </>
            )}
            {page.publisher && (
                <>
                    {page.publisher}
                    <br />
                </>
            )}
            {page.date && (
                <>
                    <FormatDate date={new Date(page.date)} />
                    <br />
                </>
            )}
        </>
    );
}

function getErrorMessage(t: TFunction<'translation'>, isValid: boolean, error: any) {
    if (!isValid) {
        return t('mediaSearch.webpage.errorInvalid');
    }

    if (!error) {
        return null;
    }

    if (error.code === 'not-found') {
        return t('mediaSearch.webpage.errorNotFound');
    }

    return t('mediaSearch.webpage.errorGeneric');
}
