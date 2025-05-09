import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { CodeBlockComponent } from './code-block-component'
import { ReactNodeViewRenderer, Editor } from '@tiptap/react'
import { Plugin } from '@tiptap/pm/state'
import { Transaction } from '@tiptap/pm/state'
import { EditorState } from '@tiptap/pm/state'
import { Selection } from '@tiptap/pm/state'
import { ResolvedPos } from '@tiptap/pm/model'

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
      }
    }
  },
  addProseMirrorPlugins() {
    const plugins = this.parent?.() || []

    // 添加插件，在创建代码块后自动添加段落
    const addParagraphPlugin = new Plugin({
      appendTransaction: (transactions: readonly Transaction[], oldState: EditorState, newState: EditorState) => {
        // 如果没有事务，则不处理
        if (!transactions.length) return null

        // 检查文档中的代码块节点
        let addParagraphAfter = false
        let position = -1

        // 在新状态中查找代码块节点
        newState.doc.descendants((node, pos) => {
          if (node.type.name === 'codeBlock') {
            // 检查这个位置在旧状态是否没有代码块，说明是新创建的
            const oldNode = oldState.doc.nodeAt(pos)
            if (!oldNode || oldNode.type.name !== 'codeBlock') {
              addParagraphAfter = true
              position = pos + node.nodeSize
            }
          }
          return true
        })

        // 如果找到新创建的代码块，在其后添加段落
        if (addParagraphAfter && position > -1) {
          const tr = newState.tr
          const paragraph = newState.schema.nodes.paragraph.create()
          tr.insert(position, paragraph)
          return tr
        }

        return null
      }
    })

    return [...plugins, addParagraphPlugin]
  }
}).configure({
  lowlight,
  defaultLanguage: 'javascript',
})
