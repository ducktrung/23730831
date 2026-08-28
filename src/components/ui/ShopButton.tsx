import React, {memo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

import {useTheme} from '@contexts/ThemeContext';

import Typography from './Typography';

type Props = {
  title: string;
  onPress: () => void;

  isLoading?: boolean;
  disabled?: boolean;

  variant?:
    | 'primary'
    | 'outline';
};

function ShopButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}: Props) {
  const {colors} = useTheme();

  const blocked =
    disabled || isLoading;

  const isPrimary =
    variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={blocked}
      style={({pressed}) => [
        styles.button,

        {
          backgroundColor:
            isPrimary
              ? colors.primary
              : 'transparent',

          borderColor:
            colors.primary,

          opacity:
            blocked
              ? 0.5
              : pressed
                ? 0.8
                : 1,
        },
      ]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            isPrimary
              ? COLORS.surface
              : colors.primary
          }
        />
      ) : (
        <Typography
          variant="button"
          color={
            isPrimary
              ? COLORS.surface
              : colors.primary
          }>
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    button: {
      minHeight: 44,

      borderWidth: 1,
      borderRadius:
        SIZES.radiusMd,

      paddingHorizontal:
        SIZES.lg,

      justifyContent:
        'center',

      alignItems: 'center',
    },
  });

export default memo(ShopButton);