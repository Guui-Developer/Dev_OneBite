import MarkdownBox from '@/components/MarkdownBox';
import type { Interview } from '@/api/model/response/learndata';

interface InterviewContentProps {
  content: Interview;
}

export default function InterviewContent({ content }: InterviewContentProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#00D9FF]/10 p-4 rounded-lg border border-[#00D9FF]/30">
        <h3 className="text-sm font-semibold text-[#00D9FF] mb-2">질문</h3>
        <p className="text-white text-sm">{content.question}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">답변</h3>
        <MarkdownBox content={content.answer} />
      </div>
      {content.tail && (
        <div className="bg-[#2D2D2D] p-3 rounded-lg border border-[#444]">
          <p className="text-sm text-[#B0B0B0]">{content.tail}</p>
        </div>
      )}
    </div>
  );
}
