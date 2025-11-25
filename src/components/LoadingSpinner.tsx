interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9FF]"></div>
      <p className="mt-4 text-[#B0B0B0]">{message}</p>
    </div>
  );
}
