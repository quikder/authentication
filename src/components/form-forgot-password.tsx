import { Button, Layout, TextInput, ToastUi } from "verity-quik";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import React from "react";
import { FORGOT_PASSWORD } from "../services/graphql/mutation";

export const FormForgotPassword = () => {
	const { navigate } = useNavigation<any>();
	const { control, handleSubmit } = useForm<InputInterface>({
		defaultValues: {
			email: "",
		},
	});

	const [send, { loading }] = useMutation(FORGOT_PASSWORD, {
		update(_, { data: { forgotPassword } }) {
			if (forgotPassword?.success) {
				Toast.show({
					type: "success",
					text1: t("success.title"),
					text2: t("auth.success.forgot-password"),
				});
				navigate("RecoverPasswordsScreen");
			} else {
				Toast.show({
					type: "error",
					text1: t("error.title"),
					text2: t("auth.error.forgot-password"),
				});
			}
		},
	});
	const onSubmit = (data: InputInterface) => {
		send({
			variables: {
				email: data.email,
			},
		});
	};

	return (
		<Layout back title={t("auth.forgot-password")} customTop={-1}>
			<TextInput
				control={control}
				name="email"
				rules={{
					required: t("auth.error.required.email"),
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
						message: t("auth.error.valid.email"),
					},
				}}
				placeholder={t("auth.email")}
				autoCapitalize="none"
				keyboardType="email-address"
			/>

			<Button
				style={{ marginTop: 15 }}
				loading={loading}
				onPress={handleSubmit(onSubmit)}
			>
				{t("auth.send")}
			</Button>

			<ToastUi isModal />
		</Layout>
	);
};

interface InputInterface {
	email: string;
}
