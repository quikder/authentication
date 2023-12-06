import { randomUUID } from "expo-crypto";
import { DEVICE_IDENTIFIER_KEY } from "../constants/keys";
import { getEncryptedData, saveEncryptedData } from "./storage";

export async function getDeviceIdentifier(): Promise<string> {
	const key = DEVICE_IDENTIFIER_KEY;
	let identifier = await getEncryptedData(key);

	if (identifier === null || identifier === undefined) {
		identifier = `${randomUUID().replaceAll("-", "")}${randomUUID()
			.substring(0, 16)
			.replaceAll("-", "")}`;
		await saveEncryptedData(key, identifier);
	}

	return identifier;
}
