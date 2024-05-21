import * as bcrypt from 'bcryptjs';

export const comparePassword = async (password: string, hashedPassword: string) => {
    const isPassMatch = await bcrypt.compare(password,hashedPassword)
    return isPassMatch
}; 

export const hashPassword = async (password: string) => {
    const hashedPassword =  await bcrypt.hash(password,10)
    return hashedPassword
}; 
