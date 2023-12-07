import { TextInput } from "verity-quik";
import { useMutation } from "@apollo/client";
import { t } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { Button, TextInput as DefaultInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { CHANGE_PASSWORD } from "../services/graphql/mutation";
import type { ChangePasswordType } from "../types";
import { Form } from "./styled";
import React from "react";

export const FormChangePassword = () => {
	const [errorCurrentPassword, setErrorCurrentPassword] =
		useState<boolean>(false);

	const { control, watch, handleSubmit, reset } = useForm<ChangePasswordType>({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const [change, { loading }] = useMutation(CHANGE_PASSWORD);
	const onSubmit = async (data: ChangePasswordType) => {
		change({
			update(_, { data: { changePassword } }) {
				if (changePassword.success) {
					reset();
					Toast.show({
						type: "success",
						text1: t("success.title"),
						text2: t("auth.success.change-password"),
					});
					setErrorCurrentPassword(false);
				} else {
					console.log(changePassword);
					if (changePassword?.errors === "invalid-password") {
						setErrorCurrentPassword(true);
					} else if (changePassword?.errors === "same-password") {
						setErrorCurrentPassword(false);
						Toast.show({
							type: "error",
							text1: t("error.title"),
							text2: t("auth.error.same-password"),
						});
					}
				}
			},
			variables: {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			},
		});
	};

	return (
		<Form>
			<ScrollView>
				<TextInput
					mode="flat"
					name="currentPassword"
					control={control}
					label={t("auth.current-password")}
					isPassword={true}
					error={errorCurrentPassword}
					helperText={
						errorCurrentPassword ? t("auth.error.current-password") : ""
					}
					rules={{
						required: t("auth.error.required.current-password"),
					}}
					left={<DefaultInput.Icon icon="lock" />}
				/>

				<TextInput
					mode="flat"
					name="newPassword"
					control={control}
					label={t("auth.new-password")}
					isPassword={true}
					rules={{
						required: t("auth.error.required.password"),
					}}
					left={<DefaultInput.Icon icon="lock" />}
				/>

				<TextInput
					mode="flat"
					name="confirmNewPassword"
					control={control}
					label={t("auth.confirm-password")}
					isPassword={true}
					rules={{
						required: t("auth.error.required.password"),
						validate: (value: string) =>
							value === watch("newPassword") ||
							t("auth.error.valid.confirm-password"),
					}}
					left={<DefaultInput.Icon icon="lock" />}
				/>

				<Button
					mode="contained"
					onPress={handleSubmit(onSubmit)}
					style={{ marginTop: 10 }}
					loading={loading}
				>
					{t("auth.change-password")}
				</Button>
			</ScrollView>
		</Form>
	);
};
