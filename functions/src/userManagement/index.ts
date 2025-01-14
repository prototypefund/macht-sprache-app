import { Dictionary, mergeDeepRight } from 'rambdax';
import { DISPLAY_NAME_REGEX } from '../../../src/constants';
import { langA, langB } from '../../../src/languages';
import { GlobalSettings, Lang, Term, Translation, User, UserProperties, UserSettings } from '../../../src/types';
import { seedTermTranslationIndex } from '../denormalize/termTranslationIndex';
import { auth, db, functions, HttpsError, logger, verifyUser, WithoutId } from '../firebase';
import { Recipient, sendWeeklyDigestMail } from '../mails';
import { seedSubscriptions } from '../notifications/seedSubscriptions';

const verifyAdmin = async (userId: string) => {
    const snap = await db.collection('userProperties').doc(userId).get();
    if (!snap.data()?.admin) {
        throw new HttpsError('permission-denied', 'User is not an admin');
    }
};

const getUsersWithDisplayNameRef = (displayName: string) =>
    db.collection('users').where('displayName', '==', displayName.toLowerCase());

export const isDisplayNameAvailable = functions.https.onCall(async ({ displayName }: { displayName: string }) => {
    const { size } = await getUsersWithDisplayNameRef(displayName).get();

    if (size) {
        throw new HttpsError('already-exists', `Name ${displayName} is already in use.`);
    }
});

export const postRegistrationHandler = functions.https.onCall(
    async ({ displayName, lang, newsletter }: { displayName: string; lang: Lang; newsletter: boolean }, context) => {
        if (!context.auth) {
            throw new HttpsError('unauthenticated', 'User not logged in');
        }

        if (!DISPLAY_NAME_REGEX.test(displayName)) {
            throw new HttpsError('invalid-argument', `Invalid displayName ${displayName}`);
        }

        const userId = context.auth.uid;
        const tokenTime = new Date(context.auth.token.auth_time).toISOString();

        await db.runTransaction(async t => {
            const usersWithDisplayNameSnap = await t.get(getUsersWithDisplayNameRef(displayName));

            if (usersWithDisplayNameSnap.size) {
                throw new HttpsError('already-exists', `Name ${displayName} is already in use.`);
            }

            const globalSettings = ((
                await t.get(db.collection('settings').doc('global'))
            ).data() as GlobalSettings) || {
                enableNewUsers: true,
            };

            const userRef = db.collection('users').doc(userId);
            const userSettingsRef = db.collection('userSettings').doc(userId);
            const userPropertiesRef = db.collection('userProperties').doc(userId);

            const userSnap = await t.get(userRef);
            if (userSnap.exists) {
                throw new HttpsError('already-exists', `User ${userId} already exists`);
            }

            const user: WithoutId<User> = {
                displayName,
                displayNameLowerCase: displayName.toLowerCase(),
            };

            const userSettings: UserSettings = {
                lang,
                newsletter,
                showRedacted: false,
                digestMail: true,
                notificationMail: true,
            };

            const userProperties: UserProperties = {
                admin: false,
                betaAccess: false,
                enabled: globalSettings.enableNewUsers,
                tokenTime,
            };

            t.set(userRef, user);
            t.set(userSettingsRef, userSettings);
            t.set(userPropertiesRef, userProperties);
        });
    }
);

export const postVerifyHandler = functions.https.onCall(async (_, context) => {
    if (!context.auth) {
        throw new HttpsError('unauthenticated', 'User not logged in');
    }

    const authUser = await auth.getUser(context.auth.uid);

    if (authUser.emailVerified) {
        await db.collection('userProperties').doc(authUser.uid).update({ tokenTime: new Date().toISOString() });
    }
});

export const getAuthUserInfos = functions.https.onCall(async (_, context) => {
    const userId = verifyUser(context);
    await verifyAdmin(userId);

    const { users } = await auth.listUsers();
    return users.reduce<Partial<Record<string, { email: string; verified: boolean; creationTime: string }>>>(
        (acc, user) => {
            if (user.email) {
                acc[user.uid] = {
                    email: user.email,
                    verified: user.emailVerified,
                    creationTime: user.metadata.creationTime,
                };
            }
            return acc;
        },
        {}
    );
});

export const deleteAllContentOfUser = functions.https.onCall(async ({ userId }: { userId: string }, context) => {
    const currentUserId = verifyUser(context);
    await verifyAdmin(currentUserId);

    await Promise.all(
        [
            db.collection('comments'),
            db.collection('terms'),
            db.collection('translations'),
            db.collection('translationExamples'),
            db.collectionGroup('likes'),
        ].map(async collectionRef => {
            const snapshot = await collectionRef.where('creator.id', '==', userId).get();
            logger.info(
                `Deleting ${snapshot.size} documents from collection ${
                    'path' in collectionRef ? collectionRef.path : 'collectionGroup'
                }`
            );
            return Promise.all(snapshot.docs.map(doc => doc.ref.delete()));
        })
    );
});

