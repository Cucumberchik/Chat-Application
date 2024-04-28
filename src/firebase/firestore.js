import { addDoc, collection } from "firebase/firestore"
import { db } from "."


export const createMessage = async(messageObj) =>{
  const ref =  await addDoc(collection(db, 'messages'), messageObj);
  return ref
};

export const checkUser = async(uid) =>{
    
}