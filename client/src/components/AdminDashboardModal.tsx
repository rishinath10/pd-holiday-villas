import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, CheckCircle, RefreshCw, Plus, Star, MapPin, Users, Calendar, Phone, Search, LogOut, AlertCircle, Trash2, Edit3, Save, Link, ChevronLeft, ChevronRight, ArrowLeft, Upload, GripVertical, Image } from 'lucide-react';
import { adminLogin, adminLogout, adminGetMe, adminFetchBookings, adminUpdateBookingStatus, adminCreateBooking, adminUpdateVilla, adminSyncIcal, adminDeleteBooking, adminFetchDatePrices, adminSetDatePrices, adminDeleteDatePrices, adminAddIcalSource, adminDeleteIcalSource, adminUploadVillaImages, adminDeleteVillaImage, adminReorderVillaImages } from '../api';
import type { Villa, Booking, AdminUser, DatePrice } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  villas: Villa[];
  onVillasChanged: (villas: Villa[]) => void;
}

function AdminDashboardModal({ isOpen, onClose, villas, onVillasChanged }: Props) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'villas' | 'reservations' | 'pricing' | 'channels'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notification, setNotification] = useState('');

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [villaFilter, setVillaFilter] = useState('all');

  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [villaForm, setVillaForm] = useState<Record<string, any>>({});

  const [showManualBooking, setShowManualBooking] = useState(false);
  const [mbVilla, setMbVilla] = useState('');
  const [mbName, setMbName] = useState('');
  const [mbEmail, setMbEmail] = useState('');
  const [mbPhone, setMbPhone] = useState('');
  const [mbCheckIn, setMbCheckIn] = useState('');
  const [mbCheckOut, setMbCheckOut] = useState('');
  const [mbGuests, setMbGuests] = useState(2);
  const [mbPayment, setMbPayment] = useState('Manual Bank Transfer');
  const [mbError, setMbError] = useState('');
  const [mbLoading, setMbLoading] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [newIcalVilla, setNewIcalVilla] = useState('');
  const [newIcalSource, setNewIcalSource] = useState<'airbnb' | 'booking.com' | 'agoda' | 'other'>('airbnb');
  const [newIcalUrl, setNewIcalUrl] = useState('');

  const [pricingVillaId, setPricingVillaId] = useState('');
  const [pricingMonth, setPricingMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [datePrices, setDatePrices] = useState<DatePrice[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkLabel, setBulkLabel] = useState('custom');
  const [pricingLoading, setPricingLoading] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartDate = useRef<string | null>(null);

  const [managingPhotosVilla, setManagingPhotosVilla] = useState<Villa | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragImageIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    adminGetMe().then(setAdmin).catch(() => setAdmin(null)).finally(() => setCheckingAuth(false));
  }, [isOpen]);

  useEffect(() => {
    if (admin) adminFetchBookings().then(setBookings).catch(() => {});
  }, [admin]);

  useEffect(() => {
    if (pricingVillaId && admin) adminFetchDatePrices(pricingVillaId).then(setDatePrices).catch(() => setDatePrices([]));
  }, [pricingVillaId, admin]);

  useEffect(() => {
    const up = () => { setIsDragging(false); dragStartDate.current = null; };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    setLoginLoading(true);
    try { setAdmin(await adminLogin(loginEmail, loginPassword)); }
    catch (err: any) { setLoginError(err.message || 'Login failed'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = async () => {
    await adminLogout().catch(() => {});
    setAdmin(null); setLoginEmail(''); setLoginPassword('');
  };

  const notify = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(''), 4000); };

  const handleStatusChange = async (id: string, status: string) => {
    try { const u = await adminUpdateBookingStatus(id, status); setBookings(p => p.map(b => b._id === id ? u : b)); notify(`Status → ${status}`); }
    catch { notify('Failed to update status.'); }
  };

  const handleDeleteBooking = async (id: string, ref: string) => {
    if (!window.confirm(`Delete booking ${ref}? This cannot be undone.`)) return;
    try { await adminDeleteBooking(id); setBookings(p => p.filter(b => b._id !== id)); notify('Booking deleted.'); }
    catch { notify('Failed to delete booking.'); }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try { await adminSyncIcal(); notify('iCal sync completed!'); }
    catch { notify('Sync failed.'); }
    finally { setIsSyncing(false); }
  };

  const handleCreateManualBooking = async () => {
    setMbError('');
    if (!mbVilla || !mbName || !mbCheckIn || !mbCheckOut) { setMbError('Please fill required fields.'); return; }
    setMbLoading(true);
    try {
      const b = await adminCreateBooking({ villaId: mbVilla, checkIn: mbCheckIn, checkOut: mbCheckOut, guests: mbGuests, guestName: mbName, guestEmail: mbEmail, guestPhone: mbPhone, paymentChannel: mbPayment });
      setBookings(p => [b, ...p]); setShowManualBooking(false);
      setMbName(''); setMbEmail(''); setMbPhone(''); setMbCheckIn(''); setMbCheckOut(''); setMbGuests(2);
      notify('Manual booking created!');
    } catch (e: any) { setMbError(e.message || 'Failed'); }
    finally { setMbLoading(false); }
  };

  const openEditVilla = (v: Villa) => {
    setEditingVilla(v);
    setVillaForm({ title: v.title, tagline: v.tagline, description: v.description, pricePerNight: v.pricePerNight, securityDeposit: v.securityDeposit, sleepsCount: v.sleepsCount, bedrooms: v.bedrooms, bathrooms: v.bathrooms, location: v.location, distanceToBeach: v.distanceToBeach, amenities: v.amenities.join(', ') });
  };

  const handleSaveVilla = async () => {
    if (!editingVilla) return;
    try {
      const data: Record<string, unknown> = { ...villaForm, pricePerNight: Number(villaForm.pricePerNight), securityDeposit: Number(villaForm.securityDeposit), sleepsCount: Number(villaForm.sleepsCount), bedrooms: Number(villaForm.bedrooms), bathrooms: Number(villaForm.bathrooms), amenities: villaForm.amenities.split(',').map((a: string) => a.trim()).filter(Boolean) };
      const u = await adminUpdateVilla(editingVilla._id, data);
      onVillasChanged(villas.map(v => v._id === editingVilla._id ? { ...v, ...u } : v));
      setEditingVilla(null); notify('Villa updated!');
    } catch { notify('Failed to update villa.'); }
  };

  const handleAddIcalSource = async () => {
    if (!newIcalVilla || !newIcalUrl) return;
    try {
      const u = await adminAddIcalSource(newIcalVilla, newIcalSource, newIcalUrl);
      onVillasChanged(villas.map(v => v._id === newIcalVilla ? { ...v, icalImportUrls: u.icalImportUrls } : v));
      setNewIcalUrl(''); notify('iCal source added!');
    } catch { notify('Failed to add iCal source.'); }
  };

  const handleDeleteIcalSource = async (villaId: string, idx: number) => {
    try {
      const u = await adminDeleteIcalSource(villaId, idx);
      onVillasChanged(villas.map(v => v._id === villaId ? { ...v, icalImportUrls: u.icalImportUrls } : v));
      notify('iCal source removed.');
    } catch { notify('Failed to remove iCal source.'); }
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0 || !managingPhotosVilla) return;
    setUploadingImages(true);
    try {
      const u = await adminUploadVillaImages(managingPhotosVilla._id, Array.from(files));
      onVillasChanged(villas.map(v => v._id === managingPhotosVilla._id ? { ...v, images: u.images } : v));
      setManagingPhotosVilla(prev => prev ? { ...prev, images: u.images } : null);
      notify(`${files.length} image(s) uploaded!`);
    } catch (e: any) { notify(e.message || 'Upload failed.'); }
    finally { setUploadingImages(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleDeleteImage = async (index: number) => {
    if (!managingPhotosVilla) return;
    try {
      const u = await adminDeleteVillaImage(managingPhotosVilla._id, index);
      onVillasChanged(villas.map(v => v._id === managingPhotosVilla._id ? { ...v, images: u.images } : v));
      setManagingPhotosVilla(prev => prev ? { ...prev, images: u.images } : null);
      notify('Image removed.');
    } catch { notify('Failed to delete image.'); }
  };

  const handleImageDragStart = (index: number) => { dragImageIndex.current = index; };
  const handleImageDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); setDragOverIndex(index); };
  const handleImageDragEnd = async () => {
    if (dragImageIndex.current === null || dragOverIndex === null || !managingPhotosVilla) { setDragOverIndex(null); dragImageIndex.current = null; return; }
    const imgs = [...managingPhotosVilla.images];
    const [moved] = imgs.splice(dragImageIndex.current, 1);
    imgs.splice(dragOverIndex, 0, moved);
    setDragOverIndex(null);
    dragImageIndex.current = null;
    setManagingPhotosVilla(prev => prev ? { ...prev, images: imgs } : null);
    onVillasChanged(villas.map(v => v._id === managingPhotosVilla._id ? { ...v, images: imgs } : v));
    try { await adminReorderVillaImages(managingPhotosVilla._id, imgs); } catch { notify('Failed to save order.'); }
  };

  const handleUpdateAlt = async (index: number, alt: string) => {
    if (!managingPhotosVilla) return;
    const imgs = [...managingPhotosVilla.images];
    imgs[index] = { ...imgs[index], alt };
    setManagingPhotosVilla(prev => prev ? { ...prev, images: imgs } : null);
    onVillasChanged(villas.map(v => v._id === managingPhotosVilla._id ? { ...v, images: imgs } : v));
    try { await adminReorderVillaImages(managingPhotosVilla._id, imgs); } catch {}
  };

  const calendarDays = useMemo(() => {
    const y = pricingMonth.getFullYear(), m = pricingMonth.getMonth();
    const first = new Date(y, m, 1).getDay(), count = new Date(y, m + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= count; d++) days.push(new Date(y, m, d));
    return days;
  }, [pricingMonth]);

  const datePriceMap = useMemo(() => {
    const m = new Map<string, DatePrice>();
    datePrices.forEach(dp => { m.set(new Date(dp.date).toISOString().split('T')[0], dp); });
    return m;
  }, [datePrices]);

  const ds = (d: Date) => d.toISOString().split('T')[0];

  const rangeOf = (a: string, b: string) => {
    const dates: string[] = [];
    let s = new Date(a), e = new Date(b);
    if (s > e) { const t = new Date(s); s = new Date(e); e = t; }
    const c = new Date(s);
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    while (c <= e) { if (c >= today) dates.push(ds(c)); c.setDate(c.getDate() + 1); }
    return dates;
  };

  const handleCalMouseDown = (dateStr: string, isPast: boolean, e: React.MouseEvent) => {
    if (isPast) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      setSelectedDates(p => { const n = new Set(p); n.has(dateStr) ? n.delete(dateStr) : n.add(dateStr); return n; });
      return;
    }
    if (e.shiftKey && selectedDates.size > 0) {
      const last = Array.from(selectedDates).sort().pop()!;
      setSelectedDates(p => { const n = new Set(p); rangeOf(last, dateStr).forEach(d => n.add(d)); return n; });
      return;
    }
    setIsDragging(true);
    dragStartDate.current = dateStr;
    setSelectedDates(new Set([dateStr]));
  };

  const handleCalMouseEnter = (dateStr: string, isPast: boolean) => {
    if (!isDragging || isPast || !dragStartDate.current) return;
    setSelectedDates(new Set(rangeOf(dragStartDate.current, dateStr)));
  };

  const selectCategory = (cat: 'weekdays' | 'weekends' | 'all') => {
    const y = pricingMonth.getFullYear(), m = pricingMonth.getMonth();
    const count = new Date(y, m + 1, 0).getDate();
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const sel = new Set<string>();
    for (let d = 1; d <= count; d++) {
      const dt = new Date(y, m, d);
      if (dt < today) continue;
      const dow = dt.getDay();
      const isFriSat = dow === 5 || dow === 6;
      if (cat === 'weekends' && isFriSat) sel.add(ds(dt));
      else if (cat === 'weekdays' && !isFriSat) sel.add(ds(dt));
      else if (cat === 'all') sel.add(ds(dt));
    }
    setSelectedDates(sel);
  };

  const handleSetBulkPrices = async () => {
    if (!pricingVillaId || selectedDates.size === 0 || !bulkPrice) return;
    setPricingLoading(true);
    try {
      await adminSetDatePrices(pricingVillaId, Array.from(selectedDates), Number(bulkPrice), bulkLabel);
      setDatePrices(await adminFetchDatePrices(pricingVillaId));
      setSelectedDates(new Set()); setBulkPrice('');
      notify(`Price set for ${selectedDates.size} date(s).`);
    } catch { notify('Failed to set prices.'); }
    finally { setPricingLoading(false); }
  };

  const handleClearPrices = async () => {
    if (!pricingVillaId || selectedDates.size === 0) return;
    setPricingLoading(true);
    try {
      await adminDeleteDatePrices(pricingVillaId, Array.from(selectedDates));
      setDatePrices(await adminFetchDatePrices(pricingVillaId));
      setSelectedDates(new Set()); notify('Custom prices cleared.');
    } catch { notify('Failed to clear prices.'); }
    finally { setPricingLoading(false); }
  };

  const pv = villas.find(v => v._id === pricingVillaId);

  const filteredBookings = useMemo(() => bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (villaFilter !== 'all') { const t = typeof b.villa === 'object' ? b.villa.title : ''; if (!t.includes(villaFilter)) return false; }
    if (searchFilter.trim()) { const q = searchFilter.toLowerCase(); const t = typeof b.villa === 'object' ? b.villa.title : ''; if (!b.guestName.toLowerCase().includes(q) && !b.bookingRef.toLowerCase().includes(q) && !t.toLowerCase().includes(q)) return false; }
    return true;
  }), [bookings, statusFilter, villaFilter, searchFilter]);

  const totalRevenue = useMemo(() => bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.totalPrice, 0), [bookings]);
  const activeBookings = useMemo(() => bookings.filter(b => b.status !== 'Cancelled' && b.status !== 'Completed').length, [bookings]);

  const sc = (s: string) => {
    if (s === 'Confirmed') return 'bg-emerald-100 text-emerald-800';
    if (s === 'Checked-In') return 'bg-blue-100 text-blue-800';
    if (s === 'Completed') return 'bg-slate-100 text-slate-600';
    if (s === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-800';
  };

  if (!isOpen) return null;

  if (!admin && !checkingAuth) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#1A2A2B] via-[#0f1818] to-[#103752] flex items-center justify-center p-4">
        <button onClick={onClose} className="absolute top-4 left-4 flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"><ArrowLeft className="w-4 h-4" />Back to website</button>
        <div className="w-full max-w-sm bg-[#FFF9F5] rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up p-6 sm:p-8">
          <div className="text-center space-y-4">
            <img src="/logo-sm.png" alt="PD Holiday Villas" className="w-20 h-20 rounded-2xl shadow-lg object-contain mx-auto" />
            <h2 className="font-['EB_Garamond',serif] text-2xl font-bold">Admin Portal</h2>
            <p className="text-sm text-slate-500">PD Holiday Villas Management Console</p>
          </div>
          <div className="mt-6 space-y-3">
            <div className="bg-white rounded-xl p-3 border border-slate-100"><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email</label><input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full text-sm bg-transparent outline-none" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
            <div className="bg-white rounded-xl p-3 border border-slate-100"><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Password</label><input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full text-sm bg-transparent outline-none" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
            {loginError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200"><AlertCircle className="w-4 h-4 shrink-0" />{loginError}</div>}
            <button onClick={handleLogin} disabled={loginLoading} className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#2EB5B2] to-[#006a68] hover:from-[#006a68] hover:to-[#004a48] text-white font-bold transition-all disabled:opacity-50">{loginLoading ? 'Signing in...' : 'Sign In'}</button>
          </div>
        </div>
      </div>
    );
  }

  if (checkingAuth) return <div className="fixed inset-0 z-50 bg-[#f0f4f5] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-transparent border-t-[#2EB5B2] animate-spin" /></div>;

  return (
    <>
    <div className="fixed inset-0 z-50 bg-[#f0f4f5] flex flex-col overflow-hidden">
      <header className="bg-gradient-to-r from-[#1A2A2B] to-[#0f1818] px-4 sm:px-6 py-3 text-white shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Back to website"><ArrowLeft className="w-5 h-5" /></button>
            <img src="/logo-sm.png" alt="PD Holiday Villas" className="w-8 h-8 rounded-lg object-contain" />
            <div className="hidden sm:block"><h1 className="font-['EB_Garamond',serif] text-lg font-bold leading-tight">Admin Center</h1><p className="text-[11px] text-white/50">{admin?.name} &mdash; {admin?.email}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSync} disabled={isSyncing} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 border border-white/20 disabled:opacity-50 transition-colors"><RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync OTAs'}</span></button>
            <button onClick={() => setShowManualBooking(true)} className="px-3 py-1.5 rounded-full bg-[#FF7E5F] hover:bg-[#a53b22] text-xs font-bold flex items-center gap-1.5 transition-colors"><Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">New Booking</span></button>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Logout"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 shrink-0">
        <div className="max-w-[1400px] mx-auto flex gap-1 overflow-x-auto no-scrollbar py-1">
          {(['overview', 'villas', 'pricing', 'reservations', 'channels'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-[#FF7E5F] text-[#1A2A2B]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
              {tab === 'overview' ? 'Overview' : tab === 'villas' ? 'Villas' : tab === 'pricing' ? 'Pricing Calendar' : tab === 'reservations' ? 'Reservations' : 'Channel Manager'}
            </button>
          ))}
        </div>
      </div>

      {notification && <div className="mx-4 sm:mx-6 mt-3 max-w-[1400px] self-center w-full flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-200 shrink-0"><CheckCircle className="w-4 h-4 shrink-0" />{notification}<button onClick={() => setNotification('')} className="ml-auto"><X className="w-4 h-4" /></button></div>}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{ l: 'Gross Bookings', v: `RM${totalRevenue.toLocaleString()}` }, { l: 'Fee Savings (18%)', v: `RM${Math.round(totalRevenue * 0.18).toLocaleString()}`, c: 'text-emerald-600' }, { l: 'Active Bookings', v: String(activeBookings) }, { l: 'Total Villas', v: String(villas.length) }].map(({ l, v, c }) => (
                  <div key={l} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm"><p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{l}</p><p className={`font-['EB_Garamond',serif] text-2xl sm:text-3xl font-bold mt-1 ${c || ''}`}>{v}</p></div>
                ))}
              </div>
              <div>
                <h3 className="font-['EB_Garamond',serif] text-xl font-bold mb-4">Recent Reservations</h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {bookings.slice(0, 8).map((b, i) => { const vt = typeof b.villa === 'object' ? b.villa.title : ''; return (
                    <div key={b._id} className={`p-4 flex items-center gap-4 ${i > 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50/50 transition-colors`}>
                      <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-mono text-sm font-bold text-[#FF7E5F]">{b.bookingRef}</span><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${sc(b.status)}`}>{b.status}</span></div><p className="text-sm font-medium truncate mt-0.5">{b.guestName} &mdash; {vt}</p></div>
                      <span className="font-bold text-sm shrink-0">RM{b.totalPrice.toLocaleString()}</span>
                    </div>); })}
                  {bookings.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">No bookings yet.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'villas' && (
            <div className="space-y-4">
              <h3 className="font-['EB_Garamond',serif] text-xl font-bold">Manage Villas</h3>
              {editingVilla ? (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-5">
                  <div className="flex items-center justify-between"><h4 className="font-['EB_Garamond',serif] text-xl font-bold">Edit: {editingVilla.title}</h4><button onClick={() => setEditingVilla(null)} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[{ k: 'title', l: 'Title', t: 'text' }, { k: 'tagline', l: 'Tagline', t: 'text' }, { k: 'location', l: 'Location', t: 'text' }, { k: 'distanceToBeach', l: 'Distance to Beach', t: 'text' }, { k: 'pricePerNight', l: 'Price/Night (RM)', t: 'number' }, { k: 'securityDeposit', l: 'Security Deposit (RM)', t: 'number' }, { k: 'sleepsCount', l: 'Sleeps', t: 'number' }, { k: 'bedrooms', l: 'Bedrooms', t: 'number' }, { k: 'bathrooms', l: 'Bathrooms', t: 'number' }].map(({ k, l, t }) => (
                      <div key={k}><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{l}</label><input type={t} value={villaForm[k] ?? ''} onChange={e => setVillaForm((p: Record<string, any>) => ({ ...p, [k]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2EB5B2] focus:ring-1 focus:ring-[#2EB5B2]/20 outline-none transition-colors" /></div>
                    ))}
                  </div>
                  <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label><textarea value={villaForm.description ?? ''} onChange={e => setVillaForm((p: Record<string, any>) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2EB5B2] outline-none transition-colors" /></div>
                  <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Amenities (comma separated)</label><input type="text" value={villaForm.amenities ?? ''} onChange={e => setVillaForm((p: Record<string, any>) => ({ ...p, amenities: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2EB5B2] outline-none transition-colors" /></div>
                  <div className="flex gap-3">
                    <button onClick={handleSaveVilla} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 transition-colors"><Save className="w-4 h-4" />Save</button>
                    <button onClick={() => setEditingVilla(null)} className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {villas.map(v => (
                    <div key={v._id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                      <div className="relative w-28 h-24 shrink-0">
                        <img src={v.images[0]?.url} alt={v.images[0]?.alt || v.title} referrerPolicy="no-referrer" className="w-full h-full rounded-xl object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">{v.images.length} photos</span>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-[#ffdad2]/50 text-[#a53b22] text-[9px] font-bold">{v.badgeCategory}</span><div className="flex items-center gap-0.5 text-xs ml-auto"><Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />{v.rating}</div></div>
                        <h4 className="font-['EB_Garamond',serif] text-lg font-bold truncate">{v.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{v.location}</p>
                        <div className="flex items-center justify-between pt-1 gap-2">
                          <span className="font-bold text-sm">RM{v.pricePerNight}<span className="text-xs text-slate-400 font-normal">/night</span></span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setManagingPhotosVilla(v)} className="px-3 py-1.5 rounded-lg bg-[#FF7E5F] hover:bg-[#a53b22] text-white text-xs font-bold flex items-center gap-1 transition-colors"><Image className="w-3 h-3" />Photos</button>
                            <button onClick={() => openEditVilla(v)} className="px-3 py-1.5 rounded-lg bg-[#2EB5B2] hover:bg-[#006a68] text-white text-xs font-bold flex items-center gap-1 transition-colors"><Edit3 className="w-3 h-3" />Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <h3 className="font-['EB_Garamond',serif] text-xl font-bold">Pricing Calendar</h3>
                <select value={pricingVillaId} onChange={e => { setPricingVillaId(e.target.value); setSelectedDates(new Set()); }} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#2EB5B2] outline-none"><option value="">Select Villa</option>{villas.map(v => <option key={v._id} value={v._id}>{v.title}</option>)}</select>
              </div>
              {pricingVillaId && pv && (<>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Select:</span>
                    <button onClick={() => selectCategory('weekends')} className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-sm font-bold text-amber-800 transition-colors">Weekends (Fri + Sat)</button>
                    <button onClick={() => selectCategory('weekdays')} className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-sm font-bold text-blue-800 transition-colors">Weekdays (Sun–Thu)</button>
                    <button onClick={() => selectCategory('all')} className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-600 transition-colors">All Days</button>
                    <button onClick={() => setSelectedDates(new Set())} className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-400 transition-colors">Clear</button>
                    <span className="text-[11px] text-slate-400 ml-auto hidden sm:inline">Drag to select &bull; Ctrl+click toggle &bull; Shift+click range</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm select-none">
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={() => setPricingMonth(new Date(pricingMonth.getFullYear(), pricingMonth.getMonth() - 1, 1))} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <h4 className="font-['EB_Garamond',serif] text-xl font-bold">{pricingMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                    <button onClick={() => setPricingMonth(new Date(pricingMonth.getFullYear(), pricingMonth.getMonth() + 1, 1))} className="p-2.5 rounded-full hover:bg-slate-100 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className={`text-center text-[10px] font-bold uppercase py-1.5 ${d === 'Fri' || d === 'Sat' ? 'text-amber-500' : 'text-slate-400'}`}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((day, i) => {
                      if (!day) return <div key={`e${i}`} />;
                      const dateStr = ds(day); const dp = datePriceMap.get(dateStr); const sel = selectedDates.has(dateStr);
                      const isFriSat = day.getDay() === 5 || day.getDay() === 6;
                      const past = day < new Date(new Date().setHours(0, 0, 0, 0));
                      return (
                        <div key={dateStr} onMouseDown={e => handleCalMouseDown(dateStr, past, e)} onMouseEnter={() => handleCalMouseEnter(dateStr, past)}
                          className={`relative p-1.5 sm:p-2 rounded-xl text-center transition-all border-2 min-h-[56px] sm:min-h-[68px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${past ? 'opacity-30 cursor-not-allowed border-transparent' : sel ? 'border-[#FF7E5F] bg-[#FF7E5F]/10 ring-1 ring-[#FF7E5F]/30' : dp ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300' : isFriSat ? 'border-amber-100 bg-amber-50/50 hover:border-amber-200' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                          <span className={`text-xs sm:text-sm font-bold ${sel ? 'text-[#FF7E5F]' : isFriSat && !dp ? 'text-amber-700' : ''}`}>{day.getDate()}</span>
                          <span className={`text-[9px] sm:text-[10px] font-bold ${dp ? 'text-emerald-700' : 'text-slate-400'}`}>RM{dp ? dp.price : pv.pricePerNight}</span>
                          {dp && <span className="text-[7px] font-bold text-emerald-500 uppercase">{dp.label}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm">Set Prices ({selectedDates.size} selected)</h4>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Price (RM)</label><input type="number" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} placeholder={String(pv.pricePerNight)} className="w-32 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#2EB5B2] outline-none" /></div>
                    <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Label</label>
                      <select value={bulkLabel} onChange={e => setBulkLabel(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#2EB5B2] outline-none">
                        <option value="weekday">Weekday</option><option value="weekend">Weekend</option><option value="holiday">Holiday</option><option value="peak">Peak Season</option><option value="promo">Promo</option><option value="custom">Custom</option>
                      </select>
                    </div>
                    <button onClick={handleSetBulkPrices} disabled={pricingLoading || selectedDates.size === 0 || !bulkPrice} className="px-5 py-2.5 rounded-xl bg-[#FF7E5F] hover:bg-[#a53b22] text-white font-bold text-sm disabled:opacity-50 transition-colors">{pricingLoading ? 'Saving...' : 'Apply Price'}</button>
                    <button onClick={handleClearPrices} disabled={pricingLoading || selectedDates.size === 0} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-sm disabled:opacity-50 transition-colors">Reset to Default</button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 font-medium">Default: RM{pv.pricePerNight}/night</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium">Green = custom price</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 font-medium">Yellow = weekend (Fri/Sat)</span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#FF7E5F]/10 border border-[#FF7E5F]/20 text-[#FF7E5F] font-medium">Orange = selected</span>
                  </div>
                </div>
              </>)}
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-white rounded-xl p-2.5 border border-slate-200 flex items-center gap-2 shadow-sm focus-within:border-[#2EB5B2] transition-colors"><Search className="w-4 h-4 text-slate-400" /><input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search guest, booking ID..." className="flex-1 text-sm bg-transparent outline-none" /></div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white shadow-sm"><option value="all">All Statuses</option>{['Confirmed', 'Checked-In', 'Pending', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}</select>
                <select value={villaFilter} onChange={e => setVillaFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white shadow-sm"><option value="all">All Villas</option>{villas.map(v => <option key={v._id} value={v.title}>{v.title}</option>)}</select>
              </div>
              {filteredBookings.length === 0 ? <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center text-slate-400 text-sm">No bookings match your filters.</div> : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {filteredBookings.map((b, i) => { const vt = typeof b.villa === 'object' ? b.villa.title : ''; const vi = typeof b.villa === 'object' ? b.villa.images?.[0]?.url : ''; return (
                    <div key={b._id} className={`p-4 flex flex-col sm:flex-row gap-4 hover:bg-slate-50/50 transition-colors ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                      {vi && <img src={vi} alt={`${vt} thumbnail`} referrerPolicy="no-referrer" className="w-full sm:w-24 h-20 sm:h-20 rounded-xl object-cover shrink-0" />}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2"><span className="font-mono font-bold text-[#FF7E5F]">{b.bookingRef}</span><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${sc(b.status)}`}>{b.status}</span>{b.paymentChannel && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold text-slate-600">{b.paymentChannel}</span>}<span className="px-2 py-0.5 rounded-full bg-[#def1f4] text-[9px] font-bold text-[#006a68]">{b.source}</span></div>
                        <h4 className="font-bold text-sm">{b.guestName}</h4>
                        <p className="text-xs text-slate-500">{vt}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}</span><span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.guests} guests</span>{b.guestPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.guestPhone}</span>}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-bold text-lg">RM{b.totalPrice.toLocaleString()}</span>
                        <select value={b.status} onChange={e => handleStatusChange(b._id, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white">{['Pending', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}</select>
                        <button onClick={() => handleDeleteBooking(b._id, b.bookingRef)} className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 border border-red-200 transition-colors"><Trash2 className="w-3 h-3" />Delete</button>
                      </div>
                    </div>); })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-[#1A2A2B] to-[#0f1818] rounded-2xl p-6 text-white space-y-3">
                <h3 className="font-['EB_Garamond',serif] text-xl font-bold">Channel Manager & iCal Sync</h3>
                <p className="text-sm text-white/70">Manage iCal feed URLs for each villa to sync availability with external platforms.</p>
                <button onClick={handleSync} disabled={isSyncing} className="px-5 py-2.5 rounded-full bg-[#2EB5B2] hover:bg-[#006a68] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"><RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />{isSyncing ? 'Syncing...' : 'Force Re-Sync All'}</button>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-bold text-sm">Add iCal Feed URL</h4>
                <div className="flex flex-wrap gap-3 items-end">
                  <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Villa</label><select value={newIcalVilla} onChange={e => setNewIcalVilla(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"><option value="">Select Villa</option>{villas.map(v => <option key={v._id} value={v._id}>{v.title}</option>)}</select></div>
                  <div><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Platform</label><select value={newIcalSource} onChange={e => setNewIcalSource(e.target.value as any)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"><option value="airbnb">Airbnb</option><option value="booking.com">Booking.com</option><option value="agoda">Agoda</option><option value="other">Other</option></select></div>
                  <div className="flex-1 min-w-[200px]"><label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">iCal URL</label><input type="url" value={newIcalUrl} onChange={e => setNewIcalUrl(e.target.value)} placeholder="https://www.airbnb.com/calendar/ical/..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" /></div>
                  <button onClick={handleAddIcalSource} disabled={!newIcalVilla || !newIcalUrl} className="px-5 py-2.5 rounded-xl bg-[#2EB5B2] hover:bg-[#006a68] text-white font-bold text-sm disabled:opacity-50 flex items-center gap-1.5 transition-colors"><Plus className="w-4 h-4" />Add</button>
                </div>
              </div>
              {villas.map(v => (
                <div key={v._id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-3"><img src={v.images[0]?.url} alt={`${v.title} thumbnail`} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover shrink-0" /><h4 className="font-bold text-sm">{v.title}</h4></div>
                  {v.icalImportUrls && v.icalImportUrls.length > 0 ? (
                    <div className="space-y-2">{v.icalImportUrls.map((ic, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100"><Link className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase shrink-0">{ic.source}</span><span className="text-xs text-slate-500 truncate flex-1">{ic.url}</span><button onClick={() => handleDeleteIcalSource(v._id, idx)} className="p-1.5 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 shrink-0 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    ))}</div>
                  ) : <p className="text-xs text-slate-400">No iCal feeds configured.</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-[10px] text-slate-400 shrink-0"><span>PD Holiday Villas Sdn. Bhd. &mdash; Internal Operations Console</span><span className="hidden sm:inline">Direct Booking 0% Fee Engine: Active</span></div>
    </div>

    {managingPhotosVilla && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-modal-slide-up flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-['EB_Garamond',serif] text-xl font-bold">Photos: {managingPhotosVilla.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{managingPhotosVilla.images.length} photo(s) &bull; Drag to reorder &bull; First photo is the cover</p>
            </div>
            <button onClick={() => setManagingPhotosVilla(null)} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#FF7E5F] hover:bg-[#FF7E5F]/5 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-[#FF7E5F]', 'bg-[#FF7E5F]/5'); }}
              onDragLeave={e => { e.currentTarget.classList.remove('border-[#FF7E5F]', 'bg-[#FF7E5F]/5'); }}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-[#FF7E5F]', 'bg-[#FF7E5F]/5'); handleUploadImages(e.dataTransfer.files); }}
            >
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={e => handleUploadImages(e.target.files)} />
              {uploadingImages ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-3 border-transparent border-t-[#FF7E5F] animate-spin" />
                  <p className="text-sm font-bold text-slate-600">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">Drop images here or click to upload</p>
                  <p className="text-[11px] text-slate-400">JPG, PNG, WebP, AVIF &bull; Max 10MB each &bull; Up to 20 at once</p>
                </div>
              )}
            </div>

            {managingPhotosVilla.images.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No photos yet. Upload your first villa photo above.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {managingPhotosVilla.images.map((img, idx) => (
                  <div
                    key={`${img.url}-${idx}`}
                    draggable
                    onDragStart={() => handleImageDragStart(idx)}
                    onDragOver={e => handleImageDragOver(e, idx)}
                    onDragEnd={handleImageDragEnd}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all ${dragOverIndex === idx ? 'border-[#FF7E5F] scale-[1.02]' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className="aspect-[4/3] relative">
                      <img src={img.url} alt={img.alt} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {idx === 0 && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FF7E5F] text-white text-[9px] font-bold uppercase shadow-sm">Cover</span>}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-500 cursor-grab active:cursor-grabbing shadow-sm"><GripVertical className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteImage(idx)} className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">#{idx + 1}</span>
                    </div>
                    <div className="p-2 bg-white">
                      <input
                        type="text"
                        value={img.alt}
                        onChange={e => handleUpdateAlt(idx, e.target.value)}
                        placeholder="Alt text..."
                        className="w-full text-[11px] text-slate-500 bg-transparent outline-none border-b border-transparent focus:border-[#2EB5B2] transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
            <span className="text-[11px] text-slate-400">{managingPhotosVilla.images.length} photo(s)</span>
            <button onClick={() => setManagingPhotosVilla(null)} className="px-5 py-2 rounded-xl bg-[#2EB5B2] hover:bg-[#006a68] text-white text-sm font-bold transition-colors">Done</button>
          </div>
        </div>
      </div>
    )}

    {showManualBooking && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-modal-slide-up">
          <div className="flex items-center justify-between"><h3 className="font-['EB_Garamond',serif] text-lg font-bold">New Booking</h3><button onClick={() => setShowManualBooking(false)} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button></div>
          <select value={mbVilla} onChange={e => setMbVilla(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"><option value="">Select Villa *</option>{villas.map(v => <option key={v._id} value={v._id}>{v.title}</option>)}</select>
          <input type="text" value={mbName} onChange={e => setMbName(e.target.value)} placeholder="Guest Name *" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input type="email" value={mbEmail} onChange={e => setMbEmail(e.target.value)} placeholder="Guest Email" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input type="tel" value={mbPhone} onChange={e => setMbPhone(e.target.value)} placeholder="Guest Phone" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-400 mb-1">Check-in *</label><input type="date" value={mbCheckIn} onChange={e => setMbCheckIn(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" /></div><div><label className="block text-xs font-bold text-slate-400 mb-1">Check-out *</label><input type="date" value={mbCheckOut} onChange={e => setMbCheckOut(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-400 mb-1">Guests</label><input type="number" value={mbGuests} onChange={e => setMbGuests(Number(e.target.value))} min={1} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" /></div><div><label className="block text-xs font-bold text-slate-400 mb-1">Payment</label><select value={mbPayment} onChange={e => setMbPayment(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm">{['Manual Bank Transfer', 'Direct FPX', 'Direct Card', 'Airbnb Sync', 'Booking.com Sync', 'Agoda Sync'].map(p => <option key={p} value={p}>{p}</option>)}</select></div></div>
          {mbError && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200"><AlertCircle className="w-4 h-4 shrink-0" />{mbError}</div>}
          <button onClick={handleCreateManualBooking} disabled={mbLoading} className="w-full py-3 rounded-xl bg-[#FF7E5F] hover:bg-[#a53b22] text-white font-bold transition-all disabled:opacity-50">{mbLoading ? 'Creating...' : 'Confirm & Block Dates'}</button>
        </div>
      </div>
    )}
    </>
  );
}

export default AdminDashboardModal;
