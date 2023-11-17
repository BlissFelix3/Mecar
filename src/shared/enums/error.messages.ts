export enum AUTH_ERROR_MSGS {
  USER_NOT_FOUND = 'User not found',
  CREDENTIALS_DONT_MATCH = 'Crendentials do not match any of our records',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  GOOGLE_LOGIN_ERROR = 'You signed up with Google. Please use Google login.',
  ALREADY_EXIST = 'User already exists, login',
  GOOGLE_ALREDY_EXISTS = 'User alreay exists, login with Google',
  PASSWORD_MATCH = 'Passwords do not match',
  GOOGLE_SIGNUP_ERROR = 'You You signed up with Google. Please use Google login.',
  GOOGLE_CHANGE_PASS_ERROR = `Google SignedUp user's cannot change password`,
  GOOGLE_CANNOT_RESET = 'Google signedUp users cannot reset password',
  FORBIDDEN = 'You cannot perform this action',
  EXPIRED_LINK = 'Link has expired',
  INVALID_OLD_PASSWORD = 'Invalid old password',
  SAME_PASSWORD_ERROR = 'New and old password cannot be the same',
}

export enum VALIDATION_ERROR_MSG {
  UPLOAD_ONE_FILE = 'At least one document (resume or cover letter) must be uploaded.',
  UPLOAD_BLOG_IMAGE = 'An image must be uploaded',
}
