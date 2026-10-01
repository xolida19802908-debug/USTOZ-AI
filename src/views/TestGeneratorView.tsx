import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Upload,
  Search,
  Globe,
  CheckCircle,
  Eye,
  EyeOff,
  Edit2,
  Save,
  Printer,
  RotateCcw,
  Play,
  HelpCircle,
  BookMarked,
  Info,
  ChevronRight,
} from 'lucide-react';
import { SUBJECTS, OFFICIAL_TEXTBOOKS } from '../data/textbooks';
import { Textbook, TextbookChapter, TestQuestion, TestSet } from '../types';
import { callAIGenerator } from '../services/api';
import { useToast } from '../components/Toast';
import { AILoadingIndicator } from '../components/AILoadingIndicator';
import { PrintHeader } from '../components/PrintHeader';

interface Props {
  onSave: (data: any, title: string, subject: string, grade: number, topic: string) => void;
  onStartTakingTest: (testSet: TestSet) => void;
  initialSubject?: string;
}

export const TestGeneratorView: React.FC<Props> = ({
  onSave,
  onStartTakingTest,
  initialSubject,
}) => {
  const { showToast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState(initialSubject || "O'zbekiston tarixi");
  const [selectedGrade, setSelectedGrade] = useState<number>(8);

  // Available textbooks matching subject & grade
  const matchingTextbooks = OFFICIAL_TEXTBOOKS.filter(
    (tb) => tb.subjectName === selectedSubject && tb.grade === selectedGrade
  );

  const [selectedTextbookId, setSelectedTextbookId] = useState<string>(
    matchingTextbooks[0]?.id || ''
  );

  // When grade or subject changes, select matching textbook
  useEffect(() => {
    const matched = OFFICIAL_TEXTBOOKS.find(
      (tb) => tb.subjectName === selectedSubject && tb.grade === selectedGrade
    );
    if (matched) {
      setSelectedTextbookId(matched.id);
    } else {
      setSelectedTextbookId('');
    }
  }, [selectedSubject, selectedGrade]);

  const currentTextbook = OFFICIAL_TEXTBOOKS.find((tb) => tb.id === selectedTextbookId);

  // Chapter & topic selection
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');

  const currentChapter = currentTextbook?.chapters.find((ch) => ch.id === selectedChapterId);
  const currentTopic = currentChapter?.topics.find((t) => t.id === selectedTopicId);

  // Set default chapter when textbook changes
  useEffect(() => {
    if (currentTextbook && currentTextbook.chapters.length > 0) {
      setSelectedChapterId(currentTextbook.chapters[0].id);
      if (currentTextbook.chapters[0].topics.length > 0) {
        setSelectedTopicId(currentTextbook.chapters[0].topics[0].id);
      }
    } else {
      setSelectedChapterId('');
      setSelectedTopicId('');
    }
  }, [selectedTextbookId]);

  // Set default topic when chapter changes
  useEffect(() => {
    if (currentChapter && currentChapter.topics.length > 0) {
      setSelectedTopicId(currentChapter.topics[0].id);
    } else {
      setSelectedTopicId('');
    }
  }, [selectedChapterId]);

  // Test parameters
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("O‘rta");
  const [questionType, setQuestionType] = useState<string>("4 variantli yopiq test");

  // Fallback / missing textbook modal states (Requirements #5 & #22)
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [showPdfUploadModal, setShowPdfUploadModal] = useState(false);
  const [uploadedPdfText, setUploadedPdfText] = useState('');
  const [allowGeneralKnowledge, setAllowGeneralKnowledge] = useState(false);

  // Generated state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [testSet, setTestSet] = useState<TestSet | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Toggle single question answer reveal
  const toggleAnswer = (num: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  // Toggle reveal all
  const [revealAll, setRevealAll] = useState(false);
  const toggleRevealAll = () => {
    const next = !revealAll;
    setRevealAll(next);
    if (testSet) {
      const updated: Record<number, boolean> = {};
      testSet.questions.forEach((q) => {
        updated[q.number] = next;
      });
      setRevealedAnswers(updated);
    }
  };

  const handleGenerate = async (forceGeneral = false) => {
    // Check if textbook is missing or not electronically available
    if ((!currentTextbook || !currentTextbook.available) && !allowGeneralKnowledge && !forceGeneral && !uploadedPdfText) {
      setShowMissingModal(true);
      return;
    }

    const topicTitle = customTopic.trim() || currentTopic?.title || currentChapter?.title || `${selectedGrade}-sinf ${selectedSubject} umumiy mavzusi`;

    if (!topicTitle) {
      showToast('Iltimos, mavzuni tanlang yoki kiriting', 'error');
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    const sourceInfo = currentTextbook?.available && currentTopic
      ? `Manba: ${currentTextbook.title}, ${currentTopic.page}-bet`
      : uploadedPdfText
      ? "Manba: O‘qituvchi yuklagan PDF matni asosida"
      : `${selectedGrade}-sinf ${selectedSubject} rasmiy dasturi`;

    try {
      const result = await callAIGenerator('test', {
        subject: selectedSubject,
        grade: selectedGrade,
        textbookName: currentTextbook?.title || `${selectedGrade}-sinf ${selectedSubject} darsligi`,
        chapterTitle: currentChapter?.title || "Umumiy bo‘lim",
        topicTitle,
        count: questionCount,
        difficulty,
        questionType,
        sourceInfo,
        contextText: uploadedPdfText || (currentTopic?.keyPoints?.join('. ') ?? ''),
        isTextbookBased: Boolean(currentTextbook?.available || uploadedPdfText),
      });

      const newTestSet: TestSet = {
        id: `test-${Date.now()}`,
        title: `${selectedGrade}-sinf ${selectedSubject}: ${topicTitle}`,
        subject: selectedSubject,
        grade: selectedGrade,
        textbookName: currentTextbook?.title || `${selectedGrade}-sinf darsligi`,
        chapterTitle: currentChapter?.title,
        topicTitle,
        difficulty,
        questionType,
        isTextbookBased: Boolean(currentTextbook?.available || uploadedPdfText),
        createdAt: new Date().toISOString(),
        questions: result.questions || [],
      };

      setTestSet(newTestSet);
      setIsSuccess(true);
      setRevealedAnswers({});
      setRevealAll(false);
      showToast('✓ Test muvaffaqiyatli yaratildi!', 'success');
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error: any) {
      showToast(error.message || 'Test yaratishda xatolik yuz berdi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!testSet) return;
    onSave(
      testSet,
      testSet.title,
      testSet.subject,
      testSet.grade,
      testSet.topicTitle
    );
    showToast('✓ Test muvaffaqiyatli saqlandi', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleQuestionEdit = (qId: string, updatedFields: Partial<TestQuestion>) => {
    if (!testSet) return;
    const updatedQuestions = testSet.questions.map((q) =>
      q.id === qId ? { ...q, ...updatedFields } : q
    );
    setTestSet({ ...testSet, questions: updatedQuestions });
    setEditingQuestionId(null);
    showToast('✓ Savol tahrirlandi', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Printable Header */}
      <PrintHeader
        documentTitle={`Nazorat Testi: ${testSet?.topicTitle || 'Darslik testi'}`}
        subject={selectedSubject}
        grade={selectedGrade}
        topic={testSet?.topicTitle}
      />

      {/* Workflow Step-by-Step Generator Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900">
                Darslik asosidagi test tizimi
              </h2>
              <p className="text-xs text-slate-500">
                Maktab darsliklaridagi sahifalar, boblar va faktlarga tayangan holda test tuzing
              </p>
            </div>
          </div>
          {currentTextbook && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Darslik bazasi mavjud</span>
            </div>
          )}
        </div>

        {/* Step 1: Subject & Grade Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Fanni tanlang <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Sinfni tanlang <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                <option key={g} value={g}>
                  {g}-sinf
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Textbook Selection */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. Tasdiqlangan darslik <span className="text-rose-500">*</span>
            </label>
            {matchingTextbooks.length > 0 ? (
              <select
                value={selectedTextbookId}
                onChange={(e) => setSelectedTextbookId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {matchingTextbooks.map((tb) => (
                  <option key={tb.id} value={tb.id}>
                    {tb.title} ({tb.authors}, {tb.year}-yil) {tb.available ? '✓ Mavjud' : '⚠️ Elektron nusxasiz'}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span>Ushbu sinf uchun darslik katalogi qidirilmoqda...</span>
                <button
                  type="button"
                  onClick={() => setShowPdfUploadModal(true)}
                  className="font-bold underline ml-2"
                >
                  PDF yuklash
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Chapter and Topic Selection */}
        {currentTextbook && currentTextbook.chapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Bobni tanlang
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {currentTextbook.chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.title} ({ch.pages}-betlar)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                5. Mavzuni tanlang (aniq sahifa ko‘rsatilgan)
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {currentChapter?.topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.page}-bet)
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              4. Dars mavzusini kiriting <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Masalan: Nyutonning ikkinchi qonuni va inersiya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        )}

        {/* Step 4: Questions Count, Difficulty & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Savollar soni
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value={5}>5 ta savol (Tezkor tekshiruv)</option>
              <option value={10}>10 ta savol (Dars yakuniy nazorati)</option>
              <option value={15}>15 ta savol (Katta test)</option>
              <option value={20}>20 ta savol (Choraklik test)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Qiyinlik darajasi
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="Oson">Oson (Asosiy faktlar)</option>
              <option value="O‘rta">O‘rta (Standart maktab talabi)</option>
              <option value="Qiyin">Qiyin (Tahliliy va chuqurlashtirilgan)</option>
              <option value="Aralash">Aralash darajali</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Savol turi
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="4 variantli yopiq test">4 variantli yopiq test (A, B, C, D)</option>
              <option value="To‘g‘ri yoki noto‘g‘ri">To‘g‘ri yoki noto‘g‘ri (Mantiqiy)</option>
            </select>
          </div>
        </div>

        {/* Source citation notice */}
        {currentTopic && (
          <div className="p-3 mb-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Tanlangan manba:</strong> {currentTextbook?.title}, {currentTopic.page}-bet
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200/80 text-blue-900">
              100% Faktik manba
            </span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => handleGenerate(false)}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Test yaratilmoqda...' : 'Darslikdan test yaratish'}</span>
          </button>
        </div>
      </div>

      {/* Loading Animation */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <AILoadingIndicator text="Darslik tahlil qilinmoqda..." />
        </div>
      )}

      {/* Success Banner */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <AILoadingIndicator isSuccess={true} />
        </div>
      )}

      {/* Generated Test Results Section */}
      {testSet && !isLoading && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                {testSet.questions.length} ta savol
              </span>
              <span className="text-xs text-slate-500">
                {testSet.grade}-sinf · {testSet.subject} · {testSet.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Test taking mode button (Requirement #8) */}
              <button
                onClick={() => onStartTakingTest(testSet)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Testni ishlash</span>
              </button>

              <button
                onClick={toggleRevealAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
              >
                {revealAll ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealAll ? 'Javoblarni yashirish' : 'Javoblarni ko‘rsatish'}</span>
              </button>

              <button
                onClick={() => handleGenerate(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Qayta yaratish</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Saqlash</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Chop etish</span>
              </button>
            </div>
          </div>

          {/* Test Questions List */}
          <div className="space-y-4">
            {testSet.questions.map((q) => {
              const isRevealed = revealedAnswers[q.number] || revealAll;

              return (
                <div
                  key={q.number}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all print-card"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 border border-blue-100">
                        {q.number}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 no-print shrink-0">
                      <button
                        onClick={() => toggleAnswer(q.number)}
                        className="text-xs text-slate-500 hover:text-blue-700 font-medium px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 transition-colors"
                      >
                        {isRevealed ? 'Javobni yashirish' : 'Javobni ko‘rsatish'}
                      </button>
                    </div>
                  </div>

                  {/* 4 Options Grid (A, B, C, D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9 mb-3">
                    {q.options.map((opt) => {
                      const isCorrect = opt.key === q.correctAnswer;
                      const showHighlight = isRevealed && isCorrect;

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                            showHighlight
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-2xs'
                              : 'bg-slate-50/70 border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-2 text-slate-500">
                            {opt.key})
                          </span>
                          <span>{opt.text}</span>
                          {showHighlight && (
                            <span className="ml-2 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                              ✓ To‘g‘ri javob
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation & Source (Revealed) */}
                  {isRevealed && (
                    <div className="ml-9 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs space-y-1 animate-in fade-in duration-200">
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Izoh:</strong> {q.explanation}
                      </p>
                      <p className="text-blue-800 font-semibold text-[11px]">
                        {q.source}
                      </p>
                    </div>
                  )}

                  {/* Print-only source footer */}
                  <div className="print-only text-[9pt] text-gray-600 mt-2 pl-9">
                    {q.source}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Requirement #5: Missing Textbook Modal */}
      {showMissingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">
                Tanlangan darslikning elektron nusxasi topilmadi.
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ushbu darslikning to‘liq matni hozircha raqamlashtirilmagan. Siz o‘zingizdagi darslik parchasini yuklashingiz yoki boshqa darslikni tanlashingiz mumkin.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowMissingModal(false);
                  setShowPdfUploadModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>📤 PDF yuklash / Matn kiritish</span>
              </button>

              <button
                onClick={() => setShowMissingModal(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>🔎 Boshqa darslikni tanlash</span>
              </button>

              <a
                href="https://edu.uz"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>🌐 Rasmiy manbadan qidirish (edu.uz)</span>
              </a>
            </div>

            {/* General knowledge prompt confirmation (Requirement #5) */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-800 mb-2">
                “Darslik manbasi mavjud emas. Umumiy bilim asosida test yaratilsinmi?”
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAllowGeneralKnowledge(true);
                    setShowMissingModal(false);
                    handleGenerate(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  Ha, umumiy bilim asosida tuzilsin
                </button>
                <button
                  onClick={() => setShowMissingModal(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Yo‘q
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Upload / Excerpt Paste Modal */}
      {showPdfUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Darslik matni yoki PDF parchasini kiritish</span>
              </h3>
              <button
                onClick={() => setShowPdfUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Darslikdan nusxa olingan matnni shu yerga joylashtiring. AI ushbu matnga tayangan holda xatosiz test yaratadi.
            </p>

            <textarea
              rows={6}
              value={uploadedPdfText}
              onChange={(e) => setUploadedPdfText(e.target.value)}
              placeholder="Darslikdagi matnni yoki konspektni shu yerga kiriting..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPdfUploadModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => {
                  setShowPdfUploadModal(false);
                  showToast('✓ Darslik parchasi yuklandi', 'success');
                  handleGenerate(true);
                }}
                disabled={!uploadedPdfText.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white shadow-xs"
              >
                Matn asosida test yaratish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
