import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { CodeBlockComponent } from './code-block-component'
import { ReactNodeViewRenderer, Editor } from '@tiptap/react'
import { Selection, TextSelection } from '@tiptap/pm/state'
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

// 移动到代码块上方节点的辅助函数
const moveToNodeAbove = (editor: Editor) => {
  const { state } = editor
  const { selection, doc } = state
  const { $from } = selection

  // 检查是否在代码块中
  if ($from.parent.type.name !== 'codeBlock') {
    return false
  }

  // 查找代码块之前的节点位置
  const nodePos = $from.before($from.depth)

  // 如果有上一个节点，创建新选区并应用
  if (nodePos > 0) {
    // 查找上一个节点
    const resolvedPos = doc.resolve(nodePos - 1)
    const newSelection = Selection.findFrom(resolvedPos, -1, true)

    if (newSelection) {
      editor.view.dispatch(
        editor.state.tr.setSelection(newSelection).scrollIntoView()
      )
      return true
    }
  }

  return false
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
      // 处理上方向键，当光标在代码块第一行时，向上移动
      ArrowUp: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        // 检查是否在代码块中
        if ($from.parent.type.name !== 'codeBlock') {
          return false
        }

        // 检查是否在第一行
        if (isFirstLine($from)) {
          // 如果不在第一行的开始位置（不是位置0），移动到开始位置
          if ($from.parentOffset > 0) {
            const startPos = $from.start()
            const newSelection = Selection.near(state.doc.resolve(startPos))
            editor.view.dispatch(
              state.tr.setSelection(newSelection).scrollIntoView()
            )
            return true
          }

          // 如果已经在第一行开始位置，则移动到上一个节点
          return moveToNodeAbove(editor)
        }

        return false
      },
      ArrowLeft: ({ editor }) => {
        const { selection } = editor.state
        const { $from } = selection

        // 检查是否在代码块中
        if ($from.parent.type.name !== 'codeBlock') {
          return false
        }

        // 检查是否在第一行第0个位置
        if (isFirstLine($from) && $from.parentOffset === 0) {
          return moveToNodeAbove(editor)
        }

        return false
      },
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