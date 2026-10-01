import React from 'react';
import { Menu, Search, Printer, Calendar, Sparkles } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface Props {
  activeTab: ActiveTab;
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  onPrint: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Bosh sahifa',
    subtitle: 'Bugungi darslaringizni tayyorlashda USTOZ AI sizga yordam beradi.',
  },
  lesson: {
    title: 'Dars ishlanmasi generatori',
    subtitle: '12 bosqichli to‘liq davlat ta’lim standarti (DTS) dars konspekti.',
  },
  test: {
    title: 'Darslik asosidagi test tizimi',
    subtitle: 'Rasmiy maktab darsliklari sahifalariga tayangan ishonchli testlar.',
  },
  'test-take': {
    title: 'Testni ishlash rejimi',
    subtitle: 'O‘quvchilar va amaliyot uchun interaktiv test yechish maydoni.',
  },
  questions: {
    title: 'Savollar to‘plami',
    subtitle: 'Blum taksonomiyasi va turli qiyinlik darajasidagi savollar.',
  },
  homework: {
    title: 'Tabaqalashtirilgan uy vazifasi',
    subtitle: 'Boshlang‘ich, o‘rta va yuqori darajadagi individual topshiriqlar.',
  },
  interactive: {
    title: 'Sinfdagi interaktiv mashg‘ulotlar',
    subtitle: '8 ta qiziqarli sinf faoliyati va tezkor bilim bellashuvlari.',
  },
  explain: {
    title: 'Mavzuni tushuntirish yordamchisi',
    subtitle: 'Oddiy til, chuqur tahlil, hayotiy misollar va tayanch tushunchalar.',
  },
  rubric: {
    title: 'Baholash mezonlari va rubrikalar',
    subtitle: 'Shaffof baholash jadvali, ballar taqsimoti va o‘quvchiga tavsiyalar.',
  },
  saved: {
    title: 'Saqlangan materiallar',
    subtitle: 'Siz tayyorlagan va saqlangan barcha o‘quv-uslubiy ishlanmalar.',
  },
};

export const Header: React.FC<Props> = ({
  activeTab,
  onOpenMobile,
  onOpenSearch,
  onPrint,
}) => {
  const current = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;

  // Uzbek date formatter
  const today = new Date();
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ];
  const dateStr = `${today.getDate()}-${months[today.getMonth()]}, ${today.getFullYear()}-yil`;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 font-heading leading-tight flex items-center gap-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-600 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{dateStr}</span>
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium shadow-2xs transition-colors"
          title="Tezkor qidiruv (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Qidiruv</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            Ctrl K
          </kbd>
        </button>

        {/* Print Button */}
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
          title="Chop etish"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Chop etish</span>
        </button>
      </div>
    </header>
  );
};
