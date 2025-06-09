import { NodeRangeSelection } from './NodeRangeSelection';

// Helper function to check if selection is NodeRangeSelection
export function isNodeRangeSelection(value: unknown): value is NodeRangeSelection {
  return value instanceof NodeRangeSelection;
} 