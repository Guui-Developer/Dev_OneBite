import CodeBox from '@/components/CodeBox';
import MarkdownBox from '@/components/MarkdownBox';
import type { BugChallenge } from '@/api/model/response/learndata';

interface BugChallengeContentProps {
  content: BugChallenge;
}

export default function BugChallengeContent({ content }: BugChallengeContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">문제 코드</h3>
        <CodeBox code={content.code} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">해답</h3>
        <MarkdownBox content={content.answer} />
      </div>
    </div>
  );
}
