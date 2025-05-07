import {Button} from "react-native-paper";
import React from "react";
import {StyleSheet} from "react-native";
import useAccentColors from "../hooks/useAccentColors";

export const SimpleButton = ({ mode, style, accent = false, label, onPress }) => {
  const colors = useAccentColors();

  return (
    <Button
      mode={mode}
      style={[styles.button, style, accent && { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      {label}
    </Button>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 6,
    borderRadius: 8,
  }
})
