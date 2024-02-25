import { gql } from "@apollo/client";

export const MY_DEVICES = gql`
query MyQuery($loginSource: String = "") {
  allDevices(loginSource: $loginSource) {
    id
    identifier
    brand
    modelName
    deviceType
    ipAddress
    isBlocked
    isLogin
  }
}
`;

export const ALL_SUGGESTIONS = gql`
query AllSUggestions($loginSource: String = "") {
  allSuggestions(loginSource: $loginSource) {
    id
    title
    description
    totalVotes
    haveMyVote
    isMine
  }
}
`;
