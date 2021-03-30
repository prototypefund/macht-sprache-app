import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Button, { ButtonContainer } from '../Form/Button';
import { Checkbox } from '../Form/Checkbox';
import { Input, Textarea } from '../Form/Input';
import InputContainer from '../Form/InputContainer';
import Header from '../Header';
import { useUser, useUserSettings } from '../hooks/appContext';
import { collections, useDocument } from '../hooks/data';
import { ColumnHeading, Columns } from '../Layout/Columns';
import LinkButton from '../LinkButton';
import { ModalDialog } from '../ModalDialog';
import { User, UserSettings } from '../types';

const USER_LINKS: { type: 'facebook' | 'twitter' | 'website' | 'instagram'; getUrl: (handle?: string) => string }[] = [
    {
        type: 'facebook',
        getUrl: (handle?: string) => `https://www.facebook.com/${handle}`,
    },
    {
        type: 'twitter',
        getUrl: (handle?: string) => `https://twitter.com/${handle}`,
    },
    {
        type: 'website',
        getUrl: (handle?: string) => `${handle}`,
    },
    {
        type: 'instagram',
        getUrl: (handle?: string) => `https://www.instagram.com/${handle}`,
    },
];

export default function UserPage() {
    const { userId } = useParams<{ userId: string }>();
    const loggedInUser = useUser()!;
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const user = useDocument(collections.users.doc(userId));
    const loggedInUserIsCurrentUser = loggedInUser.id === userId;

    const edit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <Header
                topHeading={[{ inner: t('userPage.title') }]}
                subLine={<UserBio user={user} canEdit={loggedInUserIsCurrentUser} edit={edit} />}
            >
                {user.displayName}
            </Header>
            <Columns>
                <UserInfo user={user} canEdit={loggedInUserIsCurrentUser} edit={edit} />
                {loggedInUserIsCurrentUser && <EditUserSettings user={loggedInUser} />}
            </Columns>
            {isEditing && <EditUserInfo user={user} onClose={() => setIsEditing(false)} />}
        </>
    );
}

function UserInfo({ user, canEdit, edit }: { user: User; canEdit: boolean; edit: () => void }) {
    const { t } = useTranslation();

    return (
        <div>
            <ColumnHeading>{t('userPage.info')}</ColumnHeading>
            {USER_LINKS.map(({ type, getUrl }) => {
                return (
                    <div key={type}>
                        {type}:{' '}
                        {user.socialMediaProfiles?.[type] && (
                            <a target="_blank" rel="noreferrer" href={getUrl(user.socialMediaProfiles[type])}>
                                {user.socialMediaProfiles[type]}
                            </a>
                        )}
                    </div>
                );
            })}
            {canEdit && (
                <ButtonContainer align="left">
                    <Button onClick={edit}>{t('common.formNav.edit')}</Button>
                </ButtonContainer>
            )}
        </div>
    );
}

function EditUserInfo({ user, onClose }: { user: User; onClose: () => void }) {
    const { t } = useTranslation();

    const [saving, setIsSaving] = useState(false);

    const [bio, setBio] = useState(user.bio || '');
    const [socialMediaState, setSocialMediaState] = useState({
        facebook: user.socialMediaProfiles?.facebook || '',
        twitter: user.socialMediaProfiles?.twitter || '',
        instagram: user.socialMediaProfiles?.instagram || '',
        website: user.socialMediaProfiles?.website || '',
    });

    const onSave = () => {
        setIsSaving(true);

        collections.users
            .doc(user.id)
            .set({ ...user, socialMediaProfiles: { ...socialMediaState }, bio })
            .then(() => {
                setIsSaving(false);
                onClose();
            });
    };

    return (
        <ModalDialog title={t('userPage.editInfo')} onClose={onClose}>
            {saving ? (
                <>{t('common.saving')}</>
            ) : (
                <>
                    <InputContainer>
                        <Textarea
                            value={bio}
                            onChange={({ target: { value } }) => {
                                setBio(value);
                            }}
                            maxLength={250}
                            minHeight="10rem"
                            label={t('userPage.bio')}
                        />

                        {USER_LINKS.map(({ type }) => {
                            return (
                                <Input
                                    key={type}
                                    value={socialMediaState[type]}
                                    label={type}
                                    onChange={el => {
                                        setSocialMediaState(old => {
                                            return { ...old, [type]: el.target.value };
                                        });
                                    }}
                                />
                            );
                        })}
                    </InputContainer>
                    <ButtonContainer>
                        <Button onClick={onClose}>{t('common.formNav.cancel')}</Button>
                        <Button onClick={onSave} primary={true}>
                            {t('common.formNav.save')}
                        </Button>
                    </ButtonContainer>
                </>
            )}
        </ModalDialog>
    );
}

function UserBio({ user, canEdit, edit }: { user: User; canEdit: boolean; edit: () => void }) {
    const { t } = useTranslation();

    return (
        <>
            {canEdit && !user.bio && (
                <Trans
                    t={t}
                    i18nKey="userPage.addBio"
                    components={{ AddDescription: <LinkButton onClick={edit} underlined /> }}
                />
            )}
            {user.bio}
            {canEdit && user.bio && (
                <LinkButton onClick={edit} underlined>
                    {t('common.formNav.edit')}
                </LinkButton>
            )}
        </>
    );
}

function EditUserSettings({ user }: { user: User }) {
    const { t } = useTranslation();
    const userSettings = useUserSettings()!;

    const onChange = useCallback(
        (update: Partial<UserSettings>) => collections.userSettings.doc(user.id).set({ ...userSettings, ...update }),
        [user.id, userSettings]
    );

    return (
        <div>
            <ColumnHeading>{t('common.settings')}</ColumnHeading>

            <p>
                <Trans t={t} i18nKey="userPage.hideRedactedDescription" />
            </p>
            <label>
                <Checkbox
                    checked={!userSettings.showRedacted}
                    onChange={event => onChange({ showRedacted: !event.target.checked })}
                    label={t('userPage.hideRedacted')}
                />
            </label>
        </div>
    );
}
