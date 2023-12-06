import { useMutation } from "@apollo/client";
import { t } from "i18next";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { IconButton, Menu, Text } from "react-native-paper";
import { useAuth } from "../../services/context/auth.context";
import {
	LOGOUT_DEVICE,
	SEND_LOCK_CODE,
	VERIFY_LOCK_CODE,
} from "../../services/graphql/mutation";
import type { DeviceType } from "../../types";
import { Image } from "./img";
import { MenuBlock } from "./menu-block";
import { MenuLogout } from "./menu-logout";
import {
	Box,
	ContentMenu,
	ImgContent,
	Info,
	InfoContext,
	Row,
	Status,
} from "./styled";
import React from "react";

export const Item: React.FC<DeviceType> = ({
	id,
	identifier,
	brand,
	modelName,
	deviceType,
	ipAddress,
	isBlocked,
	isLogin,
}) => {
	const { width } = useWindowDimensions();
	const { deviceIdentifier } = useAuth();

	//Menu
	const [visible, setVisible] = useState<boolean>(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	const [logoutDevice] = useMutation(LOGOUT_DEVICE);
	const [sendCode] = useMutation(SEND_LOCK_CODE);
	const [verify, { loading: loadingVerify }] = useMutation(VERIFY_LOCK_CODE);

	return (
		<Box $width={width}>
			<ImgContent>
				<Image type={deviceType} />
			</ImgContent>

			<InfoContext>
				<Row>
					<Text variant="titleMedium">{t("auth.brand")}:</Text>
					<Info variant="bodyLarge">
						{brand.charAt(0).toUpperCase() + brand.slice(1)}
					</Info>
				</Row>
				<Row>
					<Text variant="titleMedium">{t("auth.device-model")}:</Text>
					<Info variant="bodyLarge">{modelName}</Info>
				</Row>
				<Row>
					<Text variant="titleMedium">{t("auth.ip-address")}:</Text>
					<Info variant="bodyLarge" style={{ textDecorationLine: "underline" }}>
						{ipAddress}
					</Info>
				</Row>
				<Status status={isBlocked ? "blocked" : isLogin ? "active" : "logout"}>
					{isBlocked
						? t("auth.blocked")
						: isLogin
							? t("auth.active")
							: t("auth.logged-out")}
				</Status>
			</InfoContext>

			{deviceIdentifier !== identifier && (
				<ContentMenu>
					<Menu
						visible={visible}
						onDismiss={closeMenu}
						anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
					>
						{isLogin && (
							<MenuLogout
								deviceId={id}
								modelName={modelName}
								closeMenu={closeMenu}
								logoutDevice={logoutDevice}
							/>
						)}
						{!isBlocked && (
							<MenuBlock
								deviceId={id}
								modelName={modelName}
								closeMenu={closeMenu}
								sendCode={sendCode}
								verify={verify}
								loadingVerify={loadingVerify}
							/>
						)}
					</Menu>
				</ContentMenu>
			)}
		</Box>
	);
};
