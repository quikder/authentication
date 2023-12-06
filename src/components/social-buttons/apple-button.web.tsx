import React from "react";
import { Button, Icon } from "./styled";

export const AppleButton = () => {
	return (
		<>
			<Button>
				<Icon transition={0} source={require("../../assets/img/apple.png")} />
			</Button>
		</>
	);
};
