import { Button, TextInput, useWidth } from "verity-quik";
import { useMutation } from "@apollo/client";
import { t } from "i18next";
import React from "react";
import { useForm } from "react-hook-form";
import { Modal, Platform, useWindowDimensions } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ADD_SUGGESTION } from "../../services/graphql/mutation";
import { ALL_SUGGESTIONS } from "../../services/graphql/query";
import { Body, Box, Container } from "./styled";

export const FormAdd: React.FC<Props> = ({
	loginSource,
	modalVisible,
	setModalVisible,
}) => {
	const { width } = useWindowDimensions();
	const { bottom } = useSafeAreaInsets();
	const isLargeScreen = width >= 768;

	const { control, handleSubmit } = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const [add, { loading }] = useMutation(ADD_SUGGESTION, {
		update(cache, { data: { addSuggestion } }) {
			if (addSuggestion?.success) {
				Toast.show({
					type: "success",
					text1: t("success.title"),
					text2: t("auth.success.suggestion"),
				});

				setModalVisible(false);

				const cacheSuggestion: any = cache.readQuery({
					query: ALL_SUGGESTIONS,
					variables: { loginSource },
				});

				if (cacheSuggestion) {
					const { allSuggestions } = cacheSuggestion;

					cache.writeQuery({
						query: ALL_SUGGESTIONS,
						variables: { loginSource },
						data: {
							allSuggestions: [...allSuggestions, addSuggestion?.suggestion],
						},
					});
				}
			}
		},
	});
	const onSubmit = (data: any) => {
		const suggestionInput = {
			loginSource,
			...data,
		};
		add({
			variables: {
				suggestionInput,
			},
		});
	};

	return (
		<Modal
			animationType={useWidth(width, "slide", "slide", "slide", "fade", "fade")}
			transparent={useWidth(width, false, false, false, true, true)}
			presentationStyle={
				Platform.OS === "ios" &&
				useWidth(
					width,
					"formSheet",
					"formSheet",
					"formSheet",
					"overFullScreen",
					"overFullScreen",
				)
			}
			supportedOrientations={["portrait", "landscape"]}
			visible={modalVisible}
		>
			<Box $width={width}>
				<Container $width={width} $bottom={bottom}>
					<Appbar.Header statusBarHeight={0}>
						{isLargeScreen ? (
							<Appbar.Action
								icon="close"
								onPress={() => setModalVisible(false)}
							/>
						) : (
							<Appbar.BackAction onPress={() => setModalVisible(false)} />
						)}
						<Appbar.Content title={t("add-suggestion")} />
					</Appbar.Header>
					<Body $width={width}>
						<TextInput
							control={control}
							name="title"
							label={t("auth.title")}
							rules={{
								required: t("auth.error.title"),
							}}
						/>

						<TextInput
							control={control}
							name="description"
							label={t("auth.description")}
							useKeyboardAccesory
							multiline
							numberOfLines={5}
							contentStyle={{ height: 100 }}
							rules={{ required: t("auth.error.description") }}
						/>

						<Button
							style={{ marginTop: 15 }}
							loading={loading}
							onPress={handleSubmit(onSubmit)}
						>
							{t("auth.add")}
						</Button>
					</Body>
				</Container>
			</Box>
		</Modal>
	);
};

interface Props {
	loginSource: string;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
