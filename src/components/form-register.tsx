import { TextInput } from "verity-quik";
import { t } from "i18next";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "react-native-paper";
import { useSession } from "../services/context/session.context";
import type { FormRegisterDataType, LoginSourceType } from "../types";
import { AppleButton, GoogleButton } from "./social-buttons";
import { Form, SocialContainer, SocialRow } from "./styled";

export const FormRegister: React.FC<Props> = ({
	loginSource,
	useSocialButton,
}) => {
	const { handleRegister, registerLoading } = useSession();

	const { control, handleSubmit, watch } = useForm<FormRegisterDataType>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: FormRegisterDataType) => {
		handleRegister({
			...data,
			role: loginSource,
		});
	};

	return (
		<>
			<Form>
				<TextInput
					label={t("auth.full-name")}
					leftIcon="account"
					autoCapitalize="none"
					autoComplete="name"
					name="name"
					control={control}
					rules={{
						required: t("auth.error.required.full-name"),
						pattern: {
							value: /^[^\d\s]+(\s+[^\d\s]+)+$/,
							message: t("auth.error.valid.name"),
						},
					}}
				/>

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

				<TextInput
					label={t("auth.confirm-password")}
					leftIcon="lock"
					autoCapitalize="none"
					autoComplete="email"
					isPassword={true}
					name="confirmPassword"
					control={control}
					rules={{
						required: t("auth.error.required.confirm-password"),
						validate: (value: string) =>
							value === watch("password") ||
							t("auth.error.valid.confirm-password"),
					}}
				/>

				{useSocialButton && (
					<SocialContainer>
						<Text style={{ textAlign: "center" }}>
							{t("auth.register-social")}:
						</Text>
						<SocialRow>
							<GoogleButton />
							<AppleButton />
						</SocialRow>
					</SocialContainer>
				)}
			</Form>

			<Button
				mode="contained"
				onPress={handleSubmit(onSubmit)}
				style={{ marginTop: 5 }}
				loading={registerLoading}
			>
				{t("auth.register")}
			</Button>
		</>
	);
};

interface Props {
	loginSource: LoginSourceType;
	useSocialButton?: boolean;
}
