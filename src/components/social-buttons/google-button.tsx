import React from "react";
import { Button, Icon } from "./styled";

export const GoogleButton = () => {
	return (
		<Button>
			<Icon transition={0} source={require("../../assets/img/google.png")} />
		</Button>
	);
};
