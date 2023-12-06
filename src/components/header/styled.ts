import { Image } from "expo-image";
import { styled } from "styled-components/native";

export const Content = styled.View`
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
`;

export const Border = styled.View`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border-radius: 99px;
  background-color: ${({ theme }) => `${theme.colors.primary}40`};
`;

export const ContentLogo = styled.View`
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
`;

export const Logo = styled(Image)`
  width: 25%;
  aspect-ratio: 1;
`;
