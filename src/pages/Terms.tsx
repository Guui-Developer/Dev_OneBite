import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import BackgroundGradient from '@/components/BackgroundGradient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Terms() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/terms.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text))
      .catch((error) => console.error('Failed to load terms:', error));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] relative" style={{ height: '100dvh' }}>
      <BackgroundGradient variant="cyan-purple" />

      <PageHeader title="이용약관" showBack={true} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 relative z-10 min-h-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#2D2D2D]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-white mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[#B0B0B0] mb-4 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-[#B0B0B0] mb-4 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-[#B0B0B0] mb-4 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-[#B0B0B0] ml-4">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">
                  {children}
                </strong>
              ),
              hr: () => (
                <hr className="border-[#2D2D2D] my-6" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#00D9FF] pl-4 py-2 my-4 bg-[#1A1A1A] rounded-r-lg">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-[#1A1A1A] text-[#00D9FF] px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-[#1A1A1A] p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
