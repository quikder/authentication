import { useMutation } from "@apollo/client";
import { t } from "i18next";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "styled-components/native";
import { VOTE_SUGGESTION } from "../../services/graphql/mutation";
import { Body, Row } from "./item.styled";

export const Item: React.FC<Props> = ({
	id,
	title,
	description,
	totalVotes,
	haveMyVote,
	isMine,
}) => {
	const theme = useTheme();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const [vote, { loading }] = useMutation(VOTE_SUGGESTION, {
		update() {},
		variables: {
			suggestionId: id,
		},
	});

	return (
		<Body>
			<Text variant="titleMedium">{title}</Text>
			<TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
				<Text>
					{`${description.substring(0, isOpen ? description.length : 110)} `}
					<Text style={{ color: theme.colors.primary }}>
						{isOpen ? t("auth.see-less") : t("auth.see-more")}
					</Text>
				</Text>
			</TouchableOpacity>

			<Row>
				<Text style={{ color: theme.colors.primary }}>
					{`${totalVotes} ${t("auth.votes")}`}
				</Text>

				<Button
					mode="contained"
					loading={loading}
					disabled={isMine}
					onPress={() => vote()}
				>
					{haveMyVote ? t("auth.voted") : t("auth.vote")}
				</Button>
			</Row>
		</Body>
	);
};

interface Props {
	id: string;
	title: string;
	description: string;
	totalVotes: number;
	haveMyVote: boolean;
	isMine: boolean;
}
