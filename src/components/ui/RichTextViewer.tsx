
interface RichTextViewerProps {
  content: string
  className?: string
}

export default function RichTextViewer({ content, className = '' }: RichTextViewerProps) {
  if (!content || content.trim() === '') {
    return null
  }

  return (
    <div 
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
