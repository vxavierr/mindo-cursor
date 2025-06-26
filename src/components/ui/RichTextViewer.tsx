
import React from 'react';

interface RichTextViewerProps {
  content: string;
  className?: string;
}

const RichTextViewer = ({ content, className = "" }: RichTextViewerProps) => {
  return (
    <div 
      className={`prose prose-sm dark:prose-invert max-w-none
        prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit 
        prose-em:text-inherit prose-code:text-inherit prose-blockquote:text-inherit
        prose-ul:text-inherit prose-ol:text-inherit prose-li:text-inherit
        prose-a:text-inherit prose-a:underline hover:prose-a:no-underline
        ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextViewer;
