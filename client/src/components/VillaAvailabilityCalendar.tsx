import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAvailability } from '../api';
import type { BusyDate } from '../types';

interface Props {
  villaSlug: string;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  onSelectDate?: (date: string) => void;
}

export const VillaAvailabilityCalendar: React.FC<Props> = ({ villaSlug, selectedCheckIn, selectedCheckOut, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [busyDates, setBusyDates] = useState<BusyDate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const from = new Date(currentMonth);
    const to = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 0);
    fetchAvailability(villaSlug, from.toISOString().split('T')[0], to.toISOString().split('T')[0])
      .then((data) => setBusyDates(data.busyDates))
      .catch(() => setBusyDates([]))
      .finally(() => setLoading(false));
  }, [villaSlug, currentMonth]);

  const busySet = useMemo(() => {
    const set = new Set<string>();
    for (const range of busyDates) {
      const start = new Date(range.start);
      const end = new Date(range.end);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        set.add(d.toISOString().split('T')[0]);
      }
    }
    return set;
  }, [busyDates]);

  const today = new Date().toISOString().split('T')[0];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-2xl p-4 border border-orange-100/50 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <h4 className="font-['EB_Garamond',serif] text-lg font-bold">{monthName}</h4>
        <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>
      {loading && <div className="text-center text-sm text-slate-400 py-2">Loading availability...</div>}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isBusy = busySet.has(dateStr);
          const isPast = dateStr < today;
          const isCheckIn = dateStr === selectedCheckIn;
          const isCheckOut = dateStr === selectedCheckOut;
          const isInRange = selectedCheckIn && selectedCheckOut && dateStr > selectedCheckIn && dateStr < selectedCheckOut;
          const disabled = isBusy || isPast;

          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => onSelectDate?.(dateStr)}
              className={`py-1.5 rounded-lg text-sm font-medium transition-all
                ${disabled ? 'text-slate-300 line-through cursor-not-allowed bg-red-50/50' : 'hover:bg-[#def1f4] cursor-pointer'}
                ${isCheckIn || isCheckOut ? 'bg-[#FF7E5F] text-white font-bold' : ''}
                ${isInRange ? 'bg-[#ffdad2]/40' : ''}
                ${dateStr === today && !isCheckIn ? 'ring-1 ring-[#2EB5B2]' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50/80 border border-red-200" /> Booked</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#FF7E5F]" /> Selected</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-slate-200" /> Available</span>
      </div>
    </div>
  );
};
