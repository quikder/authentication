import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type DeviceType = false | "unknown" | "phone" | "tablet" | "desktop" | "tv";
type OsType = "iOS" | "Android";

interface DeviceReturn {
	identifier: string;
	brand: string | null;
	operativeSystem: OsType;
	deviceName: string | null;
	modelName: string | null;
	deviceType: DeviceType;
	notifyToken: string;
}

export async function getDeviceInput(
	identifier: string | null,
): Promise<DeviceReturn> {
	let token: string | null = null;

	try {
		const response = await Notifications.getExpoPushTokenAsync({
			projectId: Constants?.expoConfig?.extra?.eas.projectId,
		});

		token = response.data;
	} catch (err) {
		token = "None";
	}

	const deviceType = await Device.getDeviceTypeAsync();
	const newIdentifier = identifier ? identifier : "";
	return {
		identifier: newIdentifier,
		brand: Device.brand,
		operativeSystem: Platform.OS === "ios" ? "iOS" : "Android",
		deviceName: Platform.OS === "ios" ? Device.deviceName : Device.modelName,
		modelName: Device.modelName,
		deviceType:
			deviceType === 0
				? "unknown"
				: deviceType === 1
				? "phone"
				: deviceType === 2
				? "tablet"
				: deviceType === 3
				? "desktop"
				: deviceType === 4 && "tv",
		notifyToken: token,
	};
}
