/**
 * Design System - Design Tokens Export
 * Centralized export for all design tokens
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export { type BrandColor, colors, type ColorScale, type NeutralColor, type SemanticColorCategory } from './colors';
export { type ComponentSpacing, spacing, type SpacingScale } from './spacing';
export { type FontSize, type FontWeight, typography, type TypographyScale } from './typography';

// Combined token object for easy access
export const tokens = {
  colors,
  typography,
  spacing,
} as const;