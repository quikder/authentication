import { useWidth } from "verity-quik";
import styled from "styled-components/native";

export const Body = styled.View<{ $width: number }>`
    width: 100%;
    padding: 10px 16px;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Box = styled.View<{ $width: number }>`
	width: 100%;
	height: 100%;
	justify-content: ${({ $width }) =>
		useWidth(
			$width,
			"flex-start",
			"flex-start",
			"flex-start",
			"center",
			"center",
		)};
	align-items: center;
	position: relative;
	background-color: ${({ theme, $width }) =>
		useWidth(
			$width,
			theme.colors.background,
			theme.colors.background,
			theme.colors.background,
			"#00000050",
			"#00000050",
		)};
`;

interface ContainerInterface {
	$width: number;
	$bottom: number;
}

export const Container = styled.View<ContainerInterface>`
	width: ${({ $width }) =>
		useWidth($width, "100%", "100%", "100%", "50%", "30%")};
	max-height: ${({ $width }) =>
		useWidth($width, "100%", "100%", "100%", "80%", "80%")};
    margin-bottom: 20px;
`;
