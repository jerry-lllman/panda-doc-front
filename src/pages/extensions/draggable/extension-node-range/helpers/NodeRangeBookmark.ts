import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { Mappable } from '@tiptap/pm/transform';
import { NodeRangeSelection } from './NodeRangeSelection';

// NodeRangeBookmark 类
export class NodeRangeBookmark {
  public anchor: number;
  public head: number;

  constructor(anchor: number, head: number) {
    this.anchor = anchor;
    this.head = head;
  }

  map(mapping: Mappable): NodeRangeBookmark {
    return new NodeRangeBookmark(mapping.map(this.anchor), mapping.map(this.head));
  }

  resolve(doc: ProseMirrorNode): NodeRangeSelection {
    const $anchor = doc.resolve(this.anchor);
    const $head = doc.resolve(this.head);
    return new NodeRangeSelection($anchor, $head);
  }
} 