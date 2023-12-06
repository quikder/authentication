import { MaterialCommunityIcons } from "@expo/vector-icons";
import { authenticateAsync } from "expo-local-authentication";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { USE_BIOMETRIC_AUTH_KEY } from "../../constants/keys";
import { useAuth } from "../../services/context/auth.context";
import { useSession } from "../../services/context/session.context";
import { getAsyncStorage } from "../../utils/storage";
import { Button, Icon } from "./styled";

export const BiometricButton: React.FC<Props> = ({ loginSource }) => {
	const [havePermission, setHavePermission] = useState<boolean | null>(false);
	const { isBiometricAvailable, biometricType } = useAuth();

	const { handleLoginBiometric, loginBiometricLoading } = useSession();

	useEffect(() => {
		(async () => {
			const haveUserPermission = await getAsyncStorage(USE_BIOMETRIC_AUTH_KEY);
			setHavePermission(
				haveUserPermission === null
					? null
					: haveUserPermission === "true"
						? true
						: false,
			);
		})();
	}, []);

	const renderBiometricIcon = () => {
		if (Platform.OS === "ios") {
			let iconSource;
			if (biometricType === "facial_recognition") {
				iconSource = require("../../assets/img/face-id.png");
			} else if (biometricType === "fingerprint") {
				iconSource = require("../../assets/img/touch-id.png");
			}
			return iconSource ? <Icon transition={0} source={iconSource} /> : null;
		} else if (biometricType === "iris") {
			return (
				<Icon transition={0} source={require("../../assets/img/iris.png")} />
			);
		} else {
			return <MaterialCommunityIcons name="face-recognition" size={30} />;
		}
	};

	const onSubmit = async () => {
		const result = await authenticateAsync();
		if (result.success) {
			handleLoginBiometric(loginSource);
		}
	};

	return (
		<>
			{isBiometricAvailable && havePermission && (
				<Button onPress={onSubmit}>
					{loginBiometricLoading ? (
						<ActivityIndicator />
					) : (
						renderBiometricIcon()
					)}
				</Button>
			)}
		</>
	);
};

interface Props {
	loginSource: string;
}
