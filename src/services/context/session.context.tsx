//@ts-ignore
import { useMutation } from "@apollo/client";
import { t } from "i18next";
import { createContext, useContext } from "react";
import Toast from "react-native-toast-message";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants/keys";
import type { LoginType, RegisterType } from "../../types";
import { getDeviceInput } from "../../utils/getDeviceInput";
import { removeEncryptedData, saveEncryptedData } from "../../utils/storage";
import { LOGIN, LOGIN_BIOMETRIC, REGISTER } from "../graphql/mutation";
import { useAuth } from "./auth.context";
import React from 'react';

export const SessionContext = createContext<SessionProps>({
	//@ts-ignore
	handleRegister: async (formData) => { },
	registerLoading: false,
	//@ts-ignore
	handleLogin: async (formData) => { },
	loginLoading: false,
	//@ts-ignore
	handleLoginBiometric: async (loginSource) => { },
	loginBiometricLoading: false,
	handleLogout: async () => { },
});

export function useSession() {
	const value = useContext(SessionContext);

	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error("useSession must be wrapped in a <SessionProvider />");
		}
	}
	return value;
}

export const SessionProvider: React.FC = (props) => {
	const {

		deviceIdentifier,
		setAccessToken,
		setRefreshToken,
		setIsUserAuthenticated,
	} = useAuth();

	const saveUserCredentials = (mutationData: MutationData) => {
		if (mutationData?.success) {
			//Access Token
			setAccessToken(mutationData.accessToken);
			saveEncryptedData(ACCESS_TOKEN_KEY, mutationData.accessToken);
			//Refresh Token
			setRefreshToken(mutationData.refreshToken);
			saveEncryptedData(REFRESH_TOKEN_KEY, mutationData.refreshToken);

			setIsUserAuthenticated(true);
		} else {
			const errorType = `auth.error.${errorsFind(
				//@ts-ignore
				JSON.parse(mutationData?.error),
			)}`;

			Toast.show({
				type: "error",
				text1: t("error.title"),
				text2: t(errorType),
			});
		}
	};

	//Register
	const [registerAction, { loading: registerLoading }] = useMutation(REGISTER);
	const handleRegister = async (formData: RegisterType): Promise<void> => {
		const inputDevice = await getDeviceInput(deviceIdentifier);

		const name = formData.name.split(" ");

		const inputUser = {
			firstName: name[0],
			lastName: name[1],
			email: formData.email,
			password: formData.password,
			role: formData.role,
		};

		registerAction({
			//@ts-ignore
			update(_, { data: { registerUser } }) {
				saveUserCredentials(registerUser);
			},
			variables: {
				inputDevice,
				inputUser,
			},
		});
	};

	const [loginAction, { loading: loginLoading }] = useMutation(LOGIN);
	const handleLogin = async (formData: LoginType): Promise<void> => {
		const inputDevice = await getDeviceInput(deviceIdentifier);

		loginAction({
			//@ts-ignore
			update(_, { data: { loginUser } }) {
				saveUserCredentials(loginUser);
			},
			variables: {
				email: formData.email,
				password: formData.password,
				loginSource: formData.loginSource,
				inputDevice,
			},
		});
	};

	const [loginBiometricAction, { loading: loginBiometricLoading }] =
		useMutation(LOGIN_BIOMETRIC);
	const handleLoginBiometric = async (loginSource: string): Promise<void> => {
		loginBiometricAction({
			//@ts-ignore
			update(_, { data: { loginBiometric } }) {
				saveUserCredentials(loginBiometric);
			},
			variables: {
				identifier: deviceIdentifier,
				loginSource: loginSource,
			},
		});
	};

	//Logout
	const handleLogout = async (): Promise<void> => {
		//Access Token
		setAccessToken(null);
		removeEncryptedData(ACCESS_TOKEN_KEY);
		//Refresh Token
		setRefreshToken(null);
		removeEncryptedData(REFRESH_TOKEN_KEY);

		setIsUserAuthenticated(false);
	};

	// if (accessToken) {
	// 	const decodedToken = jwtDecode(accessToken);
	// 	console.log(decodedToken);
	// }

	// console.log(jwtDecode(`${accessToken}`));

	return (
		<SessionContext.Provider
			value={{
				handleRegister,
				registerLoading,
				handleLogin,
				loginLoading,
				handleLoginBiometric,
				loginBiometricLoading,
				handleLogout,
			}}
		>
			{props.children}
		</SessionContext.Provider>
	);
}

const errorsFind = (error: ErrorsType) => {
	if (error?.unique_email) {
		return "unique-email";
	} else if (error?.invalid_credentials) {
		return "invalid-credentials";
	}
	return ''
};

interface SessionProps {
	handleRegister: (formData: RegisterType) => Promise<void>;
	registerLoading: boolean;
	handleLogin: (formData: LoginType) => Promise<void>;
	loginLoading: boolean;
	handleLoginBiometric: (loginSource: string) => Promise<void>;
	loginBiometricLoading: boolean;
	handleLogout: () => Promise<void>;
}

interface MutationData {
	accessToken: string;
	refreshToken: string;
	success: boolean;
	error: object;
}

interface ErrorsType {
	unique_email: boolean;
	invalid_credentials: boolean;
}
