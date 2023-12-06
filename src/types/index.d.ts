interface FormRegisterDataType {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface RegisterType extends FormRegisterDataType {
	role: string;
}

export interface PropsComponent {
	children: React.ReactNode;
}

interface FormLoginDataType {
	email: string;
	password: string;
}

interface LoginType extends FormLoginDataType {
	loginSource: LoginSourceType;
}

interface ChangePasswordType {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

type LoginSourceType = "customer" | "owner" | "employee" | "chef";

interface DeviceType {
	identifier: string;
	id: string;
	brand: string;
	deviceName: string;
	deviceType: string;
	ipAddress: string;
	isBlocked: boolean;
	isLogin: boolean;
	modelName: string;
	operativeSystem: string;
}
