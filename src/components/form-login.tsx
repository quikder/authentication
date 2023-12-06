import { Button, TextInput } from "verity-ui";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import React from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "styled-components/native";
import { useAuth } from "../services/context/auth.context";
import { useSession } from "../services/context/session.context";
import type { FormLoginDataType, LoginSourceType } from "../types";
import { AppleButton, BiometricButton, GoogleButton } from "./social-buttons";
import { ContentForgot, Form, SocialContainer, SocialRow } from "./styled";

export const FormLogin: React.FC<Props> = ({
	loginSource,
	useSocialButtons,
}) => {
	const { navigate } = useNavigation<any>();
	const theme = useTheme();

	const { control, handleSubmit } = useForm<FormLoginDataType>({
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const { isBiometricAvailable, userHavePermissionBiometric } = useAuth();
	const { handleLogin, loginLoading } = useSession();

	const onSubmit = async (data: FormLoginDataType) => {
		handleLogin({
			email: data.email,
			password: data.password,
			loginSource: loginSource,
		});
	};

	return (
		<>
			<Form>
				<TextInput
					label={t("auth.email")}
					leftIcon="at"
					autoCapitalize="none"
					keyboardType="email-address"
					autoComplete="email"
					name="email"
					control={control}
					rules={{
						required: t("auth.error.required.email"),
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
							message: t("auth.error.valid.email"),
						},
					}}
				/>

				<TextInput
					label={t("auth.password")}
					leftIcon="lock"
					autoCapitalize="none"
					isPassword={true}
					name="password"
					control={control}
					rules={{
						required: t("auth.error.required.password"),
					}}
				/>

				<ContentForgot>
					<TouchableOpacity onPress={() => navigate("ForgotPasswordScreen")}>
						<Text
							style={{
								color: theme.colors.primary,
							}}
						>
							{t("auth.forgot-password")}
						</Text>
					</TouchableOpacity>
				</ContentForgot>

				<SocialContainer>
					{useSocialButtons ||
						(isBiometricAvailable && userHavePermissionBiometric && (
							<Text style={{ textAlign: "center" }}>
								{t("auth.login-social")}:
							</Text>
						))}
					<SocialRow>
						{useSocialButtons && (
							<>
								<GoogleButton />
								<AppleButton />
							</>
						)}
						<BiometricButton loginSource={loginSource} />
					</SocialRow>
				</SocialContainer>
			</Form>

			<Button onPress={handleSubmit(onSubmit)} loading={loginLoading}>
				{t("auth.login")}
			</Button>
		</>
	);
};

interface Props {
	loginSource: LoginSourceType;
	useSocialButtons?: boolean;
}
