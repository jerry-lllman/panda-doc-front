import { Extension as t } from "@tiptap/react";
import { SelectionRange as e, Selection as o, Plugin as s, PluginKey as r } from "@tiptap/pm/state";
import { DecorationSet as n, Decoration as i } from "@tiptap/pm/view";
import { NodeRange as a } from "@tiptap/pm/model";

function h(t) {
  if (!t.length) return n.empty;
  const e = [],
    o = t[0].$from.node(0);
  return t.forEach((t => {
    const o = t.$from.pos,
      s = t.$from.nodeAfter;
    s && e.push(i.node(o, o + s.nodeSize, { class: "ProseMirror-selectednoderange" }));
  })), n.create(o, e);
}

function c(t, o, s) {
  const r = [],
    n = t.node(0);
  s = "number" == typeof s && s >= 0 ? s : t.sameParent(o) ? Math.max(0, t.sharedDepth(o.pos) - 1) : t.sharedDepth(o.pos);
  const i = new a(t, o, s),
    h = 0 === i.depth ? 0 : n.resolve(i.start).posAtIndex(0);
  return i.parent.forEach(((t, o) => {
    const s = h + o,
      a = s + t.nodeSize;
    if (s < i.start || s >= i.end) return;
    const c = new e(n.resolve(s), n.resolve(a));
    r.push(c);
  })), r;
}

class d {
  constructor(t, e) {
    this.anchor = t;
    this.head = e;
  }

  map(t) {
    return new d(t.map(this.anchor), t.map(this.head));
  }

  resolve(t) {
    const e = t.resolve(this.anchor),
      o = t.resolve(this.head);
    return new p(e, o);
  }
}

class p extends o {
  constructor(t, e, o, s = 1) {
    const { doc: r } = t,
      n = t === e,
      i = t.pos === r.content.size && e.pos === r.content.size,
      a = n && !i ? r.resolve(e.pos + (s > 0 ? 1 : -1)) : e,
      h = n && i ? r.resolve(t.pos - (s > 0 ? 1 : -1)) : t,
      d = c(h.min(a), h.max(a), o);
    super(a.pos >= t.pos ? d[0].$from : d[d.length - 1].$to, a.pos >= t.pos ? d[d.length - 1].$to : d[0].$from, d);
    this.depth = o;
  }

  get $to() {
    return this.ranges[this.ranges.length - 1].$to;
  }

  eq(t) {
    return t instanceof p && t.$from.pos === this.$from.pos && t.$to.pos === this.$to.pos;
  }

  map(t, e) {
    const o = t.resolve(e.map(this.anchor)),
      s = t.resolve(e.map(this.head));
    return new p(o, s);
  }

  toJSON() {
    return { type: "nodeRange", anchor: this.anchor, head: this.head };
  }

  get isForwards() {
    return this.head >= this.anchor;
  }

  get isBackwards() {
    return !this.isForwards;
  }

  extendBackwards() {
    const { doc: t } = this.$from;
    if (this.isForwards && this.ranges.length > 1) {
      const t = this.ranges.slice(0, -1),
        e = t[0].$from,
        o = t[t.length - 1].$to;
      return new p(e, o, this.depth);
    }
    const e = this.ranges[0],
      o = t.resolve(Math.max(0, e.$from.pos - 1));
    return new p(this.$anchor, o, this.depth);
  }

  extendForwards() {
    const { doc: t } = this.$from;
    if (this.isBackwards && this.ranges.length > 1) {
      const t = this.ranges.slice(1),
        e = t[0].$from,
        o = t[t.length - 1].$to;
      return new p(o, e, this.depth);
    }
    const e = this.ranges[this.ranges.length - 1],
      o = t.resolve(Math.min(t.content.size, e.$to.pos + 1));
    return new p(this.$anchor, o, this.depth);
  }

  static fromJSON(t, e) {
    return new p(t.resolve(e.anchor), t.resolve(e.head));
  }

  static create(t, e, o, s, r = 1) {
    return new this(t.resolve(e), t.resolve(o), s, r);
  }

  getBookmark() {
    return new d(this.anchor, this.head);
  }
}

function l(t) {
  return t instanceof p;
}

p.prototype.visible = !1;

const u = t.create({
  name: "nodeRange",
  addOptions: () => ({
    depth: void 0,
    key: "Mod"
  }),
  addKeyboardShortcuts() {
    return {
      "Shift-ArrowUp": ({ editor: t }) => {
        const { depth: e } = this.options,
          { view: o, state: s } = t,
          { doc: r, selection: n, tr: i } = s,
          { anchor: a, head: h } = n;
        if (!l(n)) {
          const t = p.create(r, a, h, e, -1);
          return i.setSelection(t), o.dispatch(i), !0;
        }
        const c = n.extendBackwards();
        return i.setSelection(c), o.dispatch(i), !0;
      },
      "Shift-ArrowDown": ({ editor: t }) => {
        const { depth: e } = this.options,
          { view: o, state: s } = t,
          { doc: r, selection: n, tr: i } = s,
          { anchor: a, head: h } = n;
        if (!l(n)) {
          const t = p.create(r, a, h, e);
          return i.setSelection(t), o.dispatch(i), !0;
        }
        const c = n.extendForwards();
        return i.setSelection(c), o.dispatch(i), !0;
      },
      "Mod-a": ({ editor: t }) => {
        const { depth: e } = this.options,
          { view: o, state: s } = t,
          { doc: r, tr: n } = s,
          i = p.create(r, 0, r.content.size, e);
        return n.setSelection(i), o.dispatch(n), !0;
      }
    };
  },
  onSelectionUpdate() {
    const { selection: t } = this.editor.state;
    l(t) && this.editor.view.dom.classList.add("ProseMirror-noderangeselection");
  },
  addProseMirrorPlugins() {
    let t = !1,
      e = !1;
    return [
      new s({
        key: new r("nodeRange"),
        props: {
          attributes: () => t ? { class: "ProseMirror-noderangeselection" } : { class: "" },
          handleDOMEvents: {
            mousedown: (t, o) => {
              const { key: s } = this.options,
                r = /Mac/.test(navigator.platform),
                n = !!o.shiftKey,
                i = !!o.ctrlKey,
                a = !!o.altKey,
                h = !!o.metaKey;
              return (null == s || "Shift" === s && n || "Control" === s && i || "Alt" === s && a || "Meta" === s && h || "Mod" === s && (r ? h : i)) && (e = !0), !!e && (document.addEventListener("mouseup", (() => {
                e = !1;
                const { state: o } = t,
                  { doc: s, selection: r, tr: n } = o,
                  { $anchor: i, $head: a } = r;
                if (i.sameParent(a)) return;
                const h = p.create(s, i.pos, a.pos, this.options.depth);
                n.setSelection(h), t.dispatch(n);
              }), { once: !0 }), !1);
            }
          },
          decorations: o => {
            const { selection: s } = o,
              r = l(s);
            if (t = !1, !e) return r ? (t = !0, h(s.ranges)) : null;
            const { $from: n, $to: i } = s;
            if (!r && n.sameParent(i)) return null;
            const a = c(n, i, this.options.depth);
            return a.length ? (t = !0, h(a)) : null;
          }
        }
      })
    ];
  }
});

export { u as NodeRange, p as NodeRangeSelection, u as default, h as getNodeRangeDecorations, c as getSelectionRanges, l as isNodeRangeSelection };