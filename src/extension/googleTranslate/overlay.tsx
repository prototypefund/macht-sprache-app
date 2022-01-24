import ReactDOMServer from 'react-dom/server';
import { MatchGroup } from '../../components/TextChecker/TextCheckerResult/hooks';
import { CSS_CONTEXT_CLASS_NAME } from '../../constants';
import { Lang } from '../../types';
import { getDominantLanguageClass } from '../../useLangCssVars';
import s from './style.module.css';

type Props = {
    el?: HTMLElement | null;
    text?: string;
    matches?: MatchGroup[];
    lang?: Lang;
};

let textOverlay: HTMLElement | null = null;

export function isOverlay(el: Node) {
    return el === textOverlay;
}

export function renderOverlay({ el, matches, text, lang }: Props) {
    if (!el) {
        return;
    }

    el.classList.add(s.parent);

    if (!textOverlay || !el.contains(textOverlay)) {
        const textElement = el.firstElementChild;
        textOverlay = document.createElement('div');
        textOverlay.classList.add(s.overlay);
        textOverlay.classList.add(textElement?.classList?.toString() ?? '');
        el.appendChild(textOverlay);
    }

    if (!!matches?.length && text) {
        textOverlay.innerHTML = ReactDOMServer.renderToString(<Overlay text={text} matches={matches} lang={lang} />);
    } else {
        textOverlay.innerHTML = '';
    }
}

function Overlay({ text, matches, lang }: { text: string; matches: MatchGroup[]; lang?: Lang }) {
    const children = [
        ...matches.flatMap((matchGroup, index) => {
            const prevEnd = matches[index - 1]?.pos[1] || 0;
            const [start, end] = matchGroup.pos;

            if (prevEnd > start) {
                return [];
            }

            return [
                <span key={index + 'a'}>{text.substring(prevEnd, start)}</span>,
                <HighlightedPhrase key={index + 'b'}>{text.substring(start, end)}</HighlightedPhrase>,
            ];
        }),
        <span key="last">{text.substring(matches[matches.length - 1]?.pos?.[1] || 0)}</span>,
    ];
    return (
        <div className={CSS_CONTEXT_CLASS_NAME}>
            <div className={getDominantLanguageClass(lang)}>{children}</div>
        </div>
    );
}

function HighlightedPhrase({ children }: { children: React.ReactNode }) {
    return <button className={s.highlightedPhrase}>{children}</button>;
}
