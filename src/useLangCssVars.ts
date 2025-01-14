import { useEffect } from 'react';
import { CSS_CONTEXT_CLASS_NAME } from './constants';
import { langA, langB } from './languages';
import { Lang } from './types';

const DOMINANT_LANG_CLASS_NAME = 'dominantLanguageColor';

const style = `
.${CSS_CONTEXT_CLASS_NAME} [lang=${langA}] {
    --lang-color: var(--colorLangA);
}
.${CSS_CONTEXT_CLASS_NAME} [lang=${langB}] {
    --lang-color: var(--colorLangB);
}
.${CSS_CONTEXT_CLASS_NAME} .${DOMINANT_LANG_CLASS_NAME}-${langA} {
    --dominantLanguageColor: var(--colorLangA);
}
.${CSS_CONTEXT_CLASS_NAME} .${DOMINANT_LANG_CLASS_NAME}-${langB} {
    --dominantLanguageColor: var(--colorLangB);
}
`;

export function useLangCssVars() {
    useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = style;
        document.head.appendChild(styleEl);
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);
}

export function getDominantLanguageClass(lang?: Lang) {
    if (!lang) return '';
    return `${DOMINANT_LANG_CLASS_NAME}-${lang}`;
}
