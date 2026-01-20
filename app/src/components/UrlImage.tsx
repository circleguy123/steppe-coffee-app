import { Image, ImageProps } from "expo-image";

export const UrlImage: React.FC<ImageProps> = ({ source, ...props }) => (
  <Image
    {...props}
    source={typeof source === "string" ? { uri: source } : source}
    placeholder={require("@/assets/images/menu-item-placeholder.png")}
  />
);
