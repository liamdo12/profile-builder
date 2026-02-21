import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { AppLayout } from '@/components/layout/app-layout'
import DocumentListPage from './pages/DocumentListPage'
import UploadPage from './pages/UploadPage'
import SmartResumeSetupPage from './pages/SmartResumeSetupPage'
import SmartResumeResultPage from './pages/SmartResumeResultPage'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="profile-builder-theme">
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DocumentListPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/smart-resume" element={<SmartResumeSetupPage />} />
            <Route path="/smart-resume/:smartResumeId" element={<SmartResumeResultPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}
