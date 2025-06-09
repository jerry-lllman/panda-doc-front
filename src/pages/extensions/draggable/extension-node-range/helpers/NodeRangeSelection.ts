import { Selection } from '@tiptap/pm/state';
import { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';
import type { Mapping } from '@tiptap/pm/transform';
import { NodeRangeBookmark } from './NodeRangeBookmark';
import { getSelectionRanges } from './getSelectionRanges';

// NodeRangeSelection 类
export class NodeRangeSelection extends Selection {
  public depth: number | undefined;

  constructor($anchor: ResolvedPos, $head: ResolvedPos, depth?: number, bias: number = 1) {
    const { doc } = $anchor;
    const isSamePos = $anchor === $head;
    const isEndOfDoc = $anchor.pos === doc.content.size && $head.pos === doc.content.size;

    const resolvedHead = isSamePos && !isEndOfDoc
      ? doc.resolve($head.pos + (bias > 0 ? 1 : -1))
      : $head;
    const resolvedAnchor = isSamePos && isEndOfDoc
      ? doc.resolve($anchor.pos - (bias > 0 ? 1 : -1))
      : $anchor;

    const ranges = getSelectionRanges(
      resolvedAnchor.min(resolvedHead),
      resolvedAnchor.max(resolvedHead),
      depth
    );

    super(
      resolvedHead.pos >= $anchor.pos ? ranges[0].$from : ranges[ranges.length - 1].$to,
      resolvedHead.pos >= $anchor.pos ? ranges[ranges.length - 1].$to : ranges[0].$from,
      ranges
    );

    this.depth = depth;
  }

  get $to(): ResolvedPos {
    return this.ranges[this.ranges.length - 1].$to;
  }

  eq(other: Selection): boolean {
    return (
      other instanceof NodeRangeSelection &&
      other.$from.pos === this.$from.pos &&
      other.$to.pos === this.$to.pos
    );
  }

  map(doc: ProseMirrorNode, mapping: Mapping): NodeRangeSelection {
    const $anchor = doc.resolve(mapping.map(this.anchor));
    const $head = doc.resolve(mapping.map(this.head));
    return new NodeRangeSelection($anchor, $head);
  }

  toJSON(): { type: string; anchor: number; head: number } {
    return {
      type: 'nodeRange',
      anchor: this.anchor,
      head: this.head
    };
  }

  get isForwards(): boolean {
    return this.head >= this.anchor;
  }

  get isBackwards(): boolean {
    return !this.isForwards;
  }

  extendBackwards(): NodeRangeSelection {
    const { doc } = this.$from;

    if (this.isForwards && this.ranges.length > 1) {
      const slicedRanges = this.ranges.slice(0, -1);
      const $from = slicedRanges[0].$from;
      const $to = slicedRanges[slicedRanges.length - 1].$to;
      return new NodeRangeSelection($from, $to, this.depth);
    }

    const firstRange = this.ranges[0];
    const $newAnchor = doc.resolve(Math.max(0, firstRange.$from.pos - 1));
    return new NodeRangeSelection(this.$anchor, $newAnchor, this.depth);
  }

  extendForwards(): NodeRangeSelection {
    const { doc } = this.$from;

    if (this.isBackwards && this.ranges.length > 1) {
      const slicedRanges = this.ranges.slice(1);
      const $from = slicedRanges[0].$from;
      const $to = slicedRanges[slicedRanges.length - 1].$to;
      return new NodeRangeSelection($to, $from, this.depth);
    }

    const lastRange = this.ranges[this.ranges.length - 1];
    const $newHead = doc.resolve(Math.min(doc.content.size, lastRange.$to.pos + 1));
    return new NodeRangeSelection(this.$anchor, $newHead, this.depth);
  }

  static fromJSON(doc: ProseMirrorNode, json: { anchor: number; head: number }): NodeRangeSelection {
    return new NodeRangeSelection(doc.resolve(json.anchor), doc.resolve(json.head));
  }

  static create(
    doc: ProseMirrorNode,
    anchor: number,
    head: number,
    depth?: number,
    bias: number = 1
  ): NodeRangeSelection {
    return new NodeRangeSelection(doc.resolve(anchor), doc.resolve(head), depth, bias);
  }

  getBookmark(): NodeRangeBookmark {
    return new NodeRangeBookmark(this.anchor, this.head);
  }
}

// 标记 NodeRangeSelection 为不可见
(NodeRangeSelection.prototype as typeof NodeRangeSelection.prototype & { visible: boolean }).visible = false; 