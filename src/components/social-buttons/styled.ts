import { Image } from "expo-image";
import { styled } from "styled-components/native";

export const Button = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border: 1px ${({ theme }) => theme.colors.onPrimaryContainer};
  border-radius: 99px;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled(Image)`
  width: 60%;
  height: 60%;
`;
