import { Extension as e } from "@tiptap/react";
import { isChangeOrigin as t } from "@tiptap/extension-collaboration";
import { PluginKey as n, Plugin as o } from "@tiptap/pm/state";
import r from "tippy.js";
import {
  ySyncPluginKey as i,
  absolutePositionToRelativePosition as s,
  relativePositionToAbsolutePosition as d
} from "y-prosemirror";
import { getSelectionRanges as l, NodeRangeSelection as a } from "./extension-node-range";

function p(e) {
  const t = e.cloneNode(!0),
    n = [e, ...Array.from(e.getElementsByTagName("*"))],
    o = [t, ...Array.from(t.getElementsByTagName("*"))];
  return n.forEach(((e, t) => {
    o[t].style.cssText = function (e) {
      let t = "";
      const n = getComputedStyle(e);
      for (let e = 0; e < n.length; e += 1)
        t += `${n[e]}:${n.getPropertyValue(n[e])};`;
      return t;
    }(e);
  })), t;
}

const c = e => {
  const { x: t, y: n, direction: o, editor: r } = e;
  let i = null,
    s = null,
    d = null,
    l = t;
  for (; null === s && l < window.innerWidth && l > 0;) {
    const e = document.elementsFromPoint(l, n),
      t = e.findIndex((e => e.classList.contains("ProseMirror"))),
      a = e.slice(0, t);
    if (a.length > 0) {
      const e = a[0];
      if (i = e, d = r.view.posAtDOM(e, 0), d >= 0) {
        s = r.state.doc.nodeAt(Math.max(d - 1, 0)),
          (null == s ? void 0 : s.isText) && (s = r.state.doc.nodeAt(Math.max(d - 1, 0))),
          s || (s = r.state.doc.nodeAt(Math.max(d, 0)));
        break;
      }
    }
    "left" === o ? l -= 1 : l += 1;
  }
  return { resultElement: i, resultNode: s, pos: null != d ? d : null };
};

function u(e, t) {
  return window.getComputedStyle(e)[t];
}

function m(e = 0, t = 0, n = 0) {
  return Math.min(Math.max(e, t), n);
}

function g(e) {
  var t;
  null === (t = e.parentNode) || void 0 === t || t.removeChild(e);
}

function f(e, t) {
  const { doc: n } = t.view.state,
    o = c({
      editor: t,
      x: e.clientX,
      y: e.clientY,
      direction: "right"
    });
  if (!o.resultNode || null === o.pos) return [];
  const r = e.clientX,
    i = function (e, t, n) {
      const o = parseInt(u(e.dom, "paddingLeft"), 10),
        r = parseInt(u(e.dom, "paddingRight"), 10),
        i = parseInt(u(e.dom, "borderLeftWidth"), 10),
        s = parseInt(u(e.dom, "borderLeftWidth"), 10),
        d = e.dom.getBoundingClientRect();
      return {
        left: m(t, d.left + o + i, d.right - r - s),
        top: n
      };
    }(t.view, r, e.clientY),
    s = t.view.posAtCoords(i);
  if (!s) return [];
  const { pos: d } = s;
  if (!n.resolve(d).parent) return [];
  const a = n.resolve(o.pos),
    p = n.resolve(o.pos + 1);
  return l(a, p, 0);
}

const h = (e, t) => {
  const n = e.resolve(t),
    { depth: o } = n;
  if (0 === o) return t;
  return n.pos - n.parentOffset - 1;
};

const y = (e, t) => {
  const n = e.nodeAt(t),
    o = e.resolve(t);
  let { depth: r } = o,
    i = n;
  for (; r > 0;) {
    const e = o.node(r);
    r -= 1, 0 === r && (i = e);
  }
  return i;
};

const v = (e, t) => {
  const n = i.getState(e);
  return n ? s(t, n.type, n.binding.mapping) : null;
};

const E = (e, t) => {
  let n = t;
  for (; n && n.parentNode && n.parentNode !== e.dom;)
    n = n.parentNode;
  return n;
};

const C = new n("dragHandle");

