// NodeRange 扩展的选项接口
export interface NodeRangeOptions {
  /**
   * 选择深度
   */
  depth: number | undefined;
  /**
   * 触发键
   */
  key: 'Shift' | 'Control' | 'Alt' | 'Meta' | 'Mod' | null | undefined;
} 