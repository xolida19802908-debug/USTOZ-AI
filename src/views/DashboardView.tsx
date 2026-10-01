import React from 'react';
import {
  BookOpen,
  FileCheck2,
  HelpCircle,
  Home,
  Gamepad2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Sparkle,
  CheckCircle,
  ChevronRight,
  Printer,
  Eye,
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';
import { SavedMaterial } from '../types';
import { SUBJECTS } from '../data/textbooks';
import { playChime } from '../utils/audio';

interface Props {
  onNavigateTab: (tab: ActiveTab) => void;
  savedMaterials: SavedMaterial[];
  onOpenMaterial: (material: SavedMaterial) => void;
  onQuickSubjectSelect: (subjectName: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  onNavigateTab,
  savedMaterials,
  onOpenMaterial,
  onQuickSubjectSelect,
}) => {
  const quickActions = [
    {
      id: 'lesson' as ActiveTab,
      title: 'Dars yaratish',
      desc: '12 bosqichli DTS dars konspekti',
      icon: BookOpen,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/15',
      borderColor: 'border-emerald-200/80',
      badge: 'Eng mashhur',
    },
    {
      id: 'test' as ActiveTab,
      title: 'Test yaratish',
      desc: 'Darslik sahifasiga asoslangan test',
      icon: FileCheck2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/15',
      borderColor: 'border-blue-200/80',
      badge: 'Darslik manbali',
    },
    {
      id: 'questions' as ActiveTab,
      title: 'Savollar yaratish',
      desc: 'Oson, o‘rta, qiyin & Blum darajalari',
      icon: HelpCircle,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/15',
      borderColor: 'border-purple-200/80',
      badge: null,
    },
    {
      id: 'homework' as ActiveTab,
      title: 'Uy vazifasi',
      desc: '3 darajali tabaqalashtirilgan vazifa',
      icon: Home,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-500/10 hover:bg-amber-500/15',
      borderColor: 'border-amber-200/80',
      badge: 'Tabaqalangan',
    },
    {
      id: 'interactive' as ActiveTab,
      title: 'Interaktiv topshiriq',
      desc: '8 xil sinf o‘yini va tezkor viktorina',
      icon: Gamepad2,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-500/10 hover:bg-rose-500/15',
      borderColor: 'border-rose-200/80',
      badge: 'Sinfda o‘ynash',
    },
    {
      id: 'explain' as ActiveTab,
      title: 'Mavzuni tushuntirish',
      desc: 'Oddiy til, hayotiy misol, tayanch atamalar',
      icon: Sparkles,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-500/10 hover:bg-teal-500/15',
      borderColor: 'border-teal-200/80',
      badge: null,
    },
  ];

  const handleCardClick = (tab: ActiveTab) => {
    playChime('click');
    onNavigateTab(tab);
  };

  const lessonCount = savedMaterials.filter((m) => m.type === 'lesson').length;
  const testCount = savedMaterials.filter((m) => m.type === 'test').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkle className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>O‘zbekiston milliy maktab ta’limi standarti bilan integratsiya</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight text-white mb-2">
            Assalomu alaykum, Ustoz! 👋
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Bugungi darslaringizni tayyorlashda USTOZ AI sizga yordam beradi.
            Darsliklar asosida sifatli reja, testlar va interaktiv metodlarni bir necha soniyada yarating.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCardClick('lesson')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <BookOpen className="w-4 h-4" />
              <span>Dars ishlanmasi yaratish</span>
            </button>
            <button
              onClick={() => handleCardClick('test')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-all hover:scale-102 active:scale-98"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span>Darslikdan test tuzish</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-slate-900 tabular-nums">
              {lessonCount}
            </p>
            <p className="text-xs text-slate-500 font-medium">Tayyorlangan darslar</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-slate-900 tabular-nums">
              {testCount}
            </p>
            <p className="text-xs text-slate-500 font-medium">Tuzilgan testlar</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-slate-900">
              100%
            </p>
            <p className="text-xs text-slate-500 font-medium">DTS muvofiqligi</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-slate-900">
              45 daq
            </p>
            <p className="text-xs text-slate-500 font-medium">Standart dars formati</p>
          </div>
        </div>
      </div>

      {/* 6 Quick Action Cards (Explicitly requested in requirement #3) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900">
              Darsga tayyorgarlik vositalari
            </h3>
            <p className="text-xs text-slate-500">
              Kerakli modulni tanlang va bir necha qadamda material yarating
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className={`group relative p-5 rounded-2xl bg-white border ${item.borderColor} shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${item.bgColor} ${item.iconColor} transition-colors`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold font-heading text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Yaratishni boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Subject Shortcuts */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold font-heading text-slate-900 mb-3">
          Fanlar bo‘yicha tezkor tanlov
        </h3>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onQuickSubjectSelect(sub.name)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/70 hover:border-emerald-300 text-xs font-medium text-slate-700 transition-all active:scale-95"
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pedagogical Tip & Quote */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
          Kunning pedagogik hikmati
        </p>
        <blockquote className="text-sm font-medium italic leading-relaxed text-amber-950">
          “Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.”
        </blockquote>
        <p className="text-xs text-amber-700 text-right mt-1 font-semibold">
          — Abdulla Avloniy
        </p>
      </div>

      {/* Recently Saved Materials */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold font-heading text-slate-900">
            Yaqinda saqlangan materiallar
          </h3>
          <button
            onClick={() => onNavigateTab('saved')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Barchasini ko‘rish</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedMaterials.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-200 text-center">
            <p className="text-sm text-slate-500 mb-3">Hozircha saqlangan materiallar yo‘q.</p>
            <button
              onClick={() => onNavigateTab('lesson')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              Birinchi darsingizni yaratib ko‘ring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedMaterials.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenMaterial(item)}
                className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.grade}-sinf · {item.subject}
                  </span>
                  <Eye className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Mavzu: {item.topic}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
