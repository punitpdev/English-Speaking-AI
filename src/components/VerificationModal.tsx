import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  /** Called with the full code as soon as the last digit is entered */
  onComplete: (code: string) => void;
};

export function VerificationModal({
  visible,
  email,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (digits.length === CODE_LENGTH) {
      setCode(""); // start empty again (also lets the user retry a wrong code)
      onComplete(digits);
    } else {
      setCode(digits);
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  const activeIndex = Math.min(code.length, CODE_LENGTH - 1);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <View className="mx-6 rounded-3xl bg-background p-6">
          <Text className="h2 text-center text-text-primary">
            Check your email
          </Text>
          <Text className="body-medium mt-2 text-center text-text-secondary">
            {`We sent a verification code to ${email || "your email"}. Enter the 6-digit code below.`}
          </Text>

          <View className="mt-6">
            <View className="flex-row gap-2">
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <View
                  key={index}
                  className={`otp-box ${index === activeIndex ? "otp-box--active" : ""}`}
                >
                  <Text className="h2 text-text-primary">{code[index] ?? ""}</Text>
                </View>
              ))}
            </View>

            {/* Invisible input on top of the boxes: tapping anywhere types the code */}
            <TextInput
              value={code}
              onChangeText={handleChange}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={CODE_LENGTH}
              autoFocus
              caretHidden
              style={styles.hiddenInput}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(13, 19, 43, 0.5)",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
    color: colors.neutral.background,
  },
});
