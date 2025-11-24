import { useNavigate } from 'react-router-dom';
import { Settings, History } from 'lucide-react';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
  showHistory?: boolean;
}

export default function Header({ title, showSettings = false, showHistory = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Icon */}
        <div className="w-10">
          {showSettings && (
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="설정"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>

        {/* Right Icon */}
        <div className="w-10 flex justify-end">
          {showHistory && (
            <button
              onClick={() => navigate('/history')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="히스토리"
            >
              <History size={20} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
