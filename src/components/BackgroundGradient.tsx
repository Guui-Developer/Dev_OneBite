interface BackgroundGradientProps {
  variant?: 'default' | 'green-purple' | 'cyan-purple';
}

export default function BackgroundGradient({ variant = 'default' }: BackgroundGradientProps) {
  if (variant === 'green-purple') {
    return (
      <>
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-green-700/30 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[50%] left-[-10%] w-[200px] h-[200px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none z-0" />
      </>
    );
  }

  if (variant === 'cyan-purple') {
    return (
      <>
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#00D9FF]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      </>
    );
  }

  return (
    <>
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-green-700/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[-10%] w-[200px] h-[200px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none z-0" />
    </>
  );
}
