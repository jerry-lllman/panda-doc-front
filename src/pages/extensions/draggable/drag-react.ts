import { DragHandlePlugin as e, dragHandlePluginDefaultKey as r } from "./drag";
import n, { useState as t, useRef as l, useEffect as i } from "react";

const o = (o) => {
  const {
    className: u = "drag-handle",
    children: a,
    editor: p,
    pluginKey: s = r,
    onNodeChange: c,
    tippyOptions: d = {}
  } = o,
    [g, m] = t(null),
    h = l(null);

  return (
    i(() => {
      if (g) {
        if (p.isDestroyed) {
          return () => {
            h.current = null;
          };
        }

        h.current || (
          h.current = e({
            editor: p,
            element: g,
            pluginKey: s,
            tippyOptions: d,
            onNodeChange: c
          }),
          p.registerPlugin(h.current)
        );

        return () => {
          p.unregisterPlugin(s);
          h.current = null;
        };
      }

      return () => {
        h.current = null;
      };
    }, [g, p, c, s]),

    n.createElement(
      "div",
      {
        className: u,
        ref: m
      },
      a
    )
  );
};

export { o as DragHandle, o as default };