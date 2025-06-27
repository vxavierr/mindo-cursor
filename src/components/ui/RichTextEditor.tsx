
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import { createLowlight } from 'lowlight'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Quote
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { KeyboardShortcuts } from '@/lib/editorKeyboardShortcuts'

const lowlight = createLowlight()

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
  placeholder = 'Digite "/" para comandos ou selecione texto para formatar...',
  className = '',
  minHeight = '100px'
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)

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
      Highlight.configure({
        multicolor: false,
      }),
      Typography,
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
        },
      }),
      KeyboardShortcuts,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2`,
        style: `min-height: ${minHeight}`,
      },
    },
  })

  const setLink = useCallback(() => {
    if (linkUrl === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    children,
    title
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </button>
  )

  if (!editor) {
    return (
      <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 rounded ${className}`} style={{ minHeight }}>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Menu Flutuante - Aparece apenas quando há seleção */}
      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ 
          duration: 100,
          placement: 'top',
        }}
        className="flex items-center gap-0.5 p-1 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50"
      >
        {/* Formatação de Texto */}
        <div className="flex items-center gap-0.5 pr-1 border-r border-gray-700">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Negrito (Ctrl+B)"
          >
            <Bold size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Itálico (Ctrl+I)"
          >
            <Italic size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Sublinhado (Ctrl+U)"
          >
            <UnderlineIcon size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Destacar (Ctrl+Shift+H)"
          >
            <Highlighter size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Código (Ctrl+E)"
          >
            <Code size={16} />
          </MenuButton>
        </div>

        {/* Link */}
        <div className="flex items-center gap-0.5 px-1 border-r border-gray-700">
          {showLinkInput ? (
            <div className="flex items-center gap-1">
              <input
                ref={linkInputRef}
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    setLink()
                  }
                  if (e.key === 'Escape') {
                    setShowLinkInput(false)
                    setLinkUrl('')
                  }
                }}
                placeholder="URL"
                className="px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-white"
                autoFocus
              />
              <button
                onClick={setLink}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          ) : (
            <MenuButton
              onClick={() => {
                const previousUrl = editor.getAttributes('link').href || ''
                setLinkUrl(previousUrl)
                setShowLinkInput(true)
              }}
              isActive={editor.isActive('link')}
              title="Link (Ctrl+K)"
            >
              <LinkIcon size={16} />
            </MenuButton>
          )}
        </div>

        {/* Títulos */}
        <div className="flex items-center gap-0.5 px-1 border-r border-gray-700">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Título 1 (Ctrl+Alt+1)"
          >
            <Heading1 size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Título 2 (Ctrl+Alt+2)"
          >
            <Heading2 size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Título 3 (Ctrl+Alt+3)"
          >
            <Heading3 size={16} />
          </MenuButton>
        </div>

        {/* Alinhamento */}
        <div className="flex items-center gap-0.5 px-1 border-r border-gray-700">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Alinhar à esquerda (Ctrl+Shift+L)"
          >
            <AlignLeft size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Centralizar (Ctrl+Shift+E)"
          >
            <AlignCenter size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Alinhar à direita (Ctrl+Shift+R)"
          >
            <AlignRight size={16} />
          </MenuButton>
        </div>

        {/* Listas e Citação */}
        <div className="flex items-center gap-0.5 pl-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Lista com marcadores (Ctrl+Shift+8)"
          >
            <List size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Lista numerada (Ctrl+Shift+7)"
          >
            <ListOrdered size={16} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Citação (Ctrl+Shift+B)"
          >
            <Quote size={16} />
          </MenuButton>
        </div>
      </BubbleMenu>

      {/* Editor - Sem bordas */}
      <EditorContent 
        editor={editor} 
        className="rich-text-editor"
      />
    </div>
  )
}
