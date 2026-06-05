import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import MainLayout from '../components/layout/MainLayout.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import FlashcardPage from '../pages/FlashcardPage.jsx'
import HistoryPage from '../pages/HistoryPage.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import QuizPage from '../pages/QuizPage.jsx'
import QuizResultPage from '../pages/QuizResultPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import ReviewResultPage from '../pages/ReviewResultPage.jsx'
import TopicDetailPage from '../pages/TopicDetailPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/topics/:topicId/flashcards" element={<FlashcardPage />} />
          <Route path="/topics/:topicId/quiz" element={<QuizPage />} />
          <Route path="/quiz-results/:resultId" element={<QuizResultPage />} />
          <Route
            path="/quiz-results/:resultId/review"
            element={<ReviewResultPage />}
          />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
