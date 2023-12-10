import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";
import React from "react";
import { Button, Icon } from "./styled";

export const AppleButton = () => {
	const [isAvailable, setIsAvailable] = useState(false);

	useEffect(() => {
		(async () => {
			const isAvailable = await AppleAuthentication.isAvailableAsync();
			setIsAvailable(isAvailable);
		})();
	});

	return (
		<>
			{isAvailable && (
				<Button
					onPress={async () => {
						try {
							//@ts-ignore
							const credential = await AppleAuthentication.signInAsync({
								requestedScopes: [
									AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
									AppleAuthentication.AppleAuthenticationScope.EMAIL,
								],
							});

							console.log(credential);
						} catch (e: any) {
							if (e.code === "ERR_REQUEST_CANCELED") {
							}
						}
					}}
				>
					<Icon transition={0} source={require("../../assets/img/apple.png")} />
				</Button>
			)}
		</>
	);
};
