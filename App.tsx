
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Calendar, Pencil, Plus, Save, Settings, History, X, UserCheck, KeyRound, ArrowRight, Users, ChevronLeft, ChevronRight, Image as ImageIcon, Megaphone, Bell, BellOff, Clock as ClockIcon } from 'lucide-react';
import { Outing, HistoryEntry, AppTheme, Announcement } from './types';
import OutingCard from './components/OutingCard';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80', // Open Book / Bible Study vibe
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80', // People talking / Preaching
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80', // Nature / Creation
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', // Diverse Group / Brotherhood
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80', // Morning Light / Hope
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', // Foggy mountains
  'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=800&q=80', // Urban / Public Witnessing vibe
  'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=800&q=80', // Wheat field / Harvest
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80', // Map / Global Work
];

const App: React.FC = () => {
  // --- GLOBAL ACCESS STATE (Congregation Login) ---
  // Initialize from localStorage to persist login across refreshes
  const [hasAccess, setHasAccess] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sami_global_access') === 'true';
    }
    return false;
  });
  
  const [globalUser, setGlobalUser] = useState('');
  const [globalPass, setGlobalPass] = useState('');
  const [globalError, setGlobalError] = useState(false);

  // --- ADMIN STATE (Editor Login) ---
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Theme State
  const [theme, setTheme] = useState<AppTheme>({
    primaryColor: '#22c55e', // Default Green-500
    headerTextColor: '#14532d', // Default Green-900
    headerImageUrl: PRESET_IMAGES[2] // Default to Nature
  });

  const [outings, setOutings] = useState<Outing[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  // Announcement State
  const [announcement, setAnnouncement] = useState<Announcement>({
    message: '',
    isActive: false,
    duration: 15 // seconds
  });

  // Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // Admin Login Modal
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false); // Admin Announcement Modal

  // Admin Login Inputs
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Helper to log history
  const logHistory = (action: HistoryEntry['action'], description: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action,
      description
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  // Initial Data
  useEffect(() => {
    setOutings([
      {
        id: '1',
        day: 'Sábado',
        time: '9:30am',
        group: 'Grupo 1',
        meetingPlace: 'Av. 157 Av. 147 y Calle 156',
        address: 'Av. 147 Calle 140',
        territories: 'Territorios: 75 - 80',
        conductor: 'Conductor: Santiago Fijor',
        mapsLink: 'https://maps.google.com'
      },
      {
        id: '2',
        day: 'Sábado',
        time: '4:00pm',
        group: 'Grupo 2',
        meetingPlace: 'Grupo Casa Familia Martinez',
        address: 'Av. Los Girasoles y Gato Onza',
        territories: 'Territorios: 75 - 82',
        conductor: 'Conductor: Santiago Fijor',
        mapsLink: 'https://maps.google.com'
      },
      {
        id: '3',
        day: 'Domingo',
        time: '08:30',
        group: '',
        meetingPlace: 'Calle 196 & Calle 151',
        address: 'Grupo 4',
        territories: 'Territorios: 45, 46',
        conductor: 'Conductor: Balbuena Lucas',
        mapsLink: ''
      }
    ]);
  }, []);

  // Announcement Auto-Dismiss Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (announcement.isActive && announcement.duration > 0) {
      timer = setTimeout(() => {
        setAnnouncement(prev => ({ ...prev, isActive: false }));
      }, announcement.duration * 1000);
    }
    return () => clearTimeout(timer);
  }, [announcement.isActive, announcement.duration]);

  // --- HANDLERS ---

  const handleGlobalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalUser.toLowerCase().trim() === 'congre' && globalPass.trim() === 'congre') {
        setHasAccess(true);
        localStorage.setItem('sami_global_access', 'true'); // Persist Login
        setGlobalError(false);
    } else {
        setGlobalError(true);
    }
  };

  const handleUpdateOuting = (id: string, field: keyof Outing, value: string) => {
    setOutings(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, [field]: value };
      }
      return o;
    }));
  };

  const handleCommitChange = (id: string, field: keyof Outing, value: string) => {
    const outing = outings.find(o => o.id === id);
    if (!outing) return;

    let fieldName = field as string;
    // Map internal field names to user friendly names
    if(field === 'meetingPlace') fieldName = 'Lugar de encuentro';
    if(field === 'time') fieldName = 'Hora';
    if(field === 'day') fieldName = 'Día';
    if(field === 'group') fieldName = 'Grupo';
    if(field === 'address') fieldName = 'Dirección';
    if(field === 'territories') fieldName = 'Territorios';
    if(field === 'conductor') fieldName = 'Conductor';
    if(field === 'mapsLink') fieldName = 'Enlace de Mapa';

    logHistory('update', `Se editó "${fieldName}" en la salida de ${outing.day} ${outing.time}`);
  };

  const handleDeleteOuting = (id: string) => {
    const outing = outings.find(o => o.id === id);
    if (confirm("¿Estás seguro de eliminar esta salida?")) {
        setOutings(prev => prev.filter(o => o.id !== id));
        logHistory('delete', `Se eliminó la salida de: ${outing?.meetingPlace}`);
    }
  };

  const handleAddOuting = () => {
    const newOuting: Outing = {
        id: Date.now().toString(),
        day: 'Lunes',
        time: '00:00',
        group: '',
        meetingPlace: 'Nueva Salida',
        address: 'Dirección...',
        territories: 'Territorios...',
        conductor: 'Conductor...',
        mapsLink: ''
    };
    setOutings([...outings, newOuting]);
    logHistory('create', 'Se agregó una nueva tarjeta de salida');
    
    // Give time for the new item to render then scroll
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleSave = () => {
      alert("¡Cambios guardados correctamente!");
      logHistory('settings', 'Guardado manual completado');
      setIsAdmin(false);
  };

  const handleLockClick = () => {
    if (isAdmin) {
        // Logout
        setIsAdmin(false);
        // Also ensure announcement is inactive on logout? 
        // No, maybe let it persist for viewers.
    } else {
        // Open Login Modal
        setLoginUser('');
        setLoginPass('');
        setLoginError(false);
        setShowLogin(true);
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === 'ItaembeMini' && loginPass === 'Ita2025') {
        setIsAdmin(true);
        setShowLogin(false);
        logHistory('settings', 'Administrador inició sesión');
    } else {
        setLoginError(true);
    }
  };

  const rotateImage = (direction: 'next' | 'prev') => {
    const currentIndex = PRESET_IMAGES.indexOf(theme.headerImageUrl);
    let newIndex = 0;
    
    if (currentIndex === -1) {
        newIndex = 0;
    } else {
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % PRESET_IMAGES.length;
        } else {
            newIndex = (currentIndex - 1 + PRESET_IMAGES.length) % PRESET_IMAGES.length;
        }
    }
    setTheme({ ...theme, headerImageUrl: PRESET_IMAGES[newIndex] });
  };

  // --- RENDER GLOBAL LOGIN IF NOT AUTHENTICATED ---
  if (!hasAccess) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-green-100 p-4 rounded-full mb-4 shadow-inner">
                        <Users size={32} className="text-green-700" />
                    </div>
                    <h1 className="font-bold text-2xl text-gray-800 text-center">Salidas al Ministerio</h1>
                    <p className="text-sm text-gray-400 mt-2 font-medium">Acceso a la Congregación</p>
                </div>

                <form onSubmit={handleGlobalLogin} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Usuario</label>
                        <div className="relative">
                            <UserCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                value={globalUser}
                                onChange={(e) => {
                                    setGlobalUser(e.target.value);
                                    setGlobalError(false);
                                }}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="Usuario"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
                        <div className="relative">
                            <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="password"
                                value={globalPass}
                                onChange={(e) => {
                                    setGlobalPass(e.target.value);
                                    setGlobalError(false);
                                }}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {globalError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-600 text-xs font-bold text-center">
                            Credenciales incorrectas
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        Ingresar <ArrowRight size={18} />
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                     <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Mateo 24:14</span>
                </div>
            </div>
        </div>
    );
  }

  // --- MAIN APP RENDER ---
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center md:py-8 animate-fade-in">
      
      {/* GLOBAL ANNOUNCEMENT POPUP */}
      {announcement.isActive && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm md:max-w-md px-4 animate-bounce-in">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-l-8 border-orange-500 p-4 flex gap-4 items-start relative overflow-hidden">
                <div className="bg-orange-100 p-2 rounded-full shrink-0">
                    <Megaphone size={24} className="text-orange-600" />
                </div>
                <div className="flex-1 pr-6">
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-1">Aviso Importante</h4>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {announcement.message}
                    </p>
                </div>
                <button 
                    onClick={() => setAnnouncement(prev => ({ ...prev, isActive: false }))}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={16} />
                </button>
                {/* Progress Bar for duration */}
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-orange-500 opacity-30 transition-all duration-[linear]"
                    style={{ 
                        width: '100%', 
                        transitionDuration: `${announcement.duration}s`,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left'
                    }}
                />
            </div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-gray-100 min-h-screen md:min-h-0 md:h-auto md:rounded-[2.5rem] relative shadow-2xl flex flex-col md:overflow-hidden">
        
        {/* Header Section */}
        <div 
            className="rounded-b-[2.5rem] p-6 pb-12 shadow-lg relative z-10 transition-colors duration-300 md:px-12"
            style={{ backgroundColor: theme.primaryColor }}
        >
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-start mb-4">
               {/* Date Badge */}
               <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-white/10 text-white shadow-sm">
                  <Calendar size={12} />
                  <span>1 al 14 de Diciembre</span>
               </div>

               {/* Admin Controls */}
               <div className="flex gap-2">
                  {isAdmin && (
                      <>
                          <button 
                              onClick={() => setShowAnnouncementModal(true)}
                              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition shadow-sm relative group"
                              title="Gestionar Avisos"
                          >
                              <Bell size={18} />
                              {announcement.isActive && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-green-600 rounded-full"></span>
                              )}
                          </button>
                          <button 
                              onClick={() => setShowHistory(true)}
                              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition shadow-sm"
                              title="Historial de cambios"
                          >
                              <History size={18} />
                          </button>
                          <button 
                              onClick={() => setShowSettings(true)}
                              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition shadow-sm"
                              title="Personalizar App"
                          >
                              <Settings size={18} />
                          </button>
                      </>
                  )}
                  <button 
                      onClick={handleLockClick}
                      className="text-black/30 hover:text-white/80 transition-colors p-1"
                  >
                      {isAdmin ? <Unlock size={20} className="text-white" /> : <Lock size={20} />}
                  </button>
               </div>
            </div>

            <div className="flex justify-between items-center mt-6">
               <div>
                  <h1 
                      className="text-3xl md:text-5xl font-bold tracking-tight transition-colors"
                      style={{ color: theme.headerTextColor }}
                  >
                      Salidas al <br/> Ministerio
                  </h1>
                  <div className="mt-3 bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-full border border-white/10">
                      <span 
                          className="text-xs font-bold tracking-widest uppercase"
                          style={{ color: theme.headerTextColor }}
                      >
                          Mateo 24:14
                      </span>
                  </div>
               </div>
               
               {/* Hero Image */}
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden shadow-xl bg-gray-200 shrink-0 ml-4 transition-all">
                  <img 
                      src={theme.headerImageUrl} 
                      alt="Scenic View" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_IMAGES[0];
                      }}
                  />
               </div>
            </div>

            {/* Daily Text / Quote Box */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 shadow-sm max-w-2xl">
               <p 
                  className="text-sm md:text-base italic font-medium leading-relaxed transition-colors"
                  style={{ color: theme.headerTextColor }}
               >
                  "Y las buenas noticias del Reino se predicarán en toda la tierra habitada para testimonio a todas las naciones, y entonces vendrá el fin."
               </p>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="px-6 -mt-6 relative z-20 flex justify-center pointer-events-none">
             {isAdmin ? (
                 <div className="bg-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 text-gray-600 pointer-events-auto ring-1 ring-gray-100">
                     <Pencil size={14} /> 
                     <span>MODO EDITOR</span>
                 </div>
             ) : (
                <div className="h-4"></div> 
             )}
        </div>

        {/* Content List - Responsive Grid */}
        <div className="flex-1 px-4 pt-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min max-w-6xl mx-auto w-full">
           {outings.map((outing) => (
             <OutingCard 
                key={outing.id} 
                outing={outing} 
                isAdmin={isAdmin} 
                themeColor={theme.primaryColor}
                onUpdate={handleUpdateOuting}
                onCommitChange={handleCommitChange}
                onDelete={handleDeleteOuting}
             />
           ))}

           {outings.length === 0 && (
               <div className="col-span-full text-center text-gray-400 py-20 flex flex-col items-center">
                   <div className="bg-gray-200 p-4 rounded-full mb-3">
                       <Calendar size={32} className="text-gray-400" />
                   </div>
                   <p>No hay salidas programadas.</p>
                   {isAdmin && <p className="text-xs mt-2">Haz clic en "Agregar" para comenzar.</p>}
               </div>
           )}
        </div>

        {/* Sticky Footer (Admin Mode) - Responsive Fixed Positioning */}
        {isAdmin && (
            <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
                <div className="max-w-6xl mx-auto pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 pb-6 flex gap-3 md:rounded-t-2xl md:mx-4 md:mb-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                        <button 
                            onClick={handleAddOuting}
                            className="flex-1 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 hover:brightness-110"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            <Plus size={20} />
                            Agregar
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                        >
                            <Save size={20} />
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Admin Login Modal (The original one for editing) */}
        {showLogin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <Lock size={24} className="text-gray-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">Acceso Administrador</h3>
                        <p className="text-xs text-gray-400 mt-1">Permisos de Edición</p>
                    </div>

                    <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Usuario</label>
                            <div className="relative">
                                <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text"
                                    value={loginUser}
                                    onChange={(e) => {
                                        setLoginUser(e.target.value);
                                        setLoginError(false);
                                    }}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Usuario"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
                            <div className="relative">
                                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="password"
                                    value={loginPass}
                                    onChange={(e) => {
                                        setLoginPass(e.target.value);
                                        setLoginError(false);
                                    }}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {loginError && (
                            <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-1 rounded">
                                Usuario o contraseña incorrectos
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                type="button" 
                                onClick={() => setShowLogin(false)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition shadow-lg"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                Ingresar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Announcement Management Modal */}
        {showAnnouncementModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Megaphone size={18} className="text-orange-500" /> Avisos Rápidos
                        </h3>
                        <button onClick={() => setShowAnnouncementModal(false)}><X size={20} /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Mensaje del Aviso</label>
                            <textarea 
                                value={announcement.message}
                                onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
                                placeholder="Escribe un anuncio breve..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1 flex justify-between">
                                <span>Duración (Segundos)</span>
                                <span className="text-orange-600">{announcement.duration}s</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <ClockIcon size={16} className="text-gray-400" />
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="60" 
                                    value={announcement.duration}
                                    onChange={(e) => setAnnouncement({...announcement, duration: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">El aviso desaparecerá automáticamente.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <button 
                            onClick={() => {
                                setAnnouncement(prev => ({ ...prev, isActive: false }));
                                setShowAnnouncementModal(false);
                            }}
                            className="bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition"
                        >
                            <BellOff size={16} /> Ocultar
                        </button>
                        <button 
                            onClick={() => {
                                if(announcement.message.trim()) {
                                    setAnnouncement(prev => ({ ...prev, isActive: true }));
                                    setShowAnnouncementModal(false);
                                    logHistory('announcement', 'Se activó un nuevo aviso rápido');
                                }
                            }}
                            className="bg-orange-500 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1 hover:bg-orange-600 transition shadow-lg"
                        >
                            <Megaphone size={16} /> Publicar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-gray-800">Personalizar App</h3>
                        <button onClick={() => setShowSettings(false)}><X size={20} /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Color Principal (Fondo)</label>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    value={theme.primaryColor}
                                    onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                                    className="h-10 w-full cursor-pointer rounded-lg border-0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Color de Texto (Título/Citas)</label>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    value={theme.headerTextColor}
                                    onChange={(e) => setTheme({...theme, headerTextColor: e.target.value})}
                                    className="h-10 w-full cursor-pointer rounded-lg border-0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Imagen de Encabezado</label>
                            
                            {/* Preset Gallery Controls */}
                            <div className="bg-gray-100 p-2 rounded-lg mb-2 flex items-center justify-between">
                                <button onClick={() => rotateImage('prev')} className="p-1 hover:bg-gray-200 rounded-full text-gray-600"><ChevronLeft size={20} /></button>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <ImageIcon size={12} /> Galería
                                </span>
                                <button onClick={() => rotateImage('next')} className="p-1 hover:bg-gray-200 rounded-full text-gray-600"><ChevronRight size={20} /></button>
                            </div>

                            <input 
                                type="text"
                                value={theme.headerImageUrl}
                                onChange={(e) => setTheme({...theme, headerImageUrl: e.target.value})}
                                className="w-full text-xs p-2 bg-gray-50 rounded border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="https://..."
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Usa las flechas para ver imágenes sugeridas o pega tu enlace.</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            setShowSettings(false);
                            logHistory('settings', 'Se actualizó la apariencia de la app');
                        }}
                        className="mt-6 w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm"
                    >
                        Aplicar Cambios
                    </button>
                </div>
            </div>
        )}

        {/* History Modal */}
        {showHistory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-2xl animate-fade-in-up h-[60vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b pb-2 shrink-0">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <History size={18} /> Historial de Cambios
                        </h3>
                        <button onClick={() => setShowHistory(false)}><X size={20} /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm mt-10">No hay cambios recientes.</p>
                        ) : (
                            history.map((entry) => (
                                <div key={entry.id} className="text-sm border-l-2 border-gray-300 pl-3 py-1">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span className={`uppercase font-bold tracking-wider ${
                                            entry.action === 'create' ? 'text-green-600' :
                                            entry.action === 'delete' ? 'text-red-600' :
                                            entry.action === 'announcement' ? 'text-orange-500' :
                                            entry.action === 'settings' ? 'text-blue-600' : 'text-purple-500'
                                        }`}>
                                            {entry.action === 'update' ? 'EDICIÓN' :
                                             entry.action === 'create' ? 'NUEVO' : 
                                             entry.action === 'delete' ? 'BORRADO' : 
                                             entry.action === 'announcement' ? 'AVISO' : 'AJUSTE'}
                                        </span>
                                        <span>{entry.timestamp}</span>
                                    </div>
                                    <p className="text-gray-700 leading-snug">{entry.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="mt-4 pt-2 border-t border-gray-100">
                        <button 
                            onClick={() => setShowHistory(false)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
                        >
                            Cerrar Historial
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default App;
