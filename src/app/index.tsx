import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 justify-center items-center">
        <Text className="h2 text-center color-lingua-blue">Lingua</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.neutral.background },
  content: { padding: 24, gap: 32 },
});
