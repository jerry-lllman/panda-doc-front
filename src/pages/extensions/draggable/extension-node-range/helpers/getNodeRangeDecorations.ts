import { SelectionRange } from '@tiptap/pm/state';
import { DecorationSet, Decoration } from '@tiptap/pm/view';

// Helper function to create decorations for node ranges
export function getNodeRangeDecorations(ranges: SelectionRange[]): DecorationSet {
  if (!ranges.length) {
    return DecorationSet.empty;
  }

  const decorations: Decoration[] = [];
  const doc = ranges[0].$from.node(0);

  ranges.forEach((range) => {
    const from = range.$from.pos;
    const nodeAfter = range.$from.nodeAfter;

    if (nodeAfter) {
      decorations.push(
        Decoration.node(from, from + nodeAfter.nodeSize, {
          class: 'ProseMirror-selectednoderange'
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
} 