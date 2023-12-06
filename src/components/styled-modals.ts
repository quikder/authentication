import { useWidth } from "verity-ui";
import { Image } from "expo-image";
import styled from "styled-components/native";

interface WidthStyleProps {
	$width: number;
}

export const Body = styled.View<WidthStyleProps>`
  width: 100%;
  flex: 1;
  padding: 30px 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $width, theme }) =>
		useWidth(
			$width,
			theme.colors.background,
			theme.colors.background,
			theme.colors.background,
			"#00000080",
			"#00000080",
		)};
`;

export const Card = styled.View<WidthStyleProps>`
  width: ${({ $width }) =>
		useWidth($width, "100%", "100%", "100%", "50%", "30%")};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 10px;
  border-radius: 10px;
`;

export const Header = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

export const Img = styled(Image)<WidthStyleProps>`
  width: ${({ $width }) =>
		useWidth($width, "120px", "120px", "120px", "70px", "70px")};
  height: ${({ $width }) =>
		useWidth($width, "120px", "120px", "120px", "70px", "70px")};
  margin-bottom: 10px;
`;

export const ButtonContent = styled.View`
  width: 100%;
  gap: 5px;
  align-self: center;
  margin-top: 10px;
`;
