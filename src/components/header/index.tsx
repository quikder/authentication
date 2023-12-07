import { SegmentControl } from "verity-quik";
import { t } from "i18next";
import React from "react";
import { Text } from "react-native-paper";
import { useTheme } from "styled-components/native";
import { Border, Content, ContentLogo, Logo } from "./styled";

interface HeaderProps {
	value: number;
	setValue: React.Dispatch<React.SetStateAction<number>>;
}

export const Header: React.FC<HeaderProps> = ({ value, setValue }) => {
	const theme = useTheme();
	return (
		<Content>
			<ContentLogo>
				<Logo transition={0} source={require("../../assets/img/logo.png")} />
			</ContentLogo>

			<Text variant="titleLarge" style={{ textAlign: "center" }}>
				{t("auth.welcome")}
			</Text>

			<Text
				variant="labelMedium"
				style={{ textAlign: "center", color: theme.colors.primaryContainer }}
			>
				{t("auth.login-register")}
			</Text>
			<Border>
				<SegmentControl
					segments={[t("auth.login"), t("auth.register")]}
					onChange={(index: number) => {
						setValue(index);
					}}
					value={value}
					style={{ backgroundColor: "transparent" }}
				/>
			</Border>
		</Content>
	);
};
