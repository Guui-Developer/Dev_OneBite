import MarkdownBox from '@/components/MarkdownBox';
import type { Meme } from '@/api/model/response/learndata';

interface MemeContentProps {
  content: Meme;
}

export default function MemeContent({ content }: MemeContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <img
          src={content.image}
          alt={content.title}
          className="max-w-full h-auto rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <MarkdownBox content={content.description} />
    </div>
  );
}
