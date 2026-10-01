import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  Timer,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { TestSet } from '../types';
import { playChime } from '../utils/audio';

interface Props {
  testSet: TestSet;
  onBackToEditor: () => void;
}

export const TestTakingView: React.FC<Props> = ({ testSet, onBackToEditor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = testSet.questions;
  const currentQuestion = questions[currentIndex];
  const total = questions.length;

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    playChime('click');
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.number]: key,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    playChime('celebrate');
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.number] === q.correctAnswer) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / total) * 100);
  const incorrectCount = total - correctCount;

  // Grade classification
  const getGradeTitle = (pct: number) => {
    if (pct >= 86) return { grade: "5 (A‘lo)", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" };
    if (pct >= 71) return { grade: "4 (Yaxshi)", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
    if (pct >= 56) return { grade: "3 (Qoniqarli)", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
    return { grade: "2 (Qoniqarsiz)", color: "text-rose-600", bg: "bg-rose-50 border-rose-200" };
  };

  const gradeInfo = getGradeTitle(percentage);

  // If submitted, show results screen
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Result Header Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-slate-900 mb-1">
            Test muvaffaqiyatli yakunlandi!
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {testSet.title}
          </p>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {correctCount} / {total}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">To‘g‘ri javoblar</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-extrabold text-emerald-600 tabular-nums">
                {percentage}%
              </p>
              <p className="text-[11px] text-slate-500 font-medium">O‘zlashtirish</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-extrabold text-rose-500 tabular-nums">
                {incorrectCount}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Xatolar soni</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${gradeInfo.bg}`}>
              <p className={`text-2xl font-extrabold tabular-nums ${gradeInfo.color}`}>
                {gradeInfo.grade.split(' ')[0]}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">Baho</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan ishlash</span>
            </button>

            <button
              onClick={onBackToEditor}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Test tahririga qaytish</span>
            </button>
          </div>
        </div>

        {/* Detailed Breakdown Review */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-heading text-slate-900">
            Savollar tahlili va darslik izohlari
          </h3>

          {questions.map((q) => {
            const userAnswer = selectedAnswers[q.number];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div
                key={q.number}
                className={`p-5 rounded-2xl bg-white border shadow-xs transition-all ${
                  isCorrect ? 'border-emerald-200/90' : 'border-rose-200/90'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.number}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h4>
                  </div>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>To‘g‘ri</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                      <XCircle className="w-4 h-4" />
                      <span>Xato</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9 mb-3">
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt.key;
                    const isAnsCorrect = opt.key === q.correctAnswer;

                    return (
                      <div
                        key={opt.key}
                        className={`p-2.5 rounded-xl border text-xs ${
                          isAnsCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="font-bold mr-1.5">{opt.key})</span>
                        <span>{opt.text}</span>
                        {isAnsCorrect && (
                          <span className="ml-1.5 text-[10px] text-emerald-700 font-bold">
                            (To‘g‘ri javob)
                          </span>
                        )}
                        {isSelected && !isAnsCorrect && (
                          <span className="ml-1.5 text-[10px] text-rose-700 font-bold">
                            (Siz tanladingiz)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="ml-9 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <p className="text-slate-700">
                    <strong>Darslik izohi:</strong> {q.explanation}
                  </p>
                  <p className="text-blue-700 font-medium text-[11px]">
                    {q.source}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Test-Taking Mode Interface
  const currentAnswer = selectedAnswers[currentQuestion.number];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Bar with Progress */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              Savol {currentIndex + 1} / {total}
            </span>
            <span className="text-[11px] text-slate-400">
              ({answeredCount} ta belgilandi)
            </span>
          </div>
          <button
            onClick={onBackToEditor}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Chiqish
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
        <div className="flex items-start gap-3 mb-6">
          <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 text-sm font-bold flex items-center justify-center shrink-0">
            {currentQuestion.number}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((opt) => {
            const isSelected = currentAnswer === opt.key;

            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-xs font-semibold text-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Oldingi</span>
          </button>

          {currentIndex === total - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <span>Testni yakunlash</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <span>Keyingi savol</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question tracker bubbles */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {questions.map((q, idx) => {
          const isAnswered = Boolean(selectedAnswers[q.number]);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.number}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/40'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {q.number}
            </button>
          );
        })}
      </div>
    </div>
  );
};
