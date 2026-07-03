import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-hu/mui/styles';
import { createHuGoTheme } from '@material-hu/theme/hugo';

import { SnackbarProvider } from '@material-hu/components/design-system/Snackbar';
import { DialogLayerProvider } from '@material-hu/components/layers/Dialogs';
import { DrawerLayerProvider } from '@material-hu/components/layers/Drawers';
import { MenuLayerProvider } from '@material-hu/components/layers/Menus';

import { BranchProvider } from './contexts/BranchContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import AuditsPage from './pages/Audits';
import { HomePage } from './pages/Home';
import NoticesPage from './pages/Notices';
import ProcessesPage from './pages/Processes';
import CompliancePage from './pages/Processes/Compliance';
import ComplianceHistoryPage from './pages/Processes/ComplianceHistory';
import ProcessDetail from './pages/Processes/Detail';
import ManagementPage from './pages/Processes/Management';
import ShiftSettingsPage from './pages/Processes/ShiftSettings';
import ReportingPage from './pages/Reporting';
import './i18n';

const theme = createHuGoTheme();
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider>
            <MenuLayerProvider>
              <DialogLayerProvider>
                <DrawerLayerProvider>
                  <BranchProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route element={<DashboardLayout />}>
                          <Route
                            path="/"
                            element={<HomePage />}
                          />
                          <Route
                            path="/procesos"
                            element={<ProcessesPage />}
                          />
                          <Route
                            path="/procesos/cumplimiento"
                            element={<CompliancePage />}
                          />
                          <Route
                            path="/procesos/cumplimiento/:id"
                            element={<ComplianceHistoryPage />}
                          />
                          <Route
                            path="/procesos/gestion"
                            element={<ManagementPage />}
                          />
                          <Route
                            path="/procesos/turnos"
                            element={<ShiftSettingsPage />}
                          />
                          <Route
                            path="/procesos/:id"
                            element={<ProcessDetail />}
                          />
                          <Route
                            path="/avisos"
                            element={<NoticesPage />}
                          />
                          <Route
                            path="/auditorias"
                            element={<AuditsPage />}
                          />
                          <Route
                            path="/reporteria"
                            element={<ReportingPage />}
                          />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </BranchProvider>
                </DrawerLayerProvider>
              </DialogLayerProvider>
            </MenuLayerProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
