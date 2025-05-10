
import TipTapLink, { LinkOptions } from '@tiptap/extension-link'
import { DOMOutputSpec } from '@tiptap/pm/model'
import { getMarkRange, mergeAttributes } from '@tiptap/react'
import type { HTMLAttributes } from 'react'
import { Plugin, TextSelection } from '@tiptap/pm/state'

// 自定义 Link 扩展
export const Link = TipTapLink.extend<LinkOptions & { renderHTML: (props: { HTMLAttributes: HTMLAttributes<HTMLAnchorElement> }) => DOMOutputSpec }>({
  /*
 * Determines whether typing next to a link automatically becomes part of the link.
 * In this case, we dont want any characters to be included as part of the link.
 */
  inclusive: false,

  /*
   * Match all <a> elements that have an href attribute, except for:
   * - <a> elements with a data-type attribute set to button
   * - <a> elements with an href attribute that contains 'javascript:'
   */
  parseHTML() {
    return [{ tag: 'a[href]:not([data-type="button"]):not([href *= "javascript:" i])' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      HTMLAttributes: {
        class: 'link'
      }
    }
  },

  addProseMirrorPlugins() {
    // const { editor } = this

    return [
      ...(this.parent?.() || []),
      new Plugin({
        props: {
          handleClick(view, pos) {
            /*
            * Marks the entire link when the user clicks on it.
            */

            const { schema, doc, tr } = view.state
            const range = getMarkRange(doc.resolve(pos), schema.marks.link)

            if (!range) {
              return
            }

            const { from, to } = range
            const start = Math.min(from, to)
            const end = Math.max(from, to)

            if (pos < start || pos > end) {
              return
            }

            const $start = doc.resolve(start)
            const $end = doc.resolve(end)
            const transaction = tr.setSelection(new TextSelection($start, $end))

            view.dispatch(transaction)
          }
        }
      })
    ]
  }
}) 