import React from "react";
import { FormAdd } from "./form-add";
import { List } from "./list";

export const PortalSuggestion: React.FC<Props> = ({
	loginSource,
	modalVisible,
	setModalVisible,
}) => {
	return (
		<>
			<List loginSource={loginSource} />

			<FormAdd
				loginSource={loginSource}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			/>
		</>
	);
};

interface Props {
	loginSource: string;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
