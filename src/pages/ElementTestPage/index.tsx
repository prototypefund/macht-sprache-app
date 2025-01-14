import firebase from 'firebase/compat/app';
import { useState } from 'react';
import BookSearch from '../../components/MediaSelection/BookSearch';
import { CommentCreate } from '../../components/Comments/CommentCreate';
import { CommentList } from '../../components/Comments/CommentList';
import Button, { ButtonContainer } from '../../components/Form/Button';
import { Input, Select, Textarea } from '../../components/Form/Input';
import InputContainer from '../../components/Form/InputContainer';
import Header from '../../components/Header';
import { collections } from '../../hooks/data';
import { MultiStepIndicator, MultiStepIndicatorStep } from '../../components/MultiStepIndicator';
import { Rating } from '../../components/Rating';
import { Book, Comment, Movie, WebPage } from '../../types';
import MovieSearch from '../../components/MediaSelection/MovieSearch';
import WebPageSearch from '../../components/MediaSelection/WebPageSearch';
import { Checkbox } from '../../components/Form/Checkbox';
import { InlineInput } from '../../components/Form/InlineInput';
/* eslint-disable import/no-webpack-loader-syntax */
import MdxContent from '!babel-loader!@mdx-js/loader!./text.en.mdx';
import DividedList from '../../components/DividedList';

const ref = collections.terms.doc('1');
const creator = {
    id: 'timur',
    displayName: 'timur',
};

