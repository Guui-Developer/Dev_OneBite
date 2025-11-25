import { Icon } from '@/components/icons/Icon';

interface Stats {
  streak: number;
  today: number;
  total: number;
}

interface StatsCardProps {
  stats: Stats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const goalProgress = stats.total > 0 ? Math.min((stats.today / 10) * 100, 100) : 0;

  return (
    <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-purple-500/20 text-white border border-[#00D9FF]/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
          <Icon name="Flame" type="lucide" size={28} className="fill-orange-400 text-orange-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{stats.streak}일 연속!</h2>
          <p className="text-sm text-blue-100">멈추지 말고 계속하세요 🔥</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Calendar" type="lucide" size={16} />
            <span className="text-xs opacity-90">오늘 학습</span>
          </div>
          <span className="text-2xl font-bold">{stats.today}개</span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="TrendingUp" type="lucide" size={16} />
            <span className="text-xs opacity-90">총 학습</span>
          </div>
          <span className="text-2xl font-bold">{stats.total}개</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="opacity-90">일일 목표 (10개)</span>
          <span className="font-bold">{Math.round(goalProgress)}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
