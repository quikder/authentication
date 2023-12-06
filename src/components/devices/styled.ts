import { useWidth } from "verity-ui";
import { Text } from "react-native-paper";
import styled from "styled-components/native";

export const Box = styled.View<{ $width: number }>`
  width: ${({ $width }) =>
		useWidth($width, "100%", "100%", "100%", "50%", "32%")};
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ImgContent = styled.View`
    width: 20%;
`;

export const InfoContext = styled.View`
    width: 80%;
`;

export const Row = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
`;

export const Info = styled(Text)`
    margin-left: 5px;
`;

export const Status = styled(Text)<{ status: string }>`
    color: ${({ theme, status }) =>
    //@ts-ignore
			status === "active" ? theme?.colors?.success : theme?.colors?.error};
`;

export const ContentMenu = styled.View`
    position: absolute;
    top: 0;
    right: 0;
`;
