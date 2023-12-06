import {
	ApolloClient,
	ApolloProvider as ApolloProviderDefault,
	InMemoryCache,
	//@ts-ignore
} from "@apollo/client";
//@ts-ignore
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { useAuth } from "./auth.context";

export const ApolloProvider: React.FC = (props) => {
	const { accessToken, isUserAuthenticated } = useAuth();

	const link = createUploadLink({
		uri: `https://${process.env.EXPO_PUBLIC_API_URL}/graphql/`,
	});

	//@ts-ignore
	const authLink = setContext((_, { headers }) => {
		return {
			headers: {
				...headers,
				authorization: isUserAuthenticated ? `JWT ${accessToken}` : null,
			},
		};
	});

	const cache = new InMemoryCache();

	const client = new ApolloClient({
		//@ts-ignore
		link: authLink.concat(link),
		cache,
	});

	return (
		<ApolloProviderDefault client={client}>
			{props.children}
		</ApolloProviderDefault>
	);
};
