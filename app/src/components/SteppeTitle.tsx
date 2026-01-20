import { Text, TextProps } from "react-native";

const FontVariantMap = {
  regular: "Opsilon",
};

interface SteppeTextProps extends TextProps {
  variant?: keyof typeof FontVariantMap;
}
export const SteppeTitle: React.FC<SteppeTextProps> = ({
  variant = "regular",
  ...props
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: FontVariantMap[variant],
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
};
