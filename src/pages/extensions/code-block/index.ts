import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { CodeBlockComponent } from './code-block-component'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { ResolvedPos } from '@tiptap/pm/model'
import 'highlight.js/styles/atom-one-dark.css'

const lowlight = createLowlight(all)

// 检查是否在第一行的辅助函数
const isFirstLine = ($from: ResolvedPos) => {
  const parentOffset = $from.parentOffset
  const parentNode = $from.parent
  const parentText = parentNode.textContent

  // 如果当前位置之前没有换行符，说明在第一行
  return !parentText.substring(0, parentOffset).includes('\n')
}


export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      isWrap: {
        default: false,
        parseHTML: element => element.getAttribute('data-is-wrap') === 'true',
        renderHTML: attributes => {
          if (!attributes.isWrap) {
            return {}
          }

          return {
            'data-is-wrap': 'true',
          }
        },
      },
    }
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor.commands.insertContent('  ')
        return true
      },
      // 处理退格键(Backspace)，在代码块中只删除光标前的字符
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        const { $from } = selection

        // 检查是否在代码块中
        if ($from.parent.type.name !== 'codeBlock') {
          return false
        }

        // 检查是否在第一行第0个位置，直接阻止默认行为，保持光标在当前位置
        if (isFirstLine($from) && $from.parentOffset === 0) {
          return true
        }

        return false
      },
      // 处理全选键(Cmd+A/Ctrl+A)，在代码块中只选中代码块内容
      'Mod-a': ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        // 检查是否在代码块中
        if ($from.parent.type.name !== 'codeBlock') {
          return false
        }

        // 获取代码块的开始和结束位置
        const startPos = $from.start()
        const endPos = $from.end()

        // 检查当前选区是否已经完全选中了代码块
        // 如果是，则允许默认全选行为（选中全文）
        if (selection.from === startPos && selection.to === endPos) {
          return false
        }

        // 创建一个从代码块开始到结束的选区
        const $start = state.doc.resolve(startPos)
        const $end = state.doc.resolve(endPos)
        const newSelection = new TextSelection($start, $end)

        // 应用选区
        editor.view.dispatch(
          state.tr.setSelection(newSelection).scrollIntoView()
        )

        return true
      }
    }
  },
}).configure({
  lowlight,
  defaultLanguage: 'javascript',
})