const k = ({ pluginKey: e = C, element: s, editor: u, tippyOptions: m, onNodeChange: k }) => {
  const M = document.createElement("div");
  let w, D = null, x = !1, O = null, b = -1;

  return s.addEventListener("dragstart", (e => {
    !function (e, t) {
      const { view: n } = t;
      if (!e.dataTransfer) return;
      const { empty: o, $from: r, $to: i } = n.state.selection,
        s = f(e, t),
        d = l(r, i, 0),
        c = d.some((e => s.find((t => t.$from === e.$from && t.$to === e.$to)))),
        u = o || !c ? s : d;
      if (!u.length) return;
      const { tr: m } = n.state,
        h = document.createElement("div"),
        y = u[0].$from.pos,
        v = u[u.length - 1].$to.pos,
        E = a.create(n.state.doc, y, v),
        C = E.content();
      u.forEach((e => {
        const t = p(n.nodeDOM(e.$from.pos));
        h.append(t);
      })),
        h.style.position = "absolute",
        h.style.top = "-10000px",
        document.body.append(h),
        e.dataTransfer.clearData(),
        e.dataTransfer.setDragImage(h, 0, 0),
        n.dragging = { slice: C, move: !0 },
        m.setSelection(E),
        n.dispatch(m),
        document.addEventListener("drop", (() => g(h)), { once: !0 });
    }(e, u),
      setTimeout((() => {
        s && (s.style.pointerEvents = "none");
      }), 0);
  })),
    s.addEventListener("dragend", (() => {
      s && (s.style.pointerEvents = "auto");
    })),
    new o({
      key: "string" == typeof e ? new n(e) : e,
      state: {
        init: () => ({ locked: !1 }),
        apply(e, n, o, r) {
          const l = e.getMeta("lockDragHandle"),
            a = e.getMeta("hideDragHandle");
          if (void 0 !== l && (x = l), a && D)
            return D.hide(),
              x = !1,
              O = null,
              b = -1,
              null == k || k({ editor: u, node: null, pos: -1 }),
              n;
          if (e.docChanged && -1 !== b && s && D)
            if (t(e)) {
              const e = ((e, t) => {
                const n = i.getState(e);
                return n ? d(n.doc, n.type, t, n.binding.mapping) || 0 : -1;
              })(r, w);
              e !== b && (b = e);
            } else {
              const t = e.mapping.map(b);
              t !== b && (b = t, w = v(r, b));
            }
          return n;
        }
      },
      view: e => {
        var t;
        return s.draggable = !0,
          s.style.pointerEvents = "auto",
          null === (t = u.view.dom.parentElement) || void 0 === t || t.appendChild(M),
          M.appendChild(s),
          M.style.pointerEvents = "none",
          M.style.position = "absolute",
          M.style.top = "0",
          M.style.left = "0",
        {
          update(t, n) {
            if (!s) return;
            if (!u.isEditable)
              return null == D || D.destroy(), void (D = null);
            if (D || (D = r(e.dom, {
              getReferenceClientRect: null,
              interactive: !0,
              trigger: "manual",
              placement: "left-start",
              hideOnClick: !1,
              duration: 100,
              popperOptions: {
                modifiers: [
                  { name: "flip", enabled: !1 },
                  { name: "preventOverflow", options: { rootBoundary: "document", mainAxis: !1 } }
                ]
              },
              ...m,
              appendTo: M,
              content: s
            })), s.draggable = !x, e.state.doc.eq(n.doc) || -1 === b)
              return;
            let o = e.nodeDOM(b);
            if (o = E(e, o), o === e.dom) return;
            if (1 !== (null == o ? void 0 : o.nodeType)) return;
            const i = e.posAtDOM(o, 0),
              d = y(u.state.doc, i),
              l = h(u.state.doc, i);
            O = d, b = l, w = v(e.state, b),
              null == k || k({ editor: u, node: O, pos: b }),
              D.setProps({ getReferenceClientRect: () => o.getBoundingClientRect() });
          },
          destroy() {
            null == D || D.destroy(), s && g(M);
          }
        };
      },
      props: {
        handleDOMEvents: {
          mouseleave: (e, t) => (
            x || t.target && !M.contains(t.relatedTarget) && (
              null == D || D.hide(),
              O = null,
              b = -1,
              null == k || k({ editor: u, node: null, pos: -1 })
            ),
            !1
          ),
          mousemove(e, t) {
            if (!s || !D || x) return !1;
            const n = c({
              x: t.clientX,
              y: t.clientY,
              direction: "right",
              editor: u
            });
            if (!n.resultElement) return !1;
            let o = n.resultElement;
            if (o = E(e, o), o === e.dom) return !1;
            if (1 !== (null == o ? void 0 : o.nodeType)) return !1;
            const r = e.posAtDOM(o, 0),
              i = y(u.state.doc, r);
            if (i !== O) {
              const t = h(u.state.doc, r);
              O = i, b = t, w = v(e.state, b),
                null == k || k({ editor: u, node: O, pos: b }),
                D.setProps({ getReferenceClientRect: () => o.getBoundingClientRect() }),
                D.show();
            }
            return !1;
          }
        }
      }
    });
};

const M = e.create({
  name: "dragHandle",
  addOptions: () => ({
    render() {
      const e = document.createElement("div");
      return e.classList.add("drag-handle"), e;
    },
    tippyOptions: {},
    locked: !1,
    onNodeChange: () => null
  }),
  addCommands() {
    return {
      lockDragHandle: () => ({ editor: e }) => (
        this.options.locked = !0,
        e.commands.setMeta("lockDragHandle", this.options.locked)
      ),
      unlockDragHandle: () => ({ editor: e }) => (
        this.options.locked = !1,
        e.commands.setMeta("lockDragHandle", this.options.locked)
      ),
      toggleDragHandle: () => ({ editor: e }) => (
        this.options.locked = !this.options.locked,
        e.commands.setMeta("lockDragHandle", this.options.locked)
      )
    };
  },
  addProseMirrorPlugins() {
    const e = this.options.render();
    return [k({
      tippyOptions: this.options.tippyOptions,
      element: e,
      editor: this.editor,
      onNodeChange: this.options.onNodeChange
    })];
  }
});

export { M as DragHandle, k as DragHandlePlugin, M as default, C as dragHandlePluginDefaultKey };