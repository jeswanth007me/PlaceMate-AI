import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { GithubResumeScreen } from './screens/GithubResumeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { InterviewSetupScreen } from './screens/InterviewSetupScreen';
import { LiveInterviewScreen } from './screens/LiveInterviewScreen';
import { InterviewStartingScreen } from './screens/InterviewStartingScreen';
import { InterviewCompleteScreen } from './screens/InterviewCompleteScreen';
import { EvaluationProcessingScreen } from './screens/EvaluationProcessingScreen';
import { LiveFeedbackScreen } from './screens/LiveFeedbackScreen';
import { ScoreRevealScreen } from './screens/ScoreRevealScreen';
import { DetailedReportScreen } from './screens/DetailedReportScreen';
import { PreparationScreen } from './screens/PreparationScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainContent: React.FC = () => {
  const { currentScreen, accents } = useApp();

  // Full-screen focused flows
  const isStandaloneScreen = [
    'login',
    'signup',
    'onboarding',
    'profile-details',
    'github-resume',
    'interview-starting',
    'live-interview',
    'evaluation-processing',
    'interview-complete',
    'live-feedback',
    'score-reveal',
  ].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'onboarding':
      case 'profile-details':
        return <OnboardingScreen />;
      case 'github-resume':
        return <GithubResumeScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'interview-setup':
        return <InterviewSetupScreen />;
      case 'interview-starting':
        return <InterviewStartingScreen />;
      case 'live-interview':
        return <LiveInterviewScreen />;
      case 'evaluation-processing':
        return <EvaluationProcessingScreen />;
      case 'interview-complete':
        return <InterviewCompleteScreen />;
      case 'live-feedback':
        return <LiveFeedbackScreen />;
      case 'score-reveal':
        return <ScoreRevealScreen />;
      case 'detailed-report':
        return <DetailedReportScreen />;
      case 'preparation':
        return <PreparationScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  if (isStandaloneScreen) {
    return (
      <div className={`min-h-screen w-full bg-[#08090C] text-[#f3f4f6] ${accents.themeClass}`}>
        {renderScreen()}
      </div>
    );
  }

  // App Layout with fixed Sidebar & Top Header
  return (
    <div className={`min-h-screen w-full bg-[#08090C] text-[#f3f4f6] ${accents.themeClass} flex`}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Header />
        <main className="flex-1 pt-16 min-h-screen">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
