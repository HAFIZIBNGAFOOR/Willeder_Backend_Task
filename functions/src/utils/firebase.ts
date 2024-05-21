import { firestore } from 'firebase-admin';
import * as admin from 'firebase-admin';

import * as dotenv from "dotenv"
dotenv.config()

console.log(process.env.PROJECT_ID,' get me something ','this is the processs',process.env.PRIVATE_KEY,process.env.CLIENT_EMAIL);

const config = {
  projectId:process.env.PROJECT_ID,
  privateKey:process.env.PRIVATE_KEY,
  clientEmail:process.env.CLIENT_EMAIL
}
admin.initializeApp({
  credential: admin.credential.cert(config),
});
const db = firestore();
const adminauth = admin.auth();

export { db, adminauth };
