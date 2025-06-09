import { Editor } from "@tiptap/react";
import { Node } from "@tiptap/pm/model";
import { PluginKey } from "@tiptap/pm/state";
import type { Props as TippyProps } from "tippy.js";

// Y.js 相对位置类型（来自 y-prosemirror）
// 由于这是外部库的类型，暂时使用 unknown 来避免 any
export type RelativePosition = {
  type: unknown;
  tname?: string;
  item?: unknown;
  assoc?: number;
};

// 查找元素和节点的结果接口
export interface FindElementAndNodeResult {
  resultElement: HTMLElement | null;
  resultNode: Node | null;
  pos: number | null;
}

// 查找元素和节点的参数接口
export interface FindElementAndNodeParams {
  x: number;
  y: number;
  direction: 'left' | 'right';
  editor: Editor;
}

// 插件状态接口
export interface DragHandlePluginState {
  locked: boolean;
}

// 拖拽句柄选项接口
export interface DragHandleOptions {
  /**
   * 渲染一个由 tippy.js 定位的元素
   */
  render(): HTMLElement;
  /**
   * tippy.js 的选项
   */
  tippyOptions?: Partial<TippyProps>;
  /**
   * 锁定拖拽句柄的位置和可见性
   */
  locked?: boolean;
  /**
   * 当节点被悬停时返回节点或 null
   */
  onNodeChange?: (options: { editor: Editor; node: Node | null; pos: number }) => void;
}

// 插件属性接口
export interface DragHandlePluginProps {
  pluginKey?: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
  onNodeChange?: (data: { editor: Editor; node: Node | null; pos: number }) => void;
  tippyOptions?: Partial<TippyProps>;
}

