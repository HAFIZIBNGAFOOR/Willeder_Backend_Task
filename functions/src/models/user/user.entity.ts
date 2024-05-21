import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { WithSnapshotId } from '../types';

/**
 * Firestoreに保存するデータの型
 */
export type UserDocument = {
  user_id: string;
  email: string;
  password: string;
  name: string;
  phone: number;
  address:string;
  refresh_token: string|null;
  user_type: 'admin' | 'user';
  status:'active'|'inactive'
  created_at: string;
  updated_at:string;
  deleted_at: string|null;
};

export type UserDocumentWithId = WithSnapshotId<UserDocument>;

export const USER_COLLECTION_KEY = 'User';

export const userConverter: FirestoreDataConverter<UserDocumentWithId> = {
    toFirestore(doc): DocumentData {
      return {
        user_id: doc.user_id,
        email: doc.email,
        password: doc.password,  
        name: doc.name,
        phone: doc.phone,
        user_type: doc.user_type,
        created_at: doc.created_at,
        deleted_at:doc.deleted_at,
        updated_at:doc.updated_at,
        refresh_token:doc.refresh_token,
        status:doc.status,
        address:doc.address
      };
    },
  
    fromFirestore(snapshot: QueryDocumentSnapshot<UserDocument>): UserDocumentWithId {
      const data = snapshot.data();
      const entity: UserDocumentWithId = {
        id: snapshot.id,
        user_id: data.user_id,
        email: data.email,
        password: data.password,
        name: data.name,
        address:data.address,
        phone: data.phone,
        user_type: data.user_type,
        created_at: data.created_at,
        deleted_at:data.deleted_at,
        updated_at:data.updated_at,
        refresh_token:data.refresh_token,
        status:data.status,
      };
      return entity;
    },
  };
  
