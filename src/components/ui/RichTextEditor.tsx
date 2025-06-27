
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { createLowlight } from 'lowlight'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  ListTodo,
  CodeSquare
} from 'lucide-react'

const lowlight = createLowlight()

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children,
  disabled = false
}: { 
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  disabled?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive 
        ? 'bg-gray-200 dark:bg-gray-600 text-blue-600 dark:text-blue-400' 
        : 'text-gray-600 dark:text-gray-300'
    }`}
  >
    {children}
  </button>
)

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export default function RichTextEditor({ 
  content = '', 
  onChange, 
  placeholder = 'Digite "/" para comandos...',
  className = '',
  minHeight = '200px'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Typography,
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) {
    return (
      <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800" style={{ minHeight }}>
        </div>
      </div>
    )
  }

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 ${className}`}>
      {/* Barra de Ferramentas */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <Heading3 size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          >
            <UnderlineIcon size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
          >
            <Highlighter size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          >
            <Code size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
          >
            <ListTodo size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          >
            <CodeSquare size={18} />
          </MenuButton>
        </div>
      </div>

      {/* Editor */}
      <div className="rich-text-editor">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none"
          style={{ minHeight }}
        />
      </div>
    </div>
  )
}
