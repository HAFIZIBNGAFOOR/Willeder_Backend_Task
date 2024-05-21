import { logger } from 'firebase-functions/v1';
import {
  badImplementationException,
  dataNotExistException,
  HttpException,
  invalidException,
} from '../../../utils/apiErrorHandler';
import { sendMessage } from '../../../utils/sgMailer';
import { hashPassword } from '../../../utils/bcrypt';
import * as uuid from 'uuid';
import { getAddToCurrentJST, getCurrentJST } from '../../../utils/dayjs';
import { TokenDocument } from '../../../models/token/token.entity';
import { addToken, deleteToken, getToken } from '../../../models/token';
import { MESSAGE_RESET_PASSWORD } from './auth.message';
import { UserDocument } from '../../../models/user/user.entity';
import { addUser, updateUserPassword } from '../../../models/user';


const uuidv4 = uuid.v4
export const createUser = async (email: string, password: string, name: string, phone: number, address: string) => {
  const hashedPassword = await hashPassword(password)
  const newUser: UserDocument = {
    user_id: uuidv4(),
    email,
    password:hashedPassword, 
    name,
    phone,
    address,
    refresh_token:null,
    status:'active',
    updated_at:getCurrentJST(),
    user_type: 'user', 
    created_at: getCurrentJST(),
    deleted_at: null,
  };
  await addUser(newUser);
  return Promise.resolve('success');
};

export const forgotPassword = async (user: UserDocument) => {
  let error: Error | HttpException | undefined;
  try {
    const newToken: TokenDocument = {
      token_id: uuidv4(),
      user_id: user.user_id,
      token_type: 'resetPassword',
      user_type: 'user',
      created_at: getCurrentJST(),
      expired_at: getAddToCurrentJST(1,'h'),
    };
    await addToken(newToken);
    const tokenUrl = process.env.FRONTEND_URL + '/user/password/reset/' + newToken.token_id;
    await sendMessage(MESSAGE_RESET_PASSWORD(user.email, tokenUrl));
    return Promise.resolve('success');
  } catch (err) {
    logger.error(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

export const updatePassword = async (password: string, tokenId: string) => {
  let error: Error | HttpException | undefined;
  try {
    const token = await getToken(tokenId);
    if (!token) throw dataNotExistException('Token does not exist');
    if (token.user_type !== 'user') throw invalidException('Token is not valid user type');
    if (token.token_type !== 'resetPassword') throw invalidException('Token is not valid token type');
    await updateUserPassword(password,token.user_id)
    await deleteToken(tokenId);
    return Promise.resolve(true);
  } catch (err) {
    console.log(err);
    error = err instanceof Error ? err : badImplementationException(err);
    return Promise.reject(error);
  }
};

