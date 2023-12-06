import { t } from "i18next";
import React from "react";
import { Menu } from "react-native-paper";
import type { ItemProps } from "./item-type";

export const MenuLogout: React.FC<ItemProps> = ({
	deviceId,
	modelName,
	closeMenu,
	logoutDevice,
}) => {
	const _handleLogout = () => {
		//@ts-ignore
		logoutDevice({
			//@ts-ignore
			update(_, { data: { logoutDevice } }) {
				if (logoutDevice?.status) {
					closeMenu();
				}
			},
			variables: {
				deviceId,
			},
		});
	};

	return (
		<Menu.Item
			leadingIcon="logout"
			onPress={_handleLogout}
			title={t("auth.logout-device", { modelName })}
		/>
	);
};
