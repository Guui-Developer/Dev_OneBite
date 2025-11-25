import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/icons/Icon';

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export default function PageHeader({
  title,
  showBack = false,
  showLogo = false,
  rightAction,
  onBack
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 px-5 py-4 flex items-center justify-between backdrop-blur-sm">
      {showBack ? (
        <button
          onClick={handleBack}
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
        >
          <Icon name="ArrowLeft" type="lucide" size={20} className="text-[#B0B0B0]" />
        </button>
      ) : (
        <div className="w-10" />
      )}

      {showLogo ? (
        <div className="flex items-center gap-2">
          <Icon name="logo" size={40}/>
          <span className="text-lg font-bold text-white">
            개발<span className="text-[#00D9FF]">한입</span>
          </span>
        </div>
      ) : title ? (
        <h1 className="text-xl font-bold text-white">{title}</h1>
      ) : (
        <div />
      )}

      {rightAction || <div className="w-10" />}
    </header>
  );
}