export const ensureValidUserEntities = functions.https.onCall(async (_, context) => {
    const currentUserId = verifyUser(context);
    await verifyAdmin(currentUserId);

    const { users: authUsers } = await auth.listUsers();

    for (const authUser of authUsers) {
        const displayName = authUser.displayName || '';
        const defaultUser: WithoutId<User> = { displayName, displayNameLowerCase: displayName.toLowerCase() };
        const defaultUserSettings: UserSettings = {
            lang: langA,
            newsletter: false,
            showRedacted: false,
            digestMail: true,
            notificationMail: true,
        };
        const defaultUserProperties: UserProperties = {
            admin: false,
            betaAccess: false,
            enabled: true,
            tokenTime: new Date(0).toISOString(),
        };

        const userRef = db.collection('users').doc(authUser.uid);
        const userSettingsRef = db.collection('userSettings').doc(authUser.uid);
        const userPropertiesRef = db.collection('userProperties').doc(authUser.uid);

        await db.runTransaction(async t => {
            const user = (await t.get(userRef)).data() || {};
            const userSettings = (await t.get(userSettingsRef)).data() || {};
            const userProperties = (await t.get(userPropertiesRef)).data() || {};

            t.set(userRef, { ...defaultUser, ...user });
            t.set(userSettingsRef, { ...defaultUserSettings, ...userSettings });
            t.set(userPropertiesRef, { ...defaultUserProperties, ...userProperties });
        });
    }
});

export const runContentMigrations = functions.https.onCall(async (_, context) => {
    const currentUserId = verifyUser(context);
    await verifyAdmin(currentUserId);

    const termDefaults: Partial<Term> = {
        adminComment: {
            langA: '',
            langB: '',
        },
        definition: {
            langA: '',
            langB: '',
        },
        adminTags: {
            hideFromList: false,
            showInSidebar: false,
            hightlightLandingPage: false,
            disableExamples: false,
            enableCommentsOnTranslations: false,
            translationsAsVariants: false,
            notOnlyPolitical: false,
        },
        guidelines: [],
    };

    await db.runTransaction(async t => {
        const terms = await t.get(db.collection('terms'));
        terms.forEach(term => {
            const data = term.data();
            t.set(term.ref, mergeDeepRight(termDefaults, data));
        });
    });

    const translationDefaults: Partial<Translation> = {
        definition: {
            langA: '',
            langB: '',
        },
    };

    await db.runTransaction(async t => {
        const translations = await t.get(db.collection('translations'));
        translations.forEach(translation => {
            const data = translation.data();
            t.set(translation.ref, mergeDeepRight(translationDefaults, data));
        });
    });
});

export const runSeedSubscriptions = functions.https.onCall(async (_, context) => {
    const currentUserId = verifyUser(context);
    await verifyAdmin(currentUserId);
    await seedSubscriptions();
});

export const runSeedTermTranslationIndex = functions.https.onCall(async (_, context) => {
    const currentUserId = verifyUser(context);
    await verifyAdmin(currentUserId);
    await seedTermTranslationIndex();
});

type DigestMailParams = {
    from: string;
    to: string;
    limit: number;
    intro: { [langA]: string; [langB]: string };
    subject: { [langA]: string; [langB]: string };
};

export const sendWeeklyDigestTest = functions.https.onCall(
    async ({ from, to, limit, intro, subject }: DigestMailParams, context) => {
        const currentUserId = verifyUser(context);
        await verifyAdmin(currentUserId);

        const authUser = await auth.getUser(currentUserId);

        await sendWeeklyDigestMail(
            [
                { id: currentUserId, displayName: authUser.displayName!, email: authUser.email!, lang: langA },
                { id: currentUserId, displayName: authUser.displayName!, email: authUser.email!, lang: langB },
            ],
            {
                from: new Date(from),
                to: new Date(to),
                limit,
                intro,
                subject,
            }
        );
    }
);

export const sendWeeklyDigest = functions.https.onCall(
    async ({ from, to, limit, intro, subject }: DigestMailParams, context) => {
        const currentUserId = verifyUser(context);
        await verifyAdmin(currentUserId);

        const userSettingsSnap = await db.collection('userSettings').where('digestMail', '==', true).get();
        const userSettingsById = userSettingsSnap.docs.reduce<Dictionary<UserSettings>>(
            (acc, cur) => ({
                ...acc,
                [cur.id]: cur.data() as UserSettings,
            }),
            {}
        );
        const userIdentifiers = userSettingsSnap.docs.map(doc => ({ uid: doc.id }));
        const { users: authUsers } = await auth.getUsers(userIdentifiers);
        const recipients = authUsers
            .filter(authUser => authUser.emailVerified)
            .map(
                (authUser): Partial<Recipient> => ({
                    id: authUser.uid,
                    displayName: authUser.displayName,
                    email: authUser.email,
                    lang: userSettingsById[authUser.uid]?.lang,
                })
            )
            .filter(
                (recipient): recipient is Recipient =>
                    !!(recipient.id && recipient.displayName && recipient.email && recipient.lang)
            );

        logger.info(`Sending digest mail to ${recipients.length} recipients`);

        await sendWeeklyDigestMail(recipients, {
            from: new Date(from),
            to: new Date(to),
            limit,
            intro,
            subject,
        });
    }
);
