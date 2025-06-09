import { Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { NodeRangeOptions } from './types';
import {
  getNodeRangeDecorations,
  getSelectionRanges,
  isNodeRangeSelection,
  NodeRangeSelection
} from './helpers';

// Main extension
export const NodeRange = Extension.create<NodeRangeOptions>({
  name: 'nodeRange',

  addOptions() {
    return {
      depth: undefined,
      key: 'Mod' as const
    };
  },

  addKeyboardShortcuts() {
    return {
      'Shift-ArrowUp': ({ editor }) => {
        const { depth } = this.options;
        const { view, state } = editor;
        const { doc, selection, tr } = state;
        const { anchor, head } = selection;

        if (!isNodeRangeSelection(selection)) {
          const newSelection = NodeRangeSelection.create(doc, anchor, head, depth, -1);
          tr.setSelection(newSelection);
          view.dispatch(tr);
          return true;
        }

        const extendedSelection = selection.extendBackwards();
        tr.setSelection(extendedSelection);
        view.dispatch(tr);
        return true;
      },

      'Shift-ArrowDown': ({ editor }) => {
        const { depth } = this.options;
        const { view, state } = editor;
        const { doc, selection, tr } = state;
        const { anchor, head } = selection;

        if (!isNodeRangeSelection(selection)) {
          const newSelection = NodeRangeSelection.create(doc, anchor, head, depth);
          tr.setSelection(newSelection);
          view.dispatch(tr);
          return true;
        }

        const extendedSelection = selection.extendForwards();
        tr.setSelection(extendedSelection);
        view.dispatch(tr);
        return true;
      },

      'Mod-a': ({ editor }) => {
        const { depth } = this.options;
        const { view, state } = editor;
        const { doc, tr } = state;

        const selectAllSelection = NodeRangeSelection.create(doc, 0, doc.content.size, depth);
        tr.setSelection(selectAllSelection);
        view.dispatch(tr);
        return true;
      }
    };
  },

  onSelectionUpdate() {
    const { selection } = this.editor.state;

    if (isNodeRangeSelection(selection)) {
      this.editor.view.dom.classList.add('ProseMirror-noderangeselection');
    }
  },

  addProseMirrorPlugins() {
    let hasNodeRangeSelection = false;
    let isMouseSelecting = false;

    return [
      new Plugin({
        key: new PluginKey('nodeRange'),

        props: {
          attributes: () => {
            return hasNodeRangeSelection
              ? { class: 'ProseMirror-noderangeselection' }
              : { class: '' };
          },

          handleDOMEvents: {
            mousedown: (view, event) => {
              const { key } = this.options;
              const isMac = /Mac/.test(navigator.platform);
              const isShift = !!event.shiftKey;
              const isCtrl = !!event.ctrlKey;
              const isAlt = !!event.altKey;
              const isMeta = !!event.metaKey;

              const isKeyPressed = key == null ||
                (key === 'Shift' && isShift) ||
                (key === 'Control' && isCtrl) ||
                (key === 'Alt' && isAlt) ||
                (key === 'Meta' && isMeta) ||
                (key === 'Mod' && (isMac ? isMeta : isCtrl));

              if (isKeyPressed) {
                isMouseSelecting = true;
              }

              if (!isMouseSelecting) {
                return false;
              }

              document.addEventListener('mouseup', () => {
                isMouseSelecting = false;
                const { state } = view;
                const { doc, selection, tr } = state;
                const { $anchor, $head } = selection;

                if ($anchor.sameParent($head)) {
                  return;
                }

                const nodeRangeSelection = NodeRangeSelection.create(
                  doc,
                  $anchor.pos,
                  $head.pos,
                  this.options.depth
                );

                tr.setSelection(nodeRangeSelection);
                view.dispatch(tr);
              }, { once: true });

              return false;
            }
          },

          decorations: (state) => {
            const { selection } = state;
            const isNodeRange = isNodeRangeSelection(selection);
            hasNodeRangeSelection = false;

            if (!isMouseSelecting) {
              if (isNodeRange) {
                hasNodeRangeSelection = true;
                return getNodeRangeDecorations([...selection.ranges]);
              }
              return null;
            }

            const { $from, $to } = selection;

            if (!isNodeRange && $from.sameParent($to)) {
              return null;
            }

            const ranges = getSelectionRanges($from, $to, this.options.depth);

            if (ranges.length) {
              hasNodeRangeSelection = true;
              return getNodeRangeDecorations(ranges);
            }

            return null;
          }
        }
      })
    ];
  }
});

export default NodeRange; 