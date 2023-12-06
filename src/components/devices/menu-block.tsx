import { Button, CodeInput, useWidth } from "verity-ui";
import { t } from "i18next";
import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { Menu, Modal, Portal, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import type { ItemProps } from "./item-type";

export const MenuBlock: React.FC<ItemProps> = ({
	modelName,
	deviceId,
	closeMenu,
	sendCode,
	verify,
	loadingVerify,
}) => {
	console.log(modelName);

	const { width } = useWindowDimensions();
	const [code, setCode] = useState<string>("");

	const [visible, setVisible] = useState<boolean>(false);

	const showModal = () => {
		//@ts-ignore
		sendCode({
			//@ts-ignore
			async update(_, { data: { sendLockCode } }) {
				if (sendLockCode?.success) {
					setVisible(true);
				}
			},
			variables: {
				deviceId,
			},
		});
		setCode("");
	};
	const hideModal = () => {
		setVisible(false);
		closeMenu();
	};

	const _handleVerify = () => {
		//@ts-ignore
		verify({
			//@ts-ignore
			update(_, { data: { verifyLockCode } }) {
				if (verifyLockCode?.success) {
					hideModal();
					closeMenu();
					Toast.show({
						type: "success",
						text1: t("success.title"),
						text2: t("auth.success.lock-code", { modelName }),
					});
				} else {
					Toast.show({
						type: "error",
						text1: t("error.title"),
						text2: t("auth.error.lock-code"),
					});
				}
			},
			variables: {
				deviceId,
				code,
			},
		});
	};

	return (
		<>
			<Menu.Item
				leadingIcon="block-helper"
				onPress={showModal}
				title={t("auth.block", { modelName })}
			/>

			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					style={{ alignItems: "center" }}
					contentContainerStyle={{
						width: useWidth(width, "95%", "90%", "50%", "50%", "35%"),
						backgroundColor: "white",
						padding: 20,
						borderRadius: 5,
					}}
				>
					<Text variant="titleMedium">{t("auth.block", { modelName })}</Text>
					<Text>{t("auth.block-info")}</Text>

					<CodeInput value={code} setValue={setCode} />

					<Button
						mode="contained"
						onPress={_handleVerify}
						disabled={code.length < 6}
						loading={loadingVerify}
					>
						{t("auth.make-block")}
					</Button>
				</Modal>
			</Portal>
		</>
	);
};
