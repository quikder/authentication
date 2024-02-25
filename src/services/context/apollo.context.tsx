import {
	ApolloClient,
	ApolloProvider as ApolloProviderDefault,
	InMemoryCache,
	split,
	//@ts-ignore
} from "@apollo/client";
//@ts-ignore
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
//@ts-ignore
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { type PropsComponent } from "../../types";
import { useAuth } from "./auth.context";

export const ApolloProvider: React.FC<PropsComponent> = (props) => {
	const { accessToken, isUserAuthenticated } = useAuth();
	const cache = new InMemoryCache();

	const link = createUploadLink({
		uri: `https://${process.env.EXPO_PUBLIC_API_URL}/graphql/`,
	});

	const wsLink = new WebSocketLink(
		new SubscriptionClient(`wss://${process.env.EXPO_PUBLIC_API_URL}/graphql/`, {
			reconnect: true,
		}),
	);	

	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === "OperationDefinition" &&
				definition.operation === "subscription"
			);
		},
		wsLink,
		link,
	);

	//@ts-ignore
	const authLink = setContext((_, { headers }) => {
		return {
			headers: {
				...headers,
				authorization: isUserAuthenticated ? `JWT ${accessToken}` : null,
			},
		};
	});

	const client = new ApolloClient({
		//@ts-ignore
		link: authLink.concat(splitLink),
		cache,
	});

	return (
		<ApolloProviderDefault client={client}>
			{props.children}
		</ApolloProviderDefault>
	);
};
