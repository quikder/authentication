import { gql } from "@apollo/client";

export const REGISTER = gql`
mutation MyMutation($inputDevice: InputDevice!, $inputUser: InputRegister!) {
  registerUser(inputDevice: $inputDevice, inputUser: $inputUser) {
    accessToken
    error
    refreshToken
    success
  }
}
`;

export const LOGIN = gql`
mutation Login($inputDevice: InputDevice!, $email: String! $password: String!, $loginSource: String!) {
  loginUser(
    inputDevice: $inputDevice
    email: $email
    password: $password
    loginSource: $loginSource
  ) {
    accessToken
    error
    refreshToken
    success
  }
}
`;

export const LOGIN_BIOMETRIC = gql`
mutation MyMutation($identifier: String!, $loginSource: String!) {
  loginBiometric(identifier: $identifier, loginSource: $loginSource) {
    accessToken
    error
    refreshToken
    success
  }
}
`;

export const LOGOUT_DEVICE = gql`
mutation Logout_Device($deviceId: ID!) {
  logoutDevice(deviceId: $deviceId) {
    status
    device {
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
}
`;

export const SEND_LOCK_CODE = gql`
mutation SendCode($deviceId: ID!) {
  sendLockCode(deviceId: $deviceId) {
    success
  }
}
`;

export const VERIFY_LOCK_CODE = gql`
mutation VerifyLockCode($deviceId: ID!, $code: String!) {
  verifyLockCode(code: $code, deviceId: $deviceId) {
    success
  }
}
`;

export const CHANGE_PASSWORD = gql`
mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
  changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
    errors
    success
  }
}
`;

export const FORGOT_PASSWORD = gql`
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    error
  }
}
`;

export const RECOVER_PASSORD = gql`
mutation MyMutation($code: String!, $password: String!) {
  recoverPassword(code: $code, password: $password) {
    success
    error
  }
}
`;
