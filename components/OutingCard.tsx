import React, { useState } from 'react';
import { MapPin, LayoutGrid, Clock, Flag, User, Navigation, Users } from 'lucide-react';
import { Outing } from '../types';
import SuggestionsModal from './SuggestionsModal';

interface OutingCardProps {
  outing: Outing;
  isAdmin: boolean;
  themeColor: string;
  onUpdate: (id: string, field: keyof Outing, value: string) => void;
  onDelete: (id: string) => void;
  onCommitChange: (id: string, field: keyof Outing, value: string) => void;
}

const DAYS_OF_WEEK = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

const OutingCard: React.FC<OutingCardProps> = ({ 
  outing, 
  isAdmin, 
  themeColor, 
  onUpdate, 
  onDelete,
  onCommitChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialValue, setInitialValue] = useState<string>('');

  // Store the value when user starts editing
  const handleFocus = (value: string) => {
    setInitialValue(value);
  };

  // Check if value changed when user stops editing, then trigger log
  const handleBlur = (field: keyof Outing, currentValue: string) => {
    if (currentValue !== initialValue) {
      onCommitChange(outing.id, field, currentValue);
    }
  };

  // Helper for input styling
  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500 mb-1 transition-colors text-gray-900";
  
  // Specific style for header inputs (Day/Time) to ensure visibility
  const headerInputClass = "bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm";

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border-l-[6px] p-4 relative overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col"
      style={{ borderColor: themeColor }}
    >
      
      {/* Suggestions Modal */}
      <SuggestionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isAdmin={isAdmin}
      />

      {/* Header Row: Day, Time, Group, Grid Icon */}
      <div className="flex justify-between items-start mb-3 shrink-0">
        <div className="flex flex-col gap-2 w-full max-w-[85%]">
          
          <div className="flex items-center flex-wrap gap-2">
            {isAdmin ? (
               <>
                  {/* Day Selector */}
                  <select
                    value={outing.day}
                    onFocus={(e) => handleFocus(e.target.value)}
                    onBlur={(e) => handleBlur('day', e.target.value)}
                    onChange={(e) => onUpdate(outing.id, 'day', e.target.value)}
                    className={`${headerInputClass} w-auto`}
                  >
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  {/* Time Input - Fixed visibility */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={outing.time}
                      onFocus={(e) => handleFocus(e.target.value)}
                      onBlur={(e) => handleBlur('time', e.target.value)}
                      onChange={(e) => onUpdate(outing.id, 'time', e.target.value)}
                      className={`${headerInputClass} w-20 text-center`}
                      placeholder="00:00"
                    />
                  </div>
               </>
            ) : (
              // View Mode Badge
              <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <Clock size={14} className="text-gray-300" />
                <span className="uppercase tracking-wide">{outing.day}</span>
                <span className="w-px h-3 bg-gray-600 mx-1"></span>
                <span>{outing.time}</span>
              </div>
            )}
          </div>

          {/* Group Input Field */}
          {(isAdmin || outing.group) && (
            <div className="flex items-center gap-1 mt-1">
              {isAdmin ? (
                <div className="flex items-center gap-2 w-full">
                  <Users size={16} className="text-gray-400 shrink-0" />
                  <input
                    placeholder="Ej: Grupo 1 (Opcional)"
                    value={outing.group || ''}
                    onFocus={(e) => handleFocus(e.target.value)}
                    onBlur={(e) => handleBlur('group', e.target.value)}
                    onChange={(e) => onUpdate(outing.id, 'group', e.target.value)}
                    className={`${inputClass} !mb-0 text-xs`}
                  />
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                   <Users size={12} />
                   {outing.group}
                </div>
              )}
            </div>
          )}

        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-full transition-colors shrink-0"
        >
          <LayoutGrid size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-1 flex-1">
        {/* Meeting Place */}
        {isAdmin ? (
          <input
            placeholder="Lugar de encuentro"
            value={outing.meetingPlace}
            onFocus={(e) => handleFocus(e.target.value)}
            onBlur={(e) => handleBlur('meetingPlace', e.target.value)}
            onChange={(e) => onUpdate(outing.id, 'meetingPlace', e.target.value)}
            className={`${inputClass} font-bold text-gray-900 text-lg`}
          />
        ) : (
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {outing.meetingPlace}
          </h3>
        )}

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-500 text-sm">
           <div className="mt-1 min-w-[16px]"><MapPin size={16} /></div>
           {isAdmin ? (
             <input
               placeholder="Dirección exacta"
               value={outing.address}
               onFocus={(e) => handleFocus(e.target.value)}
               onBlur={(e) => handleBlur('address', e.target.value)}
               onChange={(e) => onUpdate(outing.id, 'address', e.target.value)}
               className={inputClass}
             />
           ) : (
             <span>{outing.address}</span>
           )}
        </div>

        {/* Territories */}
        <div className="flex items-start gap-2 text-gray-500 text-sm">
           <div className="mt-1 min-w-[16px]"><Flag size={16} /></div>
           {isAdmin ? (
             <input
               placeholder="Territorios"
               value={outing.territories}
               onFocus={(e) => handleFocus(e.target.value)}
               onBlur={(e) => handleBlur('territories', e.target.value)}
               onChange={(e) => onUpdate(outing.id, 'territories', e.target.value)}
               className={inputClass}
             />
           ) : (
             <span>{outing.territories}</span>
           )}
        </div>

        {/* Conductor */}
        <div className="flex items-start gap-2 text-gray-500 text-sm">
           <div className="mt-1 min-w-[16px]"><User size={16} /></div>
           {isAdmin ? (
             <input
               placeholder="Conductor"
               value={outing.conductor}
               onFocus={(e) => handleFocus(e.target.value)}
               onBlur={(e) => handleBlur('conductor', e.target.value)}
               onChange={(e) => onUpdate(outing.id, 'conductor', e.target.value)}
               className={inputClass}
             />
           ) : (
             <span>{outing.conductor}</span>
           )}
        </div>
      </div>

      {/* Map Action Section */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex-1 mr-4">
            {isAdmin ? (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">MAPS:</span>
                    <input 
                        value={outing.mapsLink}
                        onFocus={(e) => handleFocus(e.target.value)}
                        onBlur={(e) => handleBlur('mapsLink', e.target.value)}
                        onChange={(e) => onUpdate(outing.id, 'mapsLink', e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="text-xs text-blue-500 w-full bg-gray-50 p-1 rounded focus:outline-none"
                    />
                </div>
            ) : (
                <span className="text-xs text-gray-400 italic">
                    {outing.mapsLink ? "Ubicación disponible" : "Sin ubicación"}
                </span>
            )}
        </div>
        
        {outing.mapsLink && (
            <a 
                href={outing.mapsLink} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: isAdmin ? '#f97316' : '#0f172a' }}
                title={isAdmin ? "Probar enlace" : "Abrir Mapa"}
            >
                <Navigation size={18} />
            </a>
        )}
      </div>

      {/* Admin Delete Button */}
      {isAdmin && (
        <button 
            onClick={() => onDelete(outing.id)}
            className="mt-4 w-full py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
        >
            Eliminar Salida
        </button>
      )}

    </div>
  );
};

export default OutingCard;