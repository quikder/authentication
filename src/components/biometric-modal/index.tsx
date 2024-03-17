//@ts-nocheck
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Modal, useWindowDimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "styled-components/native";
import { USE_BIOMETRIC_AUTH_KEY } from "../../constants/keys";
import { useAuth } from "../../services/context/auth.context";
import { saveAsyncStorage } from "../../utils/storage";
import { Body, ButtonContent, Card, Header, Img } from "../styled-modals";


export const BiometricModal = () => {
	const theme = useTheme();
	const { width } = useWindowDimensions();

	//@ts-ignore
	const { isBiometricAvailable, userHavePermissionBiometric, biometricType } =
		useAuth();

	const isEnabled =
		isBiometricAvailable && userHavePermissionBiometric === null;
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	useEffect(() => {
		if (isEnabled) {
			setModalVisible(true);
		} else {
			setModalVisible(false);
		}
	}, [isEnabled]);

	const _handlePermissions = async (value: boolean) => {
		const newValue = value ? "true" : "false";
		saveAsyncStorage(USE_BIOMETRIC_AUTH_KEY, newValue);
		setModalVisible(false);
	};

	return (
		<Modal
			animationType={width > 768 ? "fade" : "slide"}
			visible={modalVisible}
			presentationStyle={width > 768 ? "overFullScreen" : "formSheet"}
			transparent={width > 768 ? true : false}
			supportedOrientations={['landscape', 'portrait']}
		>
			<Body $width={width}>
				<Card $width={width}>
					<Header>
						<Img
							$width={width}
							transition={0}
							source={require("../../assets/img/face-id.png")}
						/>
						<Text variant="titleMedium">
							{t("auth.permission.title.face-id")}
						</Text>
					</Header>

					<Text style={{ textAlign: "center" }}>
						{t("auth.permission.description.face-id")}
					</Text>

					<ButtonContent>
						<Button mode="contained" onPress={() => _handlePermissions(true)}>
							{t("auth.activate")}
						</Button>
						<Button
							textColor={theme.colors.info}
							onPress={() => _handlePermissions(false)}
						>
							{t("auth.skip")}
						</Button>
					</ButtonContent>
				</Card>
			</Body>
		</Modal>
	);
};
