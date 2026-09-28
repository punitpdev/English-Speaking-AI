import { Text, View } from "react-native";

type SpeechBubbleProps = {
  text: string;
  /** Bubble background class, e.g. "bg-bubble-blue" */
  bubbleClassName: string;
  /** Text color class, e.g. "text-text-primary" */
  textClassName: string;
  /** Which bottom corner the tail points from */
  tail: "left" | "right";
  /** Tilt class, e.g. "-rotate-[8deg]" */
  tiltClassName: string;
  /** Position classes, e.g. "absolute top-5 left-[10%]" */
  className?: string;
};

export function SpeechBubble({
  text,
  bubbleClassName,
  textClassName,
  tail,
  tiltClassName,
  className = "",
}: SpeechBubbleProps) {
  return (
    <View className={`${className} ${tiltClassName}`}>
      <View className={`speech-bubble ${bubbleClassName}`}>
        <Text className={`speech-bubble__text ${textClassName}`}>{text}</Text>
      </View>
      <View
        className={`speech-bubble__tail ${bubbleClassName} ${
          tail === "left" ? "left-6" : "right-6"
        }`}
      />
    </View>
  );
}
