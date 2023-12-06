import * as Bowser from "bowser";
import * as Device from "expo-device";

type DeviceType = false | "unknown" | "phone" | "tablet" | "desktop" | "tv";
type OsType = "iOS" | "Android" | "Windows" | "MacOs";

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
	identifier: string,
): Promise<DeviceReturn> {
	//@ts-ignore
	const browser = Bowser.getParser(window.navigator.userAgent);
	const deviceType = await Device.getDeviceTypeAsync();

	return {
		identifier,
		brand: "browser",
		//@ts-ignore
		operativeSystem: browser.getOS().name,
		deviceName: `${browser.getBrowser().name}`,
		modelName: `${browser.getBrowser().name} - ${browser.getBrowser().version}`,
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
		notifyToken: "None",
	};
}
