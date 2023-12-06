import { Image } from "expo-image";
import { Platform } from "react-native";
import { List } from "react-native-paper";
import { useAuth } from "../../services/context/auth.context";
import React from "react";

export const Icon = (props: any) => {
	const { biometricType } = useAuth();
	return (
		<List.Icon
			{...props}
			icon={
				biometricType === "facial_recognition"
					? Platform.OS === "ios"
						? ({ color, size }) => (
							<Image
								source={require("../../assets/img/face-id.png")}
								style={{ width: size, height: size, tintColor: color }}
							/>
						)
						: "face-recognition"
					: biometricType === "fingerprint"
						? Platform.OS === "ios"
							? ({ color, size }) => (
								<Image
									source={require("../../assets/img/touch-id.png")}
									style={{ width: size, height: size, tintColor: color }}
								/>
							)
							: "face-recognition"
						: ({ color, size }) => (
							<Image
								source={require("../../assets/img/iris.png")}
								style={{ width: size, height: size, tintColor: color }}
							/>
						)
			}
		/>
	);
};