export default function ElementTestPage() {
    const [name, setName] = useState('');
    const [another, setAnother] = useState('Disabled value');
    const [selectValue, setSelectValue] = useState('');
    const [anotherSelectValue, setAnotherSelectValue] = useState('2');
    const [textAreaValue, setTextAreaValue] = useState('');
    const [inlineInputValue, setInlineInputValue] = useState('');
    const [enBook, setEnBook] = useState<Book>();
    const [deBook, setDeBook] = useState<Book>();
    const [enMovie, setEnMovie] = useState<Movie>();
    const [deMovie, setDeMovie] = useState<Movie>();
    const [page, setPage] = useState<WebPage>();
    const [rating, setRating] = useState(2);

    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            ref,
            creator,
            comment: 'This is a very short comment.',
            edited: null,
            createdAt: firebase.firestore.Timestamp.fromDate(
                new Date('Mon Jan 25 2021 17:29:26 GMT+0100 (Central European Standard Time)')
            ),
            likeCount: 0,
        },
        {
            id: '2',
            ref,
            creator: {
                id: 'anna',
                displayName: 'Anne with a rather long user name for some reason',
            },
            comment: 'Yep.',
            edited: null,
            createdAt: firebase.firestore.Timestamp.fromDate(
                new Date('Mon Jan 25 2021 12:20:26 GMT+0100 (Central European Standard Time)')
            ),
            likeCount: 0,
        },
        {
            id: '3',
            ref,
            creator: {
                id: 'lucy',
                displayName: 'Lucy',
            },
            comment: `In linguistics, the topic, or theme, of a sentence is what is being talked about, and the comment (rheme or focus) is what is being said about the topic. This division into old vs. new content is called information structure. It is generally agreed that clauses are divided into topic vs. comment, but in certain cases the boundary between them depends on which specific grammatical theory is being used to analyze the sentence.
            Topic, which is defined by pragmatic considerations, is a distinct concept from grammatical subject, which is defined by syntax. In any given sentence these may be the same, but they need not be. For example, in the sentence "As for the little girl, the dog bit her", the subject is "the dog" but the topic is "the little girl".`,
            edited: null,
            createdAt: firebase.firestore.Timestamp.fromDate(
                new Date('Mon Jan 24 2021 17:29:26 GMT+0100 (Central European Standard Time)')
            ),
            likeCount: 0,
        },
    ]);

    const onCreate = async (comment: string) => {
        setComments(existingComments => [
            ...existingComments,
            {
                id: (existingComments.length + 1).toString(),
                ref,
                creator,
                comment,
                edited: null,
                createdAt: firebase.firestore.Timestamp.now(),
                likeCount: 0,
            },
        ]);
    };

    return (
        <>
            <Header>Element Test Page</Header>
            <Heading>Rating Widget</Heading>
            <p>Without user rating</p>
            <div style={{ '--dominantLanguageColor': 'var(--green)' } as React.CSSProperties}>
                <Rating termValue="Indianer" ratings={[5, 2, 0, 12, 21]} />
            </div>
            <p>With user rating</p>
            <div style={{ '--dominantLanguageColor': 'var(--green)' } as React.CSSProperties}>
                <Rating termValue="Indianer" ratings={[5, 2, 0, 12, 21]} rating={rating} onChange={setRating} />
            </div>
            <p>Small:</p>
            <div style={{ '--dominantLanguageColor': 'var(--green)' } as React.CSSProperties}>
                <Rating size="small" termValue="Indianer" ratings={[5, 2, 0, 12, 21]} />
            </div>

            <Heading>Button</Heading>
            <Button>button</Button>
            <Heading>Primary Button</Heading>
            <Button primary={true}>button</Button>
            <Heading>Button Disabled</Heading>
            <Button disabled>button</Button>
            <Heading>Button Busy</Heading>
            <Button busy>button</Button>

            <Heading>Form</Heading>
            <InputContainer>
                <Input
                    label="Name"
                    span={2}
                    value={name}
                    onChange={value => {
                        setName(value.target.value);
                    }}
                    error="something is wrong here!"
                />
                <Select
                    label="Media Type"
                    span={2}
                    value={selectValue}
                    onChange={value => {
                        setSelectValue(value.target.value);
                    }}
                >
                    <option value=""></option>
                    <option value="1">book</option>
                    <option value="2">newspaper</option>
                    <option value="3">movie</option>
                </Select>
                <Select
                    label="Another Select, full width & disabled"
                    value={anotherSelectValue}
                    disabled={true}
                    onChange={value => {
                        setAnotherSelectValue(value.target.value);
                    }}
                >
                    <option value=""></option>
                    <option value="1">book</option>
                    <option value="2">newspaper</option>
                    <option value="3">movie</option>
                </Select>
                <Input
                    label="Another field, busy"
                    busy={true}
                    value={another}
                    onChange={value => {
                        setAnother(value.target.value);
                    }}
                />
                <Input
                    label="Another field, disabled"
                    disabled={true}
                    value={another}
                    onChange={value => {
                        setAnother(value.target.value);
                    }}
                />
                <Input
                    label="Another field, with inline button"
                    value={another}
                    span={2}
                    onChange={value => {
                        setAnother(value.target.value);
                    }}
                    inlineButton={<Button>huhu</Button>}
                />
                <Input
                    label="with button and error"
                    span={2}
                    value={another}
                    onChange={value => {
                        setAnother(value.target.value);
                    }}
                    inlineButton={<Button>huhu</Button>}
                    error="something is wrong here!"
                />
                <Textarea
                    label="Comment"
                    value={textAreaValue}
                    onChange={value => {
                        setTextAreaValue(value.target.value);
                    }}
                    maxLength={100}
                />
            </InputContainer>
            <ButtonContainer>
                <Button>Cancel</Button>
                <Button primary={true}>Submit</Button>
            </ButtonContainer>

            <Heading>Checkbox</Heading>
            <Checkbox label="This is just a normal checkbox" />
            <br />
            <Checkbox label="this is a disabled checkbox" disabled />
            <br />
            <Checkbox label="this is a disabled and checked checkbox" checked disabled />

            <Heading>Inline Input</Heading>
            <InlineInput
                label="Search"
                placeholder="Search"
                value={inlineInputValue}
                onChange={({ target: { value } }) => setInlineInputValue(value)}
                onCancel={() => setInlineInputValue('')}
            />

            <Heading>Comments</Heading>

            <CommentList comments={comments} />
            <CommentCreate onCreate={onCreate} />

            <Heading>Multi Step Indicator</Heading>
            <MultiStepIndicator>
                <MultiStepIndicatorStep>First thing</MultiStepIndicatorStep>
                <MultiStepIndicatorStep active={true}>Second</MultiStepIndicatorStep>
                <MultiStepIndicatorStep>another one</MultiStepIndicatorStep>
            </MultiStepIndicator>

            <Heading>Book Search</Heading>
            <BookSearch label="Find German Books" lang="de" selectedBook={deBook} onSelect={setDeBook} />
            <p />
            <BookSearch label="Find English Books" lang="en" selectedBook={enBook} onSelect={setEnBook} />

            <Heading>Movie Search</Heading>
            <MovieSearch label="Find German Movies" lang="de" selectedMovie={deMovie} onSelect={setDeMovie} />
            <p />
            <MovieSearch label="Find English Movies" lang="en" selectedMovie={enMovie} onSelect={setEnMovie} />

            <Heading>WebPage Search</Heading>
            <WebPageSearch label="Paste URL" lang="en" selectedPage={page} onSelect={setPage} />

            <Heading>MDX</Heading>
            <MdxContent />

            <Heading>Divided List</Heading>
            <DividedList divider=", " lastDivider=" and ">
                <>One</>
                <>Two</>
                <>Three</>
            </DividedList>
        </>
    );
}

function Heading({ children }: { children: React.ReactNode }) {
    return <h2 style={{ marginTop: '3rem' }}>{children}</h2>;
}
