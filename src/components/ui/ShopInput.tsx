import React, {memo} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {SIZES} from '@constants/theme';
import {useTheme} from '@contexts/ThemeContext';

import Typography from './Typography';

type Props =
  TextInputProps & {
    value: string;
    onChangeText:
      (text: string) => void;
    label?: string;
    error?: string;
  };

function ShopInput({
  value,
  onChangeText,
  label,
  error,
  style,
  ...rest
}: Props) {
  const {colors} = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Typography
          variant="caption"
          style={styles.label}>
          {label}
        </Typography>
      ) : null}

      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={
          colors.textLight
        }
        style={[
          styles.input,
          {
            backgroundColor:
              colors.surface,

            color: colors.text,

            borderColor: error
              ? colors.error
              : colors.border,
          },
          style,
        ]}
      />

      {error ? (
        <Typography
          variant="caption"
          color={colors.error}
          style={styles.error}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles =
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },

    label: {
      marginBottom: SIZES.xs,
    },

    input: {
      minHeight: 48,

      borderWidth: 1,
      borderRadius:
        SIZES.radiusMd,

      paddingHorizontal:
        SIZES.md,

      paddingVertical:
        SIZES.sm,
    },

    error: {
      marginTop: SIZES.xs,
    },
  });

export default memo(ShopInput);