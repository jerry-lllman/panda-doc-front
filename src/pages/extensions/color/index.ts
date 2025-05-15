import { Color as TipTapColor } from '@tiptap/extension-text-style'
import { Plugin } from '@tiptap/pm/state';

export const Color = TipTapColor.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        props: {
          handleKeyDown: (_, event) => {
            if (event.key === 'Enter') {
              this.editor.commands.unsetAllMarks()
            }
            return false
          }
        }
      })
    ];
  }
})