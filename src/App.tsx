import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-hu/mui/styles';
import { createHuGoTheme } from '@material-hu/theme/hugo';

import { DialogLayerProvider } from '@material-hu/components/layers/Dialogs';
import { DrawerLayerProvider } from '@material-hu/components/layers/Drawers';
import { MenuLayerProvider } from '@material-hu/components/layers/Menus';

import { MobileLayout } from './layouts/MobileLayout';
import AuditsPage from './pages/Audits';
import { HomePage } from './pages/Home';
import NoticesPage from './pages/Notices';
import ProcessesPage from './pages/Processes';
import './i18n';

const theme = createHuGoTheme();
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MenuLayerProvider>
          <DialogLayerProvider>
            <DrawerLayerProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<MobileLayout />}>
                    <Route
                      path="/"
                      element={<HomePage />}
                    />
                    <Route
                      path="/procesos"
                      element={<ProcessesPage />}
                    />
                    <Route
                      path="/avisos"
                      element={<NoticesPage />}
                    />
                    <Route
                      path="/auditorias"
                      element={<AuditsPage />}
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </DrawerLayerProvider>
          </DialogLayerProvider>
        </MenuLayerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
