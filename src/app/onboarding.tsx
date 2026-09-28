import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SpeechBubble } from "@/components/SpeechBubble";
import { images } from "@/constants/images";
import { colors } from "@/theme";

export default function Onboarding() {
  // The mascot PNG has transparent padding, so it is drawn slightly wider than the screen.
  const { width } = useWindowDimensions();
  const mascotSize = width * 1.1;
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logo + app name */}
      <View className="mt-2 flex-row items-center justify-center">
        <Image
          source={images.mascotLogo}
          resizeMode="contain"
          className="-ml-4 size-[76px]"
        />
        <Text className="font-poppins-semibold text-[30px] text-text-primary">
          muolingo
        </Text>
      </View>

      {/* Headline */}
      <View className="mt-8 px-9">
        <Text className="font-poppins-bold text-[32px] leading-[48px] text-text-primary">
          Your AI language{"\n"}
          <Text className="text-lingua-deep-purple">teacher</Text>.
        </Text>
        <Text className="mt-2 max-w-[270px] font-poppins-regular text-base leading-[29px] text-text-secondary">
          Real conversations, personalized lessons, anytime, anywhere.
        </Text>
      </View>

      {/* Mascot + speech bubbles */}
      <View className="mt-4 flex-1 justify-center">
        <Image
          source={images.mascotWelcome}
          resizeMode="contain"
          className="shrink-0 self-center pr-20"
          style={{ width: mascotSize, height: mascotSize }}
        />
        <SpeechBubble
          text="Hello!"
          bubbleClassName="bg-bubble-blue"
          textClassName="text-text-primary"
          tail="right"
          tiltClassName="-rotate-[8deg]"
          className="absolute left-[10%] top-5"
        />
        <SpeechBubble
          text="¡Hola!"
          bubbleClassName="bg-bubble-purple"
          textClassName="text-lingua-deep-purple"
          tail="left"
          tiltClassName="rotate-[8deg]"
          className="absolute right-[12%] top-0"
        />
        <SpeechBubble
          text="你好!"
          bubbleClassName="bg-bubble-red"
          textClassName="text-error"
          tail="left"
          tiltClassName="rotate-[8deg]"
          className="absolute right-[6%] top-[28%]"
        />
      </View>

      {/* Get Started */}
      <View className="px-6 pb-6">
        <Pressable
          className="primary-button"
          onPress={() => router.push("/sign-up")}
        >
          <Text className="font-poppins-semibold text-[20px] text-background">
            Get Started
          </Text>
          <View className="primary-button__chevron" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.neutral.background },
});
