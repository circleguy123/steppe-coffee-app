import { Text, TextProps } from "react-native";

const FontVariantMap = {
  regular: "Montserrat",
  bold: "MontserratBold",
  black: "MontserratBlack",
};

interface SteppeTextProps extends TextProps {
  variant?: keyof typeof FontVariantMap;
}
export const SteppeText: React.FC<SteppeTextProps> = ({
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
