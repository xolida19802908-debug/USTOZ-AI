import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastProvider, useToast } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Views
import { DashboardView } from './views/DashboardView';
import { LessonGeneratorView } from './views/LessonGeneratorView';
import { TestGeneratorView } from './views/TestGeneratorView';
import { TestTakingView } from './views/TestTakingView';
import { QuestionGeneratorView } from './views/QuestionGeneratorView';
import { HomeworkGeneratorView } from './views/HomeworkGeneratorView';
import { InteractiveActivitiesView } from './views/InteractiveActivitiesView';
import { TopicExplainerView } from './views/TopicExplainerView';
import { AssessmentAssistantView } from './views/AssessmentAssistantView';
import { SavedMaterialsView } from './views/SavedMaterialsView';

// Types & Storage
import { SavedMaterial, TestSet, MaterialType } from './types';
import { getSavedMaterials, saveMaterial, deleteMaterial } from './utils/storage';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Saved materials state
  const [materials, setMaterials] = useState<SavedMaterial[]>([]);

  // Selected test set for student taking mode
  const [activeTestSet, setActiveTestSet] = useState<TestSet | null>(null);

  // Subject filter shortcut
  const [selectedSubjectShortcut, setSelectedSubjectShortcut] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMaterials(getSavedMaterials());
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveItem = (
    data: any,
    title: string,
    subject: string,
    grade: number,
    topic: string,
    type: MaterialType = 'lesson'
  ) => {
    const saved = saveMaterial({
      type,
      title,
      subject,
      grade,
      topic,
      data,
    });
    setMaterials(getSavedMaterials());
    return saved;
  };

  const handleDeleteItem = (id: string) => {
    deleteMaterial(id);
    setMaterials(getSavedMaterials());
  };

  const handleOpenMaterial = (material: SavedMaterial) => {
    if (material.type === 'lesson') {
      setActiveTab('lesson');
    } else if (material.type === 'test') {
      setActiveTab('test');
    } else if (material.type === 'homework') {
      setActiveTab('homework');
    } else if (material.type === 'questions') {
      setActiveTab('questions');
    } else if (material.type === 'explainer') {
      setActiveTab('explain');
    } else if (material.type === 'rubric') {
      setActiveTab('rubric');
    }
  };

  const handleStartTakingTest = (testSet: TestSet) => {
    setActiveTestSet(testSet);
    setActiveTab('test-take');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSubjectSelect = (subj: string) => {
    setSelectedSubjectShortcut(subj);
    setActiveTab('lesson');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        savedCount={materials.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          activeTab={activeTab}
          onOpenMobile={() => setIsOpenMobile(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onPrint={() => window.print()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              savedMaterials={materials}
              onOpenMaterial={handleOpenMaterial}
              onQuickSubjectSelect={handleQuickSubjectSelect}
            />
          )}

          {activeTab === 'lesson' && (
            <LessonGeneratorView
              initialSubject={selectedSubjectShortcut}
              onSave={(data, title, subject, grade, topic) =>
                handleSaveItem(data, title, subject, grade, topic, 'lesson')
              }
            />
          )}

          {activeTab === 'test' && (
            <TestGeneratorView
              initialSubject={selectedSubjectShortcut}
              onSave={(data, title, subject, grade, topic) =>
                handleSaveItem(data, title, subject, grade, topic, 'test')
              }
              onStartTakingTest={handleStartTakingTest}
            />
          )}

          {activeTab === 'test-take' && activeTestSet && (
            <TestTakingView
              testSet={activeTestSet}
              onBackToEditor={() => setActiveTab('test')}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionGeneratorView
              initialSubject={selectedSubjectShortcut}
              onSave={(data, title, subject, grade, topic) =>
                handleSaveItem(data, title, subject, grade, topic, 'questions')
              }
            />
          )}

          {activeTab === 'homework' && (
            <HomeworkGeneratorView
              initialSubject={selectedSubjectShortcut}
              onSave={(data, title, subject, grade, topic) =>
                handleSaveItem(data, title, subject, grade, topic, 'homework')
              }
            />
          )}

          {activeTab === 'interactive' && (
            <InteractiveActivitiesView initialSubject={selectedSubjectShortcut} />
          )}

          {activeTab === 'explain' && (
            <TopicExplainerView
              initialSubject={selectedSubjectShortcut}
              onSave={(data, title, subject, grade, topic) =>
                handleSaveItem(data, title, subject, grade, topic, 'explainer')
              }
            />
          )}

          {activeTab === 'rubric' && (
            <AssessmentAssistantView
              initialSubject={selectedSubjectShortcut}
              onSave={(data, title, subject, grade, topic) =>
                handleSaveItem(data, title, subject, grade, topic, 'rubric')
              }
            />
          )}

          {activeTab === 'saved' && (
            <SavedMaterialsView
              materials={materials}
              onOpenMaterial={handleOpenMaterial}
              onDeleteMaterial={handleDeleteItem}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        savedMaterials={materials}
        onSelectMaterial={handleOpenMaterial}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
