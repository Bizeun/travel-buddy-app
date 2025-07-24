// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// This type definition is too strict and is causing the error.
// We will remove it and let TypeScript infer the types directly.
// type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Existing
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'fast-food-outline': 'fastfood', 
  'sparkles-outline': 'auto-awesome',

  // New additions
  'fork.knife': 'restaurant',
  'cup.and.saucer.fill': 'local-cafe',
  'wineglass.fill': 'wine-bar',
  'leaf.fill': 'park',
  'building.columns.fill': 'museum',
  'camera.fill': 'local-see',
  'cart.fill': 'shopping-cart',
  'birthday.cake.fill': 'cake',
  'photo.on.rectangle.angled': 'photo-library',
  'mappin.and.ellipse': 'place',
} as const; // Add 'as const' to make the values readonly and specific.

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
