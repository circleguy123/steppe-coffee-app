import { Image, ImageProps } from "react-native";

export interface SteppeLogoProps extends Omit<ImageProps, "source"> {}

export const SteppeLogo: React.FC<SteppeLogoProps> = (props) => {
  return (
    <Image
      source={require("@/assets/images/steppe-logo.png")}
      // width={160}
      // height={80}
      {...props}
    />
  );
};
