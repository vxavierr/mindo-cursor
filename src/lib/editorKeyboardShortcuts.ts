
import { Extension } from '@tiptap/core'

export const KeyboardShortcuts = Extension.create({
  name: 'keyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // Formatação básica
      'Mod-b': () => this.editor.commands.toggleBold(),
      'Mod-i': () => this.editor.commands.toggleItalic(),
      'Mod-u': () => this.editor.commands.toggleUnderline(),
      'Mod-e': () => this.editor.commands.toggleCode(),
      'Mod-Shift-h': () => this.editor.commands.toggleHighlight(),
      
      // Links
      'Mod-k': () => {
        const url = window.prompt('URL:')
        if (url) {
          this.editor.commands.setLink({ href: url })
        }
      },
      
      // Títulos
      'Mod-Alt-1': () => this.editor.commands.toggleHeading({ level: 1 }),
      'Mod-Alt-2': () => this.editor.commands.toggleHeading({ level: 2 }),
      'Mod-Alt-3': () => this.editor.commands.toggleHeading({ level: 3 }),
      'Mod-Alt-0': () => this.editor.commands.setParagraph(),
      
      // Listas
      'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
      'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),
      'Mod-Shift-9': () => this.editor.commands.toggleTaskList(),
      
      // Citação e código
      'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
      
      // Alinhamento
      'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
      'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
      
      // Outros
      'Mod-z': () => this.editor.commands.undo(),
      'Mod-y': () => this.editor.commands.redo(),
      'Mod-Shift-z': () => this.editor.commands.redo(),
    }
  },
})
