import { Redirect } from "expo-router";

// The first screen of the app is onboarding.
export default function Index() {
  return <Redirect href="/onboarding" />;
}
