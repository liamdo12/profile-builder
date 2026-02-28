import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { RequireRole } from '@/components/auth/require-role'
import { AppLayout } from '@/components/layout/app-layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DocumentListPage from './pages/DocumentListPage'
import UploadPage from './pages/UploadPage'
import SmartResumeSetupPage from './pages/SmartResumeSetupPage'
import SmartResumeResultPage from './pages/SmartResumeResultPage'
import CoverLetterSetupPage from './pages/CoverLetterSetupPage'
import CoverLetterResultPage from './pages/CoverLetterResultPage'
import AdminUserManagementPage from './pages/AdminUserManagementPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="profile-builder-theme">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/documents" element={<DocumentListPage />} />
                      <Route path="/upload" element={<UploadPage />} />
                      <Route path="/smart-resume" element={<SmartResumeSetupPage />} />
                      <Route path="/smart-resume/:smartResumeId" element={<SmartResumeResultPage />} />

                      {/* Premium + Admin only */}
                      <Route
                        path="/cover-letter"
                        element={
                          <RequireRole allowed={['PREMIUM', 'ADMIN']}>
                            <CoverLetterSetupPage />
                          </RequireRole>
                        }
                      />
                      <Route
                        path="/cover-letter/:coverLetterId"
                        element={
                          <RequireRole allowed={['PREMIUM', 'ADMIN']}>
                            <CoverLetterResultPage />
                          </RequireRole>
                        }
                      />

                      {/* Admin only */}
                      <Route
                        path="/admin/users"
                        element={
                          <RequireRole allowed={['ADMIN']}>
                            <AdminUserManagementPage />
                          </RequireRole>
                        }
                      />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}
