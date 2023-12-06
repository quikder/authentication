import { ErrorServer, Loading, useWidth } from "verity-ui";
import { useQuery } from "@apollo/client";
import { FlatList, useWindowDimensions } from "react-native";
import { MY_DEVICES } from "../../services/graphql/query";
import { Item } from "./item";
import React from "react";

export const Devices: React.FC<Props> = ({ loginSource }) => {
	const { width } = useWindowDimensions();

	const { data, loading, error, refetch } = useQuery(MY_DEVICES, {
		variables: { loginSource },
		fetchPolicy: "cache-first",
		nextFetchPolicy: "cache-and-network",
		errorPolicy: "all",
	});

	if (loading) return <Loading />;
	if (error) return <ErrorServer error={error} refetch={refetch} />;

	return (
		<FlatList
			data={data.allDevices}
			renderItem={({ item }) => <Item {...item} />}
			keyExtractor={(item) => item.id}
			numColumns={useWidth(width, 1, 1, 1, 2, 3)}
			key={useWidth(width, 1, 1, 1, 2, 3)}
		/>
	);
};

interface Props {
	loginSource: string;
}
