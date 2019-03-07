import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './api/auth';
import GlobalLoader from './components/GlobalLoader';
import Layout from './components/Layout';
import NotFound from './pages/notfound';
import './styles.css';
import ThemeProvider from './Theme';

const Home = lazy(() => import('./pages/index'));
const Impressum = lazy(() => import('./pages/impressum'));
const Anmeldung = lazy(() => import('./pages/anmeldung'));
const AnmeldungDetails = lazy(() => import('./pages/anmeldung-details'));
const SignIn = lazy(() => import('./pages/signin'));

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<GlobalLoader />}>
              <Switch>
                <Route path="/anmeldung/:id" component={AnmeldungDetails} />
                <Route path="/anmeldung" component={Anmeldung} />
                <Route path="/impressum" component={Impressum} />
                <Route path="/signin" component={SignIn} />
                <Route exact path="/" component={Home} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
