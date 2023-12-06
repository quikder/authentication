import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "styled-components/native";

export const Image: React.FC<{ type: string }> = ({ type }) => {
	const theme = useTheme();

	if (type === "phone") {
		return <AntDesign name="mobile1" size={50} color={theme.colors.text} />;
	} else if (type === "tablet") {
		return <AntDesign name="tablet1" size={50} color={theme.colors.text} />;
	} else if (type === "desktop") {
		return (
			<Ionicons name="desktop-outline" size={50} color={theme.colors.text} />
		);
	} else {
		return (
			<MaterialIcons
				name="device-unknown"
				size={50}
				color={theme.colors.text}
			/>
		);
	}
};
