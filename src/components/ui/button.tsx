import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";


const COLORS = {
  primary: "#1e88e5", 
  danger: "#e53935",
};

interface ButtonProps {
  type?: "primary" | "outline" | "danger";
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  type = "primary",
  text,
  onPress,
  style,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[type],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          color={type === "outline" ? COLORS.primary : "#fff"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            type === "outline" && styles.textOutline,
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  
  base: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  /* Variantes */
  primary: {
    backgroundColor: COLORS.primary,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  danger: {
    backgroundColor: COLORS.danger,
  },

  /* Texto */
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  textOutline: {
    color: COLORS.primary,
  },

  /* Estados */
  disabled: {
    opacity: 0.6,
  },
});

