import { Loading } from "verity-quik";
import React, {
	useContext,
	useEffect,
	useState,
} from "react";
import {
	ACCESS_TOKEN_KEY,
	REFRESH_TOKEN_KEY,
	USE_BIOMETRIC_AUTH_KEY,
} from "../../constants/keys";
import { getDeviceIdentifier } from "../../utils/getDeviceIdentifier";
import {
	getBiometricType,
	isLocalAuthAvailable,
} from "../../utils/local-authentication";

import type {
	BiometricType,
} from "../../utils/local-authentication";
import { getAsyncStorage, getEncryptedData } from "../../utils/storage";

const AuthContext = React.createContext<AuthContextInterface>({
	loading: true,
	accessToken: null,
	setAccessToken: () => { },
	refreshToken: null,
	setRefreshToken: () => { },
	isUserAuthenticated: false,
	setIsUserAuthenticated: () => { },
	deviceIdentifier: "",
	isBiometricAvailable: false,
	biometricType: null,
	userHavePermissionBiometric: null,
});

export function useAuth() {
	const value = useContext(AuthContext);

	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error("useSession must be wrapped in a <SessionProvider />");
		}
	}
	return value;
}

export const AuthProvider: React.FC = (props) => {
	//First Loading
	const [loading, setLoading] = useState<boolean>(true);
	//User credentials
	const [accessToken, setAccessToken] = useState<TokenType>(null);
	const [refreshToken, setRefreshToken] = useState<TokenType>(null);
	const [isUserAuthenticated, setIsUserAuthenticated] =
		useState<boolean>(false);

	//Device Identifier
	const [deviceIdentifier, setdeviceIdentifier] = useState<string | null>(null);

	//Biometric
	const [isBiometricAvailable, setIsBiometicAvailable] =
		useState<boolean>(false);
	const [biometricType, setBiometricType] = useState<BiometricType | null>(
		null,
	);
	const [userHavePermissionBiometric, setUserHavePermissionBiometric] =
		useState<boolean | null>(null);

	useEffect(() => {
		(async () => {
			//User credentials
			const accessToken = await getEncryptedData(ACCESS_TOKEN_KEY);
			setAccessToken(accessToken);

			setIsUserAuthenticated(!!accessToken);

			const refreshToken = await getEncryptedData(REFRESH_TOKEN_KEY);
			setRefreshToken(refreshToken);

			//Device Identifier
			const deviceIdentifier = await getDeviceIdentifier();
			setdeviceIdentifier(deviceIdentifier);

			//Biometric
			const isBiometricAuthAvailable = await isLocalAuthAvailable();
			setIsBiometicAvailable(isBiometricAuthAvailable);

			if (isBiometricAuthAvailable) {
				const fetchedBiometricType = await getBiometricType();
				setBiometricType(fetchedBiometricType);
			}

			const haveUserPermission = await getAsyncStorage(USE_BIOMETRIC_AUTH_KEY);
			setUserHavePermissionBiometric(
				haveUserPermission === null
					? null
					: haveUserPermission === "true"
						? true
						: false,
			);

			await setLoading(false);
		})();
	}, []);

	if (loading) return <Loading />;

	return (
		<AuthContext.Provider
			value={{
				loading,
				accessToken,
				setAccessToken,
				refreshToken,
				setRefreshToken,
				isUserAuthenticated,
				setIsUserAuthenticated,
				deviceIdentifier,
				isBiometricAvailable,
				biometricType,
				userHavePermissionBiometric,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}

interface AuthContextInterface {
	loading: boolean;
	accessToken: TokenType;
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	refreshToken: TokenType;
	setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
	isUserAuthenticated: boolean;
	setIsUserAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	deviceIdentifier: string | null;
	isBiometricAvailable: boolean;
	biometricType: BiometricType | null;
	userHavePermissionBiometric: boolean | null;
}

type TokenType = string | null;
