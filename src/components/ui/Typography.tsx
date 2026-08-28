import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
} from 'react-native';

import {FONTS} from '@constants/theme';
import {useTheme} from '@contexts/ThemeContext';

type TypographyVariant =
  keyof typeof FONTS;

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  children: React.ReactNode;
};

function Typography({
  variant = 'body',
  color,
  children,
  style,
  numberOfLines,
  ...rest
}: Props) {
  const {colors} = useTheme();

  return (
    <Text
      {...rest}
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        FONTS[variant],
        {
          color:
            color ?? colors.text,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles =
  StyleSheet.create({
    base: {
      includeFontPadding: false,
    },
  });

export default memo(Typography);