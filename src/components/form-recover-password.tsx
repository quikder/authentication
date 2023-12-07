import { Button, Layout, TextInput, ToastUi } from "verity-quik";
import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { RECOVER_PASSORD } from "../services/graphql/mutation";
import React from "react";

export const FormRecoverPassword = () => {
	const { navigate } = useNavigation<any>();
	const { control, watch, handleSubmit } = useForm<FormInterface>({
		defaultValues: {
			code: "",
			password: "",
			confirmPassword: "",
		},
	});

	const [recover, { loading }] = useMutation(RECOVER_PASSORD, {
		update(_, { data: { recoverPassword } }) {
			if (recoverPassword?.success) {
				Toast.show({
					type: "success",
					text1: t("success.title"),
					text2: t("auth.success.recover-password"),
				});
				navigate("LoginScreen");
			} else if (recoverPassword?.error === "no-exist") {
				Toast.show({
					type: "error",
					text1: t("error.title"),
					text2: t("auth.error.recover-password"),
				});
			}
		},
	});
	const onSubmit = (data: FormInterface) => {
		recover({
			variables: {
				code: data.code,
				password: data.password,
			},
		});
	};

	return (
		<Layout back title={t("auth.recover-password")} customTop={-1}>
			<ToastUi isModal />
			<TextInput
				control={control}
				name="code"
				label={t("auth.code")}
				rules={{
					required: t("auth.error.required.code"),
				}}
			/>

			<TextInput
				control={control}
				name="password"
				label={t("auth.password")}
				rules={{
					required: t("auth.error.required.password"),
				}}
			/>

			<TextInput
				control={control}
				name="confirmPassword"
				label={t("auth.confirm-password")}
				rules={{
					required: t("auth.error.required.confirm-password"),
					validate: (value: string) =>
						value === watch("password") ||
						t("auth.error.valid.confirm-password"),
				}}
			/>

			<Button
				mode="contained"
				onPress={handleSubmit(onSubmit)}
				style={{ marginTop: 10 }}
				loading={loading}
			>
				{t("auth.change-password")}
			</Button>
		</Layout>
	);
};

interface FormInterface {
	code: string;
	password: string;
	confirmPassword: string;
}
