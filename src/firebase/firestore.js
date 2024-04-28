import { addDoc, collection, getDoc, getDocs } from "firebase/firestore"
import { db } from "."


export const createMessage = async(messageObj) =>{
  const ref =  await addDoc(collection(db, 'messages'), messageObj);
  return ref
};

export const checkUser = async(data) =>{
  const ref = collection(db, "users")
  let querySnapshot = await getDocs(ref);
  let list = [];
  querySnapshot.forEach((doc) => {
      list.push(doc.data())
  })

  if(list.some((el) => el.uid == data.uid)) return;

  await addDoc(collection(db, 'users'), data);
}