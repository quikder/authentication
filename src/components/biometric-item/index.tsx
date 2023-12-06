import { authenticateAsync } from "expo-local-authentication";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { List, Switch } from "react-native-paper";
import { useTheme } from "styled-components/native";
import { USE_BIOMETRIC_AUTH_KEY } from "../../constants/keys";
import { useAuth } from "../../services/context/auth.context";
import { getAsyncStorage, saveAsyncStorage } from "../../utils/storage";
import { Icon } from "./Icon";
import React from "react";

export const BiometricItem = () => {
	const theme = useTheme();
	const { isBiometricAvailable, biometricType } = useAuth();

	const [havePermission, setHavePermission] = useState<boolean | null>(false);

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

	const title =
		biometricType === "facial_recognition"
			? Platform.OS === "ios"
				? t("auth.face-id")
				: t("auth.facial-recognition")
			: biometricType === "fingerprint"
				? Platform.OS === "ios"
					? t("auth.touch-id")
					: t("auth.fingerprint")
				: t("dine.iris");

	const onToggleSwitch = async () => {
		const result = await authenticateAsync();
		if (result.success) {
			const newValue = !havePermission ? "true" : "false";
			saveAsyncStorage(USE_BIOMETRIC_AUTH_KEY, newValue);
			setHavePermission(!havePermission);
		}
	};

	return (
		<>
			{isBiometricAvailable && (
				<List.Item
					title={title}
					description={t("auth.login-biometric")}
					descriptionStyle={{ fontSize: 10 }}
					left={(props) => <Icon {...props} />}
					right={(props) => (
						<Switch
							{...props}
							value={havePermission ? havePermission : false}
							onValueChange={onToggleSwitch}
							color={theme.colors.primary}
						/>
					)}
				/>
			)}
		</>
	);
};
