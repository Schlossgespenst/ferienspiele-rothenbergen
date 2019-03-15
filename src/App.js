import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './api/auth';
import { PageContextProvider } from './api/page';
import AnalyticsPageListener from './components/AnalyticsPageListener';
import GlobalLoader from './components/GlobalLoader';
import Header from './components/Header';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SentryWrapper from './components/SentryWrapper';
import Home from './pages/index';
import NotFound from './pages/notfound';
import './styles.css';
import ThemeProvider from './Theme';

const authenticated = ({ user }) => !!user;

const Impressum = lazy(() => import('./pages/impressum'));
const Anmeldung = lazy(() => import('./pages/anmeldung'));
const AnmeldungDetails = lazy(() => import('./pages/anmeldung-details'));
const SignIn = lazy(() => import('./pages/signin'));
const SignUp = lazy(() => import('./pages/signup'));
const Office = lazy(() => import('./pages/office'));

export default function App() {
  return (
    <SentryWrapper>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<GlobalLoader />}>
              <PageContextProvider>
                <Header />
                <AnalyticsPageListener />
                <Switch>
                  <Route path="/signin" component={SignIn} />
                  <Route path="/signup" component={SignUp} />
                  <Route exact path="/" component={Home} />
                  <Layout>
                    <Suspense fallback={<GlobalLoader />}>
                      <Switch>
                        <Route path="/anmeldung/:id" component={AnmeldungDetails} />
                        <Route path="/anmeldung" component={Anmeldung} />
                        <Route path="/impressum" component={Impressum} />
                        <ProtectedRoute path="/office" allowed={authenticated} component={Office} />
                        <Route component={NotFound} />
                      </Switch>
                    </Suspense>
                  </Layout>
                </Switch>
              </PageContextProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </SentryWrapper>
  );
}
