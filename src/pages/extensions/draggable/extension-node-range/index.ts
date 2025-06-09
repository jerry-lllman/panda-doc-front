import { Extension } from '@tiptap/react'
import { SelectionRange, Selection, Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet, Decoration } from '@tiptap/pm/view'
import { NodeRange as ProseMirrorNodeRange, Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model'
import type { Mappable, Mapping } from '@tiptap/pm/transform'

// Interfaces
export interface NodeRangeOptions {
  depth: number | undefined
  key: 'Shift' | 'Control' | 'Alt' | 'Meta' | 'Mod' | null | undefined
}

// Helper function to create decorations for node ranges
export function getNodeRangeDecorations(ranges: SelectionRange[]): DecorationSet {
  if (!ranges.length) {
    return DecorationSet.empty
  }

  const decorations: Decoration[] = []
  const doc = ranges[0].$from.node(0)

  ranges.forEach((range) => {
    const from = range.$from.pos
    const nodeAfter = range.$from.nodeAfter

    if (nodeAfter) {
      decorations.push(
        Decoration.node(from, from + nodeAfter.nodeSize, {
          class: 'ProseMirror-selectednoderange'
        })
      )
    }
  })

  return DecorationSet.create(doc, decorations)
}

// Helper function to get selection ranges for node range selection
export function getSelectionRanges(
  $from: ResolvedPos,
  $to: ResolvedPos,
  depth?: number
): SelectionRange[] {
  const ranges: SelectionRange[] = []
  const doc = $from.node(0)

  // Determine depth
  const resolvedDepth = typeof depth === 'number' && depth >= 0
    ? depth
    : $from.sameParent($to)
      ? Math.max(0, $from.sharedDepth($to.pos) - 1)
      : $from.sharedDepth($to.pos)

  const nodeRange = new ProseMirrorNodeRange($from, $to, resolvedDepth)
  const startOffset = nodeRange.depth === 0 ? 0 : doc.resolve(nodeRange.start).posAtIndex(0)

  nodeRange.parent.forEach((node: ProseMirrorNode, offset: number) => {
    const from = startOffset + offset
    const to = from + node.nodeSize

    if (from < nodeRange.start || from >= nodeRange.end) {
      return
    }

    const selectionRange = new SelectionRange(doc.resolve(from), doc.resolve(to))
    ranges.push(selectionRange)
  })

  return ranges
}

// NodeRangeBookmark class
export class NodeRangeBookmark {
  public anchor: number
  public head: number

  constructor(anchor: number, head: number) {
    this.anchor = anchor
    this.head = head
  }

  map(mapping: Mappable): NodeRangeBookmark {
    return new NodeRangeBookmark(mapping.map(this.anchor), mapping.map(this.head))
  }

  resolve(doc: ProseMirrorNode): NodeRangeSelection {
    const $anchor = doc.resolve(this.anchor)
    const $head = doc.resolve(this.head)
    return new NodeRangeSelection($anchor, $head)
  }
}

// NodeRangeSelection class
export class NodeRangeSelection extends Selection {
  public depth: number | undefined

  constructor($anchor: ResolvedPos, $head: ResolvedPos, depth?: number, bias: number = 1) {
    const { doc } = $anchor
    const isSamePos = $anchor === $head
    const isEndOfDoc = $anchor.pos === doc.content.size && $head.pos === doc.content.size

    const resolvedHead = isSamePos && !isEndOfDoc
      ? doc.resolve($head.pos + (bias > 0 ? 1 : -1))
      : $head
    const resolvedAnchor = isSamePos && isEndOfDoc
      ? doc.resolve($anchor.pos - (bias > 0 ? 1 : -1))
      : $anchor

    const ranges = getSelectionRanges(
      resolvedAnchor.min(resolvedHead),
      resolvedAnchor.max(resolvedHead),
      depth
    )

    super(
      resolvedHead.pos >= $anchor.pos ? ranges[0].$from : ranges[ranges.length - 1].$to,
      resolvedHead.pos >= $anchor.pos ? ranges[ranges.length - 1].$to : ranges[0].$from,
      ranges
    )

    this.depth = depth
  }

  get $to(): ResolvedPos {
    return this.ranges[this.ranges.length - 1].$to
  }

  eq(other: Selection): boolean {
    return (
      other instanceof NodeRangeSelection &&
      other.$from.pos === this.$from.pos &&
      other.$to.pos === this.$to.pos
    )
  }

  map(doc: ProseMirrorNode, mapping: Mapping): NodeRangeSelection {
    const $anchor = doc.resolve(mapping.map(this.anchor))
    const $head = doc.resolve(mapping.map(this.head))
    return new NodeRangeSelection($anchor, $head)
  }

  toJSON(): { type: string; anchor: number; head: number } {
    return {
      type: 'nodeRange',
      anchor: this.anchor,
      head: this.head
    }
  }

  get isForwards(): boolean {
    return this.head >= this.anchor
  }

  get isBackwards(): boolean {
    return !this.isForwards
  }

  extendBackwards(): NodeRangeSelection {
    const { doc } = this.$from

    if (this.isForwards && this.ranges.length > 1) {
      const slicedRanges = this.ranges.slice(0, -1)
      const $from = slicedRanges[0].$from
      const $to = slicedRanges[slicedRanges.length - 1].$to
      return new NodeRangeSelection($from, $to, this.depth)
    }

    const firstRange = this.ranges[0]
    const $newAnchor = doc.resolve(Math.max(0, firstRange.$from.pos - 1))
    return new NodeRangeSelection(this.$anchor, $newAnchor, this.depth)
  }

  extendForwards(): NodeRangeSelection {
    const { doc } = this.$from

    if (this.isBackwards && this.ranges.length > 1) {
      const slicedRanges = this.ranges.slice(1)
      const $from = slicedRanges[0].$from
      const $to = slicedRanges[slicedRanges.length - 1].$to
      return new NodeRangeSelection($to, $from, this.depth)
    }

    const lastRange = this.ranges[this.ranges.length - 1]
    const $newHead = doc.resolve(Math.min(doc.content.size, lastRange.$to.pos + 1))
    return new NodeRangeSelection(this.$anchor, $newHead, this.depth)
  }

  static fromJSON(doc: ProseMirrorNode, json: { anchor: number; head: number }): NodeRangeSelection {
    return new NodeRangeSelection(doc.resolve(json.anchor), doc.resolve(json.head))
  }

  static create(
    doc: ProseMirrorNode,
    anchor: number,
    head: number,
    depth?: number,
    bias: number = 1
  ): NodeRangeSelection {
    return new NodeRangeSelection(doc.resolve(anchor), doc.resolve(head), depth, bias)
  }

  getBookmark(): NodeRangeBookmark {
    return new NodeRangeBookmark(this.anchor, this.head)
  }
}

// Helper function to check if selection is NodeRangeSelection
export function isNodeRangeSelection(value: unknown): value is NodeRangeSelection {
  return value instanceof NodeRangeSelection
}

// Mark NodeRangeSelection as non-visible
; (NodeRangeSelection.prototype as typeof NodeRangeSelection.prototype & { visible: boolean }).visible = false

// Main extension
export const NodeRange = Extension.create<NodeRangeOptions>({
  name: 'nodeRange',

  addOptions() {
    return {
      depth: undefined,
      key: 'Mod' as const
    }
  },

  addKeyboardShortcuts() {
    return {
      'Shift-ArrowUp': ({ editor }) => {
        const { depth } = this.options
        const { view, state } = editor
        const { doc, selection, tr } = state
        const { anchor, head } = selection

        if (!isNodeRangeSelection(selection)) {
          const newSelection = NodeRangeSelection.create(doc, anchor, head, depth, -1)
          tr.setSelection(newSelection)
          view.dispatch(tr)
          return true
        }

        const extendedSelection = selection.extendBackwards()
        tr.setSelection(extendedSelection)
        view.dispatch(tr)
        return true
      },

      'Shift-ArrowDown': ({ editor }) => {
        const { depth } = this.options
        const { view, state } = editor
        const { doc, selection, tr } = state
        const { anchor, head } = selection

        if (!isNodeRangeSelection(selection)) {
          const newSelection = NodeRangeSelection.create(doc, anchor, head, depth)
          tr.setSelection(newSelection)
          view.dispatch(tr)
          return true
        }

        const extendedSelection = selection.extendForwards()
        tr.setSelection(extendedSelection)
        view.dispatch(tr)
        return true
      },

      'Mod-a': ({ editor }) => {
        const { depth } = this.options
        const { view, state } = editor
        const { doc, tr } = state

        const selectAllSelection = NodeRangeSelection.create(doc, 0, doc.content.size, depth)
        tr.setSelection(selectAllSelection)
        view.dispatch(tr)
        return true
      }
    }
  },

  onSelectionUpdate() {
    const { selection } = this.editor.state

    if (isNodeRangeSelection(selection)) {
      this.editor.view.dom.classList.add('ProseMirror-noderangeselection')
    }
  },

  addProseMirrorPlugins() {
    let hasNodeRangeSelection = false
    let isMouseSelecting = false

    return [
      new Plugin({
        key: new PluginKey('nodeRange'),

        props: {
          attributes: () => {
            return hasNodeRangeSelection
              ? { class: 'ProseMirror-noderangeselection' }
              : { class: '' }
          },

          handleDOMEvents: {
            mousedown: (view, event) => {
              const { key } = this.options
              const isMac = /Mac/.test(navigator.platform)
              const isShift = !!event.shiftKey
              const isCtrl = !!event.ctrlKey
              const isAlt = !!event.altKey
              const isMeta = !!event.metaKey

              const isKeyPressed = key == null ||
                (key === 'Shift' && isShift) ||
                (key === 'Control' && isCtrl) ||
                (key === 'Alt' && isAlt) ||
                (key === 'Meta' && isMeta) ||
                (key === 'Mod' && (isMac ? isMeta : isCtrl))

              if (isKeyPressed) {
                isMouseSelecting = true
              }

              if (!isMouseSelecting) {
                return false
              }

              document.addEventListener('mouseup', () => {
                isMouseSelecting = false
                const { state } = view
                const { doc, selection, tr } = state
                const { $anchor, $head } = selection

                if ($anchor.sameParent($head)) {
                  return
                }

                const nodeRangeSelection = NodeRangeSelection.create(
                  doc,
                  $anchor.pos,
                  $head.pos,
                  this.options.depth
                )

                tr.setSelection(nodeRangeSelection)
                view.dispatch(tr)
              }, { once: true })

              return false
            }
          },

          decorations: (state) => {
            const { selection } = state
            const isNodeRange = isNodeRangeSelection(selection)
            hasNodeRangeSelection = false

            if (!isMouseSelecting) {
              if (isNodeRange) {
                hasNodeRangeSelection = true
                return getNodeRangeDecorations([...selection.ranges])
              }
              return null
            }

            const { $from, $to } = selection

            if (!isNodeRange && $from.sameParent($to)) {
              return null
            }

            const ranges = getSelectionRanges($from, $to, this.options.depth)

            if (ranges.length) {
              hasNodeRangeSelection = true
              return getNodeRangeDecorations(ranges)
            }

            return null
          }
        }
      })
    ]
  }
})

export default NodeRange
