//@ts-ignore
import { useMutation } from "@apollo/client";
import { t } from "i18next";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Loading } from "verity-quik";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants/keys";
import type { LoginType, PropsComponent, RegisterType } from "../../types";
import { getDeviceInput } from "../../utils/getDeviceInput";
import { removeEncryptedData, saveEncryptedData } from "../../utils/storage";
import {
	LOGIN,
	LOGIN_BIOMETRIC,
	LOGOUT,
	REFRESH_TOKE,
	REGISTER,
} from "../graphql/mutation";
import { useAuth } from "./auth.context";

export const SessionContext = createContext<SessionProps>({
	//@ts-ignore
	handleRegister: async (formData) => {},
	registerLoading: false,
	//@ts-ignore
	handleLogin: async (formData) => {},
	loginLoading: false,
	//@ts-ignore
	handleLoginBiometric: async (loginSource) => {},
	loginBiometricLoading: false,
	handleLogout: async () => {},
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

export const SessionProvider: React.FC<PropsComponent> = (props) => {
	const {
		accessToken,
		refreshToken,
		deviceIdentifier,
		setAccessToken,
		setRefreshToken,
		setIsUserAuthenticated,
	} = useAuth();

	const [isRefreshReady, setIsRefreshReady] = useState<boolean>(false);
	const [loadin, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			if (accessToken) {
				const decodedToken = jwtDecode(accessToken);
				//@ts-ignore
				if (moment(decodedToken.exp * 1000).isBefore(moment())) {
					handleLogout();
					Alert.alert(
						t("auth.session-expired"),
						t("auth.session-expired-message"),
						[{ text: t("auth.ok") }],
					);
				} else {
					//@ts-ignore
					const tokenExpiration = moment(decodedToken.exp * 1000);
					const now = moment();
					const timeLeft = moment.duration(tokenExpiration.diff(now));
					const oneDay = moment.duration(1, "day");

					if (timeLeft < oneDay) {
						if (!isRefreshReady) {
							handleRefreshToken();
						}
					}
				}
			}

			await setLoading(false);
		})();
	}, []);

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
	const [logoutAction] = useMutation(LOGOUT, {
		update(_, { data: { logout } }) {
			if (logout?.success) {
				//Access Token
				setAccessToken(null);
				removeEncryptedData(ACCESS_TOKEN_KEY);
				//Refresh Token
				setRefreshToken(null);
				removeEncryptedData(REFRESH_TOKEN_KEY);
				setIsUserAuthenticated(false);
			} else {
				Toast.show({
					type: "error",
					text1: t("error.title"),
					text2: t("auth.error.logout"),
				});
			}
		},
	});
	const handleLogout = async (): Promise<void> => {
		logoutAction({
			variables: {
				deviceIdentifier,
			},
		});
	};

	//RefreshToken

	const [refresh] = useMutation(REFRESH_TOKE, {
		update(_, { data: { refreshToken } }) {
			if (refreshToken?.success) {
				saveUserCredentials(refreshToken);
				setIsRefreshReady(true);
			}
		},
	});
	const handleRefreshToken = () => {
		refresh({
			variables: {
				refreshToken,
			},
		});
	};

	if (loadin) return <Loading />;

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
};

const errorsFind = (error: ErrorsType) => {
	if (error?.unique_email) {
		return "unique-email";
	} else if (error?.invalid_credentials) {
		return "invalid-credentials";
	} else if (error?.no_permition) {
		return "invalid-credentials";
	}
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
	no_permition: boolean;
}
