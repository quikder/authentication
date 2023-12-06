import {
	getEnrolledLevelAsync,
	hasHardwareAsync,
	isEnrolledAsync,
	supportedAuthenticationTypesAsync,
} from "expo-local-authentication";

export const isLocalAuthAvailable = async (): Promise<boolean> => {
	try {
		const [hasHardware, enrolledLevel, isEnrolled] = await Promise.all([
			hasHardwareAsync(),
			getEnrolledLevelAsync(),
			isEnrolledAsync(),
		]);

		return hasHardware && enrolledLevel === 2 && isEnrolled;
	} catch (error) {
		console.error("An error occurred:", error);
		return false; // Handle errors appropriately based on your use case
	}
};

export const getBiometricType = async (): Promise<BiometricType> => {
	try {
		const supportedTypes = await supportedAuthenticationTypesAsync();

		if (supportedTypes.includes(1)) {
			return "fingerprint";
		} else if (supportedTypes.includes(2)) {
			return "facial_recognition";
		} else if (supportedTypes.includes(3)) {
			return "iris";
		} else {
			return null;
		}
	} catch (error) {
		console.error("An error occurred:", error);
		return null;
	}
};

export type BiometricType =
	| "fingerprint"
	| "facial_recognition"
	| "iris"
	| null;
