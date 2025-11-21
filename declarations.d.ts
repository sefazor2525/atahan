declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';
  type IconProps = {
    name: string;
    size?: number;
    color?: string;
  } & TextProps;
  const Icon: ComponentType<IconProps>;
  export default Icon;
}