import { db } from '../../utils/firebase';
import { TOKEN_COLLECTION_KEY, TokenDocument, tokenConverter } from './token.entity';

const COLLECTION_KEY = TOKEN_COLLECTION_KEY;
const converter = tokenConverter;

export const getToken = async (id: string) => {
  try {
    const docRef = db.collection(COLLECTION_KEY).doc(id).withConverter(converter);

    const docSnap = await docRef.get();
    return docSnap.data();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const addToken = async (token: TokenDocument) => {
  try {
    const docRef = db.collection(COLLECTION_KEY).doc(token.token_id).withConverter(converter);
    await docRef.set(token, { merge: true });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteToken = async (user_id: string) => {
  try {
    const tokenCollection = db.collection(COLLECTION_KEY).withConverter(converter);
    const querySnapshot = await tokenCollection.where('user_id', '==', user_id).get();

    if (querySnapshot.empty) {
      throw new Error('No tokens found for the provided user ID');
    }
    const batch = db.batch();

    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
};
