import { SelectionRange } from '@tiptap/pm/state';
import { NodeRange as ProseMirrorNodeRange, Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';

// Helper function to get selection ranges for node range selection
export function getSelectionRanges(
  $from: ResolvedPos,
  $to: ResolvedPos,
  depth?: number
): SelectionRange[] {
  const ranges: SelectionRange[] = [];
  const doc = $from.node(0);

  // Determine depth
  const resolvedDepth = typeof depth === 'number' && depth >= 0
    ? depth
    : $from.sameParent($to)
      ? Math.max(0, $from.sharedDepth($to.pos) - 1)
      : $from.sharedDepth($to.pos);

  const nodeRange = new ProseMirrorNodeRange($from, $to, resolvedDepth);
  const startOffset = nodeRange.depth === 0 ? 0 : doc.resolve(nodeRange.start).posAtIndex(0);

  nodeRange.parent.forEach((node: ProseMirrorNode, offset: number) => {
    const from = startOffset + offset;
    const to = from + node.nodeSize;

    if (from < nodeRange.start || from >= nodeRange.end) {
      return;
    }

    const selectionRange = new SelectionRange(doc.resolve(from), doc.resolve(to));
    ranges.push(selectionRange);
  });

  return ranges;
} 