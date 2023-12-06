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
