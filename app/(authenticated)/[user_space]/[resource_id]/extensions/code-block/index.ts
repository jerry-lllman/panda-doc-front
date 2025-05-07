import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { CodeBlockComponent } from './code-block-component'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin } from '@tiptap/pm/state'
import { Transaction } from '@tiptap/pm/state'
import { EditorState } from '@tiptap/pm/state'

const lowlight = createLowlight(all)

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor.commands.insertContent('  ')
        return true
      }
    }
  },
  addProseMirrorPlugins() {
    const plugins = this.parent?.() || []

    // 添加插件，在创建代码块后自动添加段落
    const addParagraphPlugin = new Plugin({
      appendTransaction: (transactions: readonly Transaction[],
        oldState: EditorState,
        newState: EditorState) => {
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
