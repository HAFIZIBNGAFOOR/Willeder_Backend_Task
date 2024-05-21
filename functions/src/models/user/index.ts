import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { db } from "../../utils/firebase"
import { USER_COLLECTION_KEY, userConverter, UserDocument } from "./user.entity"

const COLLECTION_KEY = USER_COLLECTION_KEY;
const converter = userConverter;

export const addUser =async(user:UserDocument)=>{
    try {
        const docRef = db.collection(COLLECTION_KEY).doc(user.user_id).withConverter(converter);
        await docRef.set(user, { merge: true });
      } catch (error) {
        throw new Error(`Error adding user: ${error}`);
      }

}  

export const getUser =async (id:string)=>{
    try {
        const docRef = db.collection(USER_COLLECTION_KEY).doc(id).withConverter(converter)
        const docSnap = await docRef.get();
        return docSnap.data()
    } catch (error) {
        throw new Error(`Error fetching user : ${error}`)
    }
}
export const getUserByEmail= async(email:string)=>{
  try {
    const userCollection = db.collection(USER_COLLECTION_KEY).withConverter(converter);
    const querySnapshot = await userCollection.where('email', '==', email).get();
    if (querySnapshot.empty) {
      throw new Error('No user found with the provided email');
    }
    const users = querySnapshot.docs.map(doc => doc.data());
    return users
  } catch (error) {
    throw new Error(`Error fetching user : ${error}`)
  }
}

export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const querySnapshot = await db.collection(COLLECTION_KEY).where('email', '==', email).get();
      if (!querySnapshot.empty) {
        return true; // Email exists
      } else {
        return false; // Email does not exist
      }
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error('Failed to check email existence.');
    }
  };
  export const checkUserCredentials = async (email: string, password: string): Promise<UserDocument | null> => {
    try {
      const querySnapshot = await db.collection(COLLECTION_KEY).where('email', '==', email).get();
      if (querySnapshot.empty) {
        return null;
      }
      const userData =  querySnapshot.docs[0].data();
      const isPassMatch =await comparePassword(password,userData.password)
      if (isPassMatch) {
        return userData as UserDocument;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error checking user credentials:', error);
      throw new Error('Failed to check user credentials.');
    }
  };

export const updateUserPassword = async(password:string,user_id:string)=>{
    const querySnapshot = await db.collection(COLLECTION_KEY).where('user_id', '==', user_id).get();
    if (querySnapshot.empty) {
      return null;
    }
    const hashedPassword = await hashPassword(password)
    const userDoc = querySnapshot.docs[0];
    await userDoc.ref.update({ password:hashedPassword });
    return true
}

export const updateRefreshToken= async(user_id:string,refreshToken:string)=>{
  const querySnapshot = await db.collection(COLLECTION_KEY).where('user_id', '==', user_id).get();
  if (querySnapshot.empty) {
    return null;
  } 
  const userDoc = querySnapshot.docs[0];
  await userDoc.ref.update({refresh_token:refreshToken})
  return true
}

export const updateDeleteToken = async (user_id:string)=>{
  const querySnapshot = await db.collection(COLLECTION_KEY).where('user_id', '==', user_id).get();
  if (querySnapshot.empty) {
    return null;
  } 
  const userDoc = querySnapshot.docs[0];
  await userDoc.ref.update({refresh_token:null})
  return true
}

export const checkUserById = async(userId:string)=>{ 
  const querySnapshot = await db.collection(COLLECTION_KEY).where('user_id', '==', userId).get();
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    return userDoc
}

export const updateUserFields = async(userId:string,email:string , name: string, phone: number, address: string)=>{
  const querySnapshot = await db.collection(COLLECTION_KEY).where('user_id', '==', userId).get();
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0]; 
    await userDoc.ref.update({email,name,phone,address})
    return true
}
