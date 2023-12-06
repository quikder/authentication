import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	deleteItemAsync,
	getItemAsync,
	isAvailableAsync,
	setItemAsync,
} from "expo-secure-store";

export const saveAsyncStorage = async (
	key: string,
	value: string,
): Promise<void> => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (error) {
		console.error("Error saving async storage data");
	}
};

export const getAsyncStorage = async (key: string): Promise<any> => {
	try {
		const value = await AsyncStorage.getItem(key);
		return value;
	} catch (error) {
		console.error("Error get async storage");
		return;
	}
};

export const removeAsyncStorage = async (key: string): Promise<void> => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (error) {
		console.error("Error deleting async storage");
	}
};

export const saveEncryptedData = async (
	key: string,
	value: string,
): Promise<void> => {
	try {
		const isAvailable = await isAvailableAsync();
		if (isAvailable) {
			await setItemAsync(key, value);
		} else {
			await saveAsyncStorage(key, value);
		}
	} catch (error) {
		console.error("Error saving encrypted data");
	}
};

export const getEncryptedData = async (key: string): Promise<any> => {
	try {
		const isAvailable = await isAvailableAsync();

		if (!isAvailable) {
			const storageValue = await getAsyncStorage(key);
			return storageValue;
		}

		const value = await getItemAsync(key);
		return value;
	} catch (error) {}
};

export const removeEncryptedData = async (key: string): Promise<void> => {
	try {
		const isAvailable = await isAvailableAsync();

		if (isAvailable) {
			await deleteItemAsync(key);
		} else {
			await removeAsyncStorage(key);
		}
	} catch (error) {
		console.error("error removing encrypted data");
	}
};
