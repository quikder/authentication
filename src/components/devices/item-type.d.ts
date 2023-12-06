export interface ItemProps {
	deviceId: string;
	modelName: string;
	closeMenu: () => void;
	logoutDevice?: () => void;
	sendCode?: () => void;
	verify?: () => void;
	loadingVerify?: boolean;
}
