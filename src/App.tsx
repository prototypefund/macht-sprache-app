import { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import AddTermPage from './pages/AddTermPage';
import AddTranslationExamplePage from './pages/AddTranslationExamplePage';
import AddTranslationPage from './pages/AddTranslationPage';
import AdminCommentsPage from './pages/AdminCommentsPage/lazy';
import AdminContentPage from './pages/AdminContentPage/lazy';
import AdminPage from './pages/AdminPage/lazy';
import ElementTestPage from './pages/ElementTestPage/lazy';
import ErrorBoundary from './components/ErrorBoundary';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import { HomePagePreLaunch } from './pages/HomePage/HomePagePreLaunch';
import { AppContextProvider, useUser, useUserProperties } from './hooks/appContext';
import { useAddContinueParam } from './hooks/location';
import { TranslationProvider } from './i18n/config';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import { NewsPage } from './pages/NewsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import PageLoadingState from './components/PageLoadingState';
import { PageTitleProvider } from './components/PageTitle';
import RegisterPage from './pages/RegisterPage';
import RegisterPostPage from './pages/RegisterPostPage';
import * as routes from './routes';
import { StaticContentPage } from './pages/StaticContentPage';
import TermPage from './pages/TermPage';
import { TermsPage } from './pages/TermsPage';
import TranslationExamplePage from './pages/TranslationExamplePage';
import TranslationExampleRedirect from './pages/TranslationExampleRedirect';
import TranslationPage from './pages/TranslationPage';
import TranslationRedirect from './pages/TranslationRedirect';
import TextCheckerPage from './pages/TextCheckerPage';
import { LangProvider } from './useLang';
import { useLangCssVars } from './useLangCssVars';
import { useLaunched } from './useLaunched';
import UserPage from './pages/UserPage';
import ManifestoPage from './pages/ManifestoPage';

function App() {
    useLangCssVars();

    return (
        <AppContextProvider>
            <TranslationProvider>
                <LangProvider>
                    <AppRouter />
                </LangProvider>
            </TranslationProvider>
        </AppContextProvider>
    );
}

function AppRouter() {
    const launched = useLaunched();

    return (
        <Router>
            <PageTitleProvider>
                <Layout>
                    <ErrorBoundary>
                        <Suspense fallback={<PageLoadingState />}>
                            <Switch>
                                <Route path={routes.HOME} exact>
                                    {launched ? <HomePage /> : <HomePagePreLaunch />}
                                </Route>
                                <Route path={routes.REGISTER} exact>
                                    <RegisterPage />
                                </Route>
                                <Route path={routes.REGISTER_POST} exact>
                                    <RegisterPostPage />
                                </Route>
                                <Route path={routes.LOGIN} exact>
                                    <LoginPage />
                                </Route>
                                <Route path={routes.FORGOT_PASSWORD} exact>
                                    <ForgotPasswordPage />
                                </Route>
                                <LoggedInRoute path={routes.TERM_ADD} exact>
                                    <AddTermPage />
                                </LoggedInRoute>
                                <LaunchedRoute path={routes.TERMS} exact>
                                    <TermsPage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TERM} exact>
                                    <TermPage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TERM_SIDEBAR} exact>
                                    <TermPage />
                                </LaunchedRoute>
                                <LoggedInRoute path={routes.TRANSLATION_ADD} exact>
                                    <AddTranslationPage />
                                </LoggedInRoute>
                                <LoggedInRoute path={routes.TRANSLATION_ADD_SIDEBAR} exact>
                                    <AddTranslationPage />
                                </LoggedInRoute>
                                <LaunchedRoute path={routes.TRANSLATION} exact>
                                    <TranslationPage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TRANSLATION_SIDEBAR} exact>
                                    <TranslationPage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TRANSLATION_REDIRECT} exact>
                                    <TranslationRedirect />
                                </LaunchedRoute>
                                <LoggedInRoute path={routes.TRANSLATION_EXAMPLE_ADD} exact>
                                    <AddTranslationExamplePage />
                                </LoggedInRoute>
                                <LoggedInRoute path={routes.TRANSLATION_EXAMPLE_ADD_SIDEBAR} exact>
                                    <AddTranslationExamplePage />
                                </LoggedInRoute>
                                <LaunchedRoute path={routes.TRANSLATION_EXAMPLE} exact>
                                    <TranslationExamplePage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TRANSLATION_EXAMPLE_SIDEBAR} exact>
                                    <TranslationExamplePage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TRANSLATION_EXAMPLE_REDIRECT} exact>
                                    <TranslationExampleRedirect />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.USER} exact>
                                    <UserPage />
                                </LaunchedRoute>
                                <AdminRoute path={routes.ADMIN} exact>
                                    <AdminPage />
                                </AdminRoute>
                                <AdminRoute path={routes.ADMIN_CONTENT} exact>
                                    <AdminContentPage />
                                </AdminRoute>
                                <AdminRoute path={routes.ADMIN_COMMENTS} exact>
                                    <AdminCommentsPage />
                                </AdminRoute>
                                <LaunchedRoute path={routes.NEWS} exact>
                                    <NewsPage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.TEXT_CHECKER}>
                                    <TextCheckerPage />
                                </LaunchedRoute>
                                <LaunchedRoute path={routes.MANIFESTO} exact>
                                    <ManifestoPage />
                                </LaunchedRoute>
                                <Route path={routes.ABOUT} exact>
                                    <StaticContentPage
                                        slugs={{ en: 'about-case-sensitive', de: 'ueber-macht-sprache' }}
                                    />
                                </Route>
                                <Route path={routes.PRIVACY} exact>
                                    <StaticContentPage
                                        slugs={{ en: 'machtsprache-data-privacy', de: 'machtsprache-datenschutz' }}
                                    />
                                </Route>
                                <Route path={routes.CODE_OF_CONDUCT} exact>
                                    <StaticContentPage slugs={{ en: 'code-of-conduct', de: 'code-of-conduct' }} />
                                </Route>
                                <Route path={routes.IMPRINT} exact>
                                    <StaticContentPage
                                        slugs={{ en: 'macht-sprache-imprint', de: 'macht-sprache-imprint' }}
                                    />
                                </Route>

                                <Route path="/elementTest" exact>
                                    <ElementTestPage />
                                </Route>

                                <Route>
                                    <NotFoundPage />
                                </Route>
                            </Switch>
                        </Suspense>
                    </ErrorBoundary>
                </Layout>
            </PageTitleProvider>
        </Router>
    );
}

function LoggedInRoute(props: RouteProps) {
    const user = useUser();

    if (user) {
        return <Route {...props} />;
    }

    return <RedirectToLogin />;
}

function LaunchedRoute(props: RouteProps) {
    const launched = useLaunched();

    if (launched) {
        return <Route {...props} />;
    }

    return <RedirectToLogin />;
}

function AdminRoute(props: RouteProps) {
    const userProperties = useUserProperties();

    if (userProperties?.admin) {
        return <Route {...props} />;
    }

    return <NotFoundPage />;
}

function RedirectToLogin() {
    const addContinueParam = useAddContinueParam();
    return <Redirect to={addContinueParam(routes.LOGIN)} />;
}

export default App;
