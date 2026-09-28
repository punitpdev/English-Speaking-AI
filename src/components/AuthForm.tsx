import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { type ReactNode, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { getClerkErrorMessage } from "@/lib/clerk";
import { colors } from "@/theme";

type AuthMode = "sign-up" | "sign-in";

const copy: Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    button: string;
    footerText: string;
    footerLink: string;
    footerHref: Href;
    hasPassword: boolean;
  }
> = {
  "sign-up": {
    title: "Create your account",
    subtitle: "Start your language journey today ✨",
    button: "Sign Up",
    footerText: "Already have an account?",
    footerLink: "Log in",
    footerHref: "/sign-in",
    hasPassword: true,
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Continue your language journey ✨",
    button: "Sign In",
    footerText: "Don't have an account?",
    footerLink: "Sign up",
    footerHref: "/sign-up",
    hasPassword: false,
  },
};

const socialProviders: {
  name: string;
  strategy: "oauth_google";
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    name: "Google",
    strategy: "oauth_google",
    icon: "logo-google",
    color: "#EA4335",
  },
  // { name: "Facebook", strategy: "oauth_facebook", icon: "logo-facebook", color: "#1877F2" },
  // { name: "Apple", strategy: "oauth_apple", icon: "logo-apple", color: colors.neutral.textPrimary },
];

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const screen = copy[mode];

  const { signIn, fetchStatus: signInStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const isFetching = signInStatus === "fetching" || signUpStatus === "fetching";

  // If the screen was opened directly (nothing to go back to), fall back to onboarding
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding");
    }
  };

  const showError = (message: string) =>
    Alert.alert("Something went wrong", message);

  // Step 1: create the account / start the sign-in, then Clerk emails a 6-digit code
  const handleSubmit = async () => {
    if (isFetching) return;

    if (mode === "sign-up") {
      const created = await signUp.password({
        emailAddress: email.trim(),
        password,
      });
      if (created.error) return showError(getClerkErrorMessage(created.error));

      const sent = await signUp.verifications.sendEmailCode();
      if (sent.error) return showError(getClerkErrorMessage(sent.error));
    } else {
      const sent = await signIn.emailCode.sendCode({
        emailAddress: email.trim(),
      });
      if (sent.error) return showError(getClerkErrorMessage(sent.error));
    }

    setVerifying(true);
  };

  // Step 2: check the code. On success the session becomes active and we go Home.
  const handleVerify = async (code: string) => {
    const navigate = ({
      session,
      decorateUrl,
    }: {
      session: { currentTask?: unknown } | null;
      decorateUrl: (url: string) => string;
    }) => {
      if (session?.currentTask) {
        return showError(
          "Extra account steps are required before you can continue.",
        );
      }
      setVerifying(false);
      router.replace(decorateUrl("/") as Href);
    };

    if (mode === "sign-up") {
      const verified = await signUp.verifications.verifyEmailCode({ code });
      if (verified.error)
        return showError(getClerkErrorMessage(verified.error));
      if (signUp.status === "complete") {
        const done = await signUp.finalize({ navigate });
        if (done.error) showError(getClerkErrorMessage(done.error));
      }
    } else {
      const verified = await signIn.emailCode.verifyCode({ code });
      if (verified.error)
        return showError(getClerkErrorMessage(verified.error));
      if (signIn.status === "complete") {
        const done = await signIn.finalize({ navigate });
        if (done.error) showError(getClerkErrorMessage(done.error));
      }
    }
  };

  // Social sign-in opens the provider in a browser, then returns with a session
  const handleSocial = async (
    strategy: (typeof socialProviders)[number]["strategy"],
  ) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
      // No session usually means the user closed the browser - nothing to show
    } catch (error) {
      showError(getClerkErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-2 flex-1">
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            className="size-9 justify-center"
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.neutral.textPrimary}
            />
          </Pressable>

          <Text className="h2 mt-2 text-text-primary">{screen.title}</Text>
          <Text className="body-large mt-1 text-text-secondary">
            {screen.subtitle}
          </Text>

          {/* Mascot peeking over the email field */}
          <View className="mt-3 h-[141px] items-center overflow-hidden">
            <Image
              source={images.mascotAuth}
              resizeMode="contain"
              className="-mt-10 size-[220px] -scale-x-100"
            />
            <Text className="absolute left-1/2 top-[28px] -ml-[96px] text-[16px] text-streak">
              ✦
            </Text>
            <Text className="absolute left-1/2 top-[35px] ml-[96px] text-[14px] text-lingua-blue">
              ✦
            </Text>
            <Text className="absolute left-1/2 top-[64px] ml-[84px] text-[18px] text-warning">
              ✦
            </Text>
          </View>

          <AuthField label="Email">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor={colors.neutral.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              style={styles.input}
            />
          </AuthField>

          {screen.hasPassword && (
            <View className="mt-3.5">
              <AuthField
                label="Password"
                right={
                  <Pressable
                    onPress={() => setShowPassword((value) => !value)}
                    hitSlop={12}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={26}
                      color={colors.neutral.textSecondary}
                    />
                  </Pressable>
                }
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.neutral.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  style={styles.input}
                />
              </AuthField>
            </View>
          )}

          {/* Mount point for Clerk's bot protection on sign-up */}
          {mode === "sign-up" && <View nativeID="clerk-captcha" />}

          <Pressable
            className={`auth-button mt-4 ${isFetching ? "opacity-70" : ""}`}
            onPress={handleSubmit}
            disabled={isFetching}
          >
            <Text className="font-poppins-semibold text-[18px] text-background">
              {screen.button}
            </Text>
          </Pressable>

          {/* Divider */}
          <View className="mt-5 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-border" />
            <Text className="body-medium text-text-secondary">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="mt-3 gap-2.5">
            {socialProviders.map((provider) => (
              <Pressable
                key={provider.name}
                className="social-button"
                onPress={() => handleSocial(provider.strategy)}
              >
                <View className="w-8 items-center">
                  <Ionicons
                    name={provider.icon}
                    size={26}
                    color={provider.color}
                  />
                </View>
                <Text className="h4 ml-7 text-text-primary">
                  Continue with {provider.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-center py-4">
        <Text className="body-medium text-text-secondary">
          {screen.footerText}{" "}
        </Text>
        <Pressable onPress={() => router.replace(screen.footerHref)}>
          <Text className="font-poppins-semibold text-[14px] text-lingua-deep-purple">
            {screen.footerLink}
          </Text>
        </Pressable>
      </View>

      <VerificationModal
        visible={verifying}
        email={email}
        onClose={() => setVerifying(false)}
        onComplete={handleVerify}
      />
    </SafeAreaView>
  );
}

function AuthField({
  label,
  right,
  children,
}: {
  label: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View className="auth-field flex-row items-center">
      <View className="flex-1">
        <Text className="auth-field__label text-text-secondary">{label}</Text>
        {children}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.neutral.background },
  flex: { flex: 1 },
  input: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 2,
    color: colors.neutral.textPrimary,
  },
});
