import { updateUserFields, updateUserPassword } from "../../../models/user";

export const updateAccountUser = async (userId:string,email:string , name: string, phone: number, address: string) => {
  const isTrue = await updateUserFields(userId,email,name,phone,address)
  if(isTrue){
    return Promise.resolve('success')
   }
   return Promise.reject('Invalid UserId')
};

export const updatePasswordUser = async (password: string,userId:string) => {
 const isTrue = await updateUserPassword(password,userId)
 if(isTrue){
  return Promise.resolve('success')
 }
 return Promise.reject('Invalid UserId')
};
