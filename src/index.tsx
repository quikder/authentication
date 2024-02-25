import { BiometricItem } from "./components/biometric-item";
import { BiometricModal } from "./components/biometric-modal";
import { Devices } from "./components/devices";
import { FormChangePassword } from "./components/form-change-password";
import { FormLogin } from "./components/form-login";
import { FormRecoverPassword } from "./components/form-recover-password";
import { FormRegister } from "./components/form-register";
import { Header } from "./components/header";
import { PortalSuggestion } from "./components/portal-suggestion";
import { restaurantCategoriesEs } from "./constants/categories";
import { ApolloProvider } from "./services/context/apollo.context";
import { AuthProvider, useAuth } from "./services/context/auth.context";
import {
	SessionProvider,
	useSession,
} from "./services/context/session.context";
import translation from "./translations";

export {
	ApolloProvider,
	AuthProvider,
	FormLogin,
	FormRegister,
	Header,
	SessionProvider,
	restaurantCategoriesEs,
	useAuth,
	useSession,
	BiometricModal,
	Devices,
	FormChangePassword,
	BiometricItem,
	FormRecoverPassword,
	PortalSuggestion,
	translation,
};

