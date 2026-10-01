import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Save,
  Printer,
  Edit3,
  Check,
  RotateCcw,
  Target,
  Clock,
  Layers,
  Users,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { SUBJECTS } from '../data/textbooks';
import { callAIGenerator } from '../services/api';
import { useToast } from '../components/Toast';
import { AILoadingIndicator } from '../components/AILoadingIndicator';
import { LessonPlan } from '../types';
import { PrintHeader } from '../components/PrintHeader';

interface Props {
  onSave: (data: any, title: string, subject: string, grade: number, topic: string) => void;
  initialSubject?: string;
}

export const LessonGeneratorView: React.FC<Props> = ({ onSave, initialSubject }) => {
  const { showToast } = useToast();

  const [subject, setSubject] = useState(initialSubject || "O'zbekiston tarixi");
  const [grade, setGrade] = useState<number>(8);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('45 daqiqa');
  const [lessonType, setLessonType] = useState('Aralash dars');
  const [studentLevel, setStudentLevel] = useState("O‘rta daraja");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan['content'] | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState<{ subject?: string; topic?: string }>({});

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation
    const newErrors: { subject?: string; topic?: string } = {};
    if (!subject) newErrors.subject = 'Fan nomini tanlang.';
    if (!topic.trim()) newErrors.topic = 'Mavzuni kiriting.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(newErrors.topic || newErrors.subject || 'Maydonlarni to‘ldiring', 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const result = await callAIGenerator('lesson', {
        subject,
        grade,
        topic,
        duration,
        lessonType,
        studentLevel,
      });

      setLessonPlan(result);
      setIsSuccess(true);
      showToast('✓ Dars muvaffaqiyatli yaratildi!', 'success');
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error: any) {
      showToast(error.message || 'Dars yaratishda xatolik yuz berdi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!lessonPlan) return;
    const textToCopy = `DARS ISHLANMASI (KONSPEKT)
Fan: ${subject} (${grade}-sinf)
Mavzu: ${lessonPlan.topic}
Dars davomiyligi: ${duration}
Dars turi: ${lessonType}

1. DARS MAQSADI:
- Ta'limiy: ${lessonPlan.objectives.educational}
- Rivojlantiruvchi: ${lessonPlan.objectives.developmental}
- Tarbiyaviy: ${lessonPlan.objectives.upbringing}

2. KUTILAYOTGAN NATIJALAR:
${lessonPlan.expectedResults.map((r, i) => `${i + 1}. ${r}`).join('\n')}

3. KERAKLI JIHOZLAR:
${lessonPlan.equipment.map((e, i) => `- ${e}`).join('\n')}

4. DARS BOSQICHLARI:
- Tashkiliy qism (${lessonPlan.stages.organizational.time}): ${lessonPlan.stages.organizational.text}
- Takrorlash (${lessonPlan.stages.review.time}): ${lessonPlan.stages.review.text}
- Yangi mavzu (${lessonPlan.stages.newTopic.time}): ${lessonPlan.stages.newTopic.text}
- Amaliy mashg'ulot (${lessonPlan.stages.practical.time}): ${lessonPlan.stages.practical.text}
- Mustahkamlash (${lessonPlan.stages.consolidation.time}): ${lessonPlan.stages.consolidation.text}
- Baholash (${lessonPlan.stages.assessment.time}): ${lessonPlan.stages.assessment.criteria}
- Uyga vazifa (${lessonPlan.stages.homework.time}): ${lessonPlan.stages.homework.text}

5. YAKUNIY XULOSA:
${lessonPlan.stages.conclusion}
`;

    navigator.clipboard.writeText(textToCopy);
    showToast('✓ Dars konspekti nusxalandi', 'success');
  };

  const handleSave = () => {
    if (!lessonPlan) return;
    onSave(
      lessonPlan,
      `${grade}-sinf ${subject}: ${lessonPlan.topic}`,
      subject,
      grade,
      lessonPlan.topic
    );
    showToast('✓ Dars muvaffaqiyatli saqlandi', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Header */}
      <PrintHeader
        documentTitle={`Dars Ishlanmasi: ${lessonPlan?.topic || topic || 'Yangi dars'}`}
        subject={subject}
        grade={grade}
        topic={lessonPlan?.topic || topic}
      />

      {/* Generator Form Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900">
              12 qismli dars ishlanmasi generatori
            </h2>
            <p className="text-xs text-slate-500">
              Davlat ta’lim standarti (DTS) talablari bo‘yicha to‘liq dars konspektini tayyorlang
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Fan nomi <span className="text-rose-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Sinf <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                  <option key={g} value={g}>
                    {g}-sinf
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dars davomiyligi
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              >
                <option value="45 daqiqa">45 daqiqa (Standart dars)</option>
                <option value="80 daqiqa">80 daqiqa (Qo‘shaloq dars / Para)</option>
                <option value="35 daqiqa">35 daqiqa (Boshlang‘ich sinf)</option>
              </select>
            </div>

            {/* Lesson Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dars turi
              </label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              >
                <option value="Aralash dars">Aralash dars (kombinatsiyalangan)</option>
                <option value="Yangi bilim beruvchi dars">Yangi bilim beruvchi dars</option>
                <option value="Mustahkamlovchi dars">Mustahkamlovchi dars</option>
                <option value="Amaliy va laboratoriya darsi">Amaliy va laboratoriya darsi</option>
                <option value="Nazorat va baholash darsi">Nazorat va baholash darsi</option>
              </select>
            </div>

            {/* Student Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                O‘quvchilar darajasi
              </label>
              <select
                value={studentLevel}
                onChange={(e) => setStudentLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              >
                <option value="O‘rta daraja">O‘rta daraja (Standart sinf)</option>
                <option value="Kuchli / Ixtisoslashtirilgan">Kuchli / Ixtisoslashtirilgan sinf</option>
                <option value="Boshlang‘ich ko‘nikmalar">Boshlang‘ich ko‘nikmalar (qo‘shimcha ehtiyojli)</option>
                <option value="Turlicha qobiliyatli (inklyuziv)">Turlicha qobiliyatli sinf</option>
              </select>
            </div>

            {/* Topic Input */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dars mavzusi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Masalan: Mirzo Ulug‘bek rasadxonasi va ilmiy merosi"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.topic ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                } text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all`}
              />
              {errors.topic && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.topic}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Dars tayyorlanmoqda...' : 'Dars ishlanmasini yaratish'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading Animation State */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <AILoadingIndicator text="USTOZ AI ishlamoqda..." />
        </div>
      )}

      {/* Success Animation State */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <AILoadingIndicator isSuccess={true} />
        </div>
      )}

      {/* Generated Lesson Plan View */}
      {lessonPlan && !isLoading && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                12 qism tayyor
              </span>
              <span className="text-xs text-slate-500">
                {grade}-sinf · {subject}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isEditing
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Tahrirni yakunlash' : 'Tahrirlash'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Nusxalash</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all"
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

          {/* Lesson Content Document */}
          <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-8 text-slate-800 print-card">
            {/* Header info */}
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Dars mavzusi
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
                {lessonPlan.topic}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                <span><strong>Fan:</strong> {subject}</span>
                <span><strong>Sinf:</strong> {grade}-sinf</span>
                <span><strong>Davomiyligi:</strong> {duration}</span>
                <span><strong>Dars turi:</strong> {lessonType}</span>
              </div>
            </div>

            {/* 1. Objectives */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>1. Darsning maqsadlari</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-emerald-800 mb-1">a) Ta’limiy maqsad:</p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonPlan.objectives.educational}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-blue-800 mb-1">b) Rivojlantiruvchi maqsad:</p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonPlan.objectives.developmental}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-purple-800 mb-1">c) Tarbiyaviy maqsad:</p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonPlan.objectives.upbringing}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Expected Results */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. Kutilayotgan natijalar (SMART)</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {lessonPlan.expectedResults.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Equipment */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>3. Kerakli jihozlar va vositalar</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {lessonPlan.equipment.map((eq, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Lesson Stages (Organizational to Conclusion) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>4. Darsning texnologik xaritasi va bosqichlari</span>
              </h3>

              <div className="space-y-3">
                {/* 4.1 Tashkiliy qism */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      4.1. Tashkiliy qism
                    </h4>
                    <span className="text-xs font-bold text-emerald-700">
                      {lessonPlan.stages.organizational.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonPlan.stages.organizational.text}
                  </p>
                </div>

                {/* 4.2 O'tgan mavzuni takrorlash */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      4.2. O‘tgan mavzuni takrorlash va mustahkamlash
                    </h4>
                    <span className="text-xs font-bold text-emerald-700">
                      {lessonPlan.stages.review.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    {lessonPlan.stages.review.text}
                  </p>
                  {lessonPlan.stages.review.questions && (
                    <div className="space-y-1 pl-3 border-l-2 border-emerald-400">
                      <p className="text-[11px] font-bold text-slate-600">Takrorlash savollari:</p>
                      {lessonPlan.stages.review.questions.map((q, idx) => (
                        <p key={idx} className="text-xs text-slate-700 italic">
                          • {q}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4.3 Yangi mavzu */}
                <div className="p-4 rounded-xl border border-emerald-200/90 bg-emerald-50/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase">
                      4.3. Yangi mavzu bayoni
                    </h4>
                    <span className="text-xs font-bold text-emerald-800">
                      {lessonPlan.stages.newTopic.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed mb-3">
                    {lessonPlan.stages.newTopic.text}
                  </p>
                  {lessonPlan.stages.newTopic.keyPoints && (
                    <div className="bg-white p-3 rounded-lg border border-emerald-200">
                      <p className="text-[11px] font-bold text-emerald-800 mb-1.5">
                        Asosiy tayanch tushunchalar:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {lessonPlan.stages.newTopic.keyPoints.map((kp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 4.4 Amaliy mashg'ulot */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      4.4. Amaliy mashg‘ulot va topshiriqlar
                    </h4>
                    <span className="text-xs font-bold text-emerald-700">
                      {lessonPlan.stages.practical.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    {lessonPlan.stages.practical.text}
                  </p>
                  {lessonPlan.stages.practical.tasks && (
                    <ul className="space-y-1 text-xs text-slate-700">
                      {lessonPlan.stages.practical.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-bold text-slate-500">{idx + 1}.</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 4.5 Mustahkamlash */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      4.5. Mustahkamlash
                    </h4>
                    <span className="text-xs font-bold text-emerald-700">
                      {lessonPlan.stages.consolidation.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    {lessonPlan.stages.consolidation.text}
                  </p>
                  {lessonPlan.stages.consolidation.quickCheck && (
                    <div className="space-y-1">
                      {lessonPlan.stages.consolidation.quickCheck.map((qc, idx) => (
                        <p key={idx} className="text-xs text-slate-600 italic">
                          ? {qc}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4.6 Baholash */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      4.6. O‘quvchilarni baholash
                    </h4>
                    <span className="text-xs font-bold text-emerald-700">
                      {lessonPlan.stages.assessment.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonPlan.stages.assessment.criteria}
                  </p>
                </div>

                {/* 4.7 Uyga vazifa */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-amber-900 uppercase">
                      4.7. Uyga vazifa
                    </h4>
                    <span className="text-xs font-bold text-amber-800">
                      {lessonPlan.stages.homework.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {lessonPlan.stages.homework.text}
                  </p>
                </div>

                {/* 4.8 Yakuniy xulosa */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-1.5">
                    4.8. Yakuniy xulosa
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lessonPlan.stages.conclusion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
