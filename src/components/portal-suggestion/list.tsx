import { Empty, Loading } from "verity-quik";
import { useQuery } from "@apollo/client";
import { useRefresh } from "@react-native-community/hooks";
import { t } from "i18next";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { ALL_SUGGESTIONS } from "../../services/graphql/query";
import { Item } from "./item";

export const List: React.FC<{ loginSource: string }> = ({ loginSource }) => {
	const { data, loading, error, refetch } = useQuery(ALL_SUGGESTIONS, {
		fetchPolicy: "cache-first",
		nextFetchPolicy: "cache-and-network",
		variables: {
			loginSource,
		},
	});

	const fetch = () => {
		refetch();
		return new Promise((resolve) => setTimeout(resolve, 500));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);

	if (loading) return <Loading />;

	return (
		<>
			<FlatList
				data={data?.allSuggestions}
				renderItem={({ item }) => <Item {...item} />}
				keyExtractor={(item) => item.id}
				refreshControl={
					<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={
					<Empty isEmpty emptyText={t("auth.empty.suggestion")} />
				}
			/>
		</>
	);
};
