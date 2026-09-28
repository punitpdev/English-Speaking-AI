import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/theme";

// Signed-out users start on onboarding; signed-in users land on Home.
export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
      <View className="flex-1 items-center justify-center gap-6">
        <Text className="h2 text-text-primary">Home</Text>
        <Pressable
          onPress={() => signOut()}
          className="rounded-2xl bg-lingua-deep-purple px-6 py-3"
        >
          <Text className="h4 text-background">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
