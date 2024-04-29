import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "."


export const createMessage = async(messageObj) =>{
  const ref =  await addDoc(collection(db, 'messages'), messageObj);
  return ref
};

export const getUsers = async(setData) => {
    const ref = collection(db, "users")
    let querySnapshot = await getDocs(ref);
    let list = [];
    querySnapshot.forEach((doc) => {
        list.push({...doc.data(), docId: doc.id})
    });
    setData(list)
}
//Проверяем есть ли пользователь в коллекций users
export const checkUser = async(data) =>{
    const ref = collection(db, "users")
    let querySnapshot = await getDocs(ref);
    let list = [];
    querySnapshot.forEach((doc) => {
        list.push(doc.data())
    })
    //Условия проверки пользователя в коллекций
    if(list.some((el) => el.uid == data.uid)) return;
    //Если не истина то мы добавляем пользователя в коллекцию
    await addDoc(collection(db, 'users'), data);
}
export const onMessageCommunication = async () => {
    const ref = collection(db, "messages");
    let querySnapshot = await getDocs(ref);
    let list = [];
    querySnapshot.forEach((doc) => {
        list.push({...doc.data(), communication: doc.id})
    })
    
    const messageMap = list.find((el) => {
        let chat = el.communication.split('#')
        return chat.includes('John') && chat.includes('Alice');
    });
    
    if (!messageMap) return; 
    
    const messageCommunicationRef = doc(db, "telegram", messageMap.communication);
        
    return messageCommunicationRef;
}
export const listUserMessage = async() => {
    const ref = collection(db, "telegram")
    let querySnapshot = await getDocs(ref);
    let list = [];
    querySnapshot.forEach((doc) => {
        list.push({...doc.data(), docId: doc.id})
    });

    console.log(list);
}

export const senMessage = async (uid, userId, message) => {
    const ref = collection(db, "telegram");
    let querySnapshot = await getDocs(ref);
    let list = [];
    querySnapshot.forEach((doc) => {
        list.push({...doc.data(), communication: doc.id})
    })
    
    const messageMap = list.find((el) => {
        let chat = el.communication.split('#')
        return chat.includes(uid) && chat.includes(userId)
    });
    if(messageMap){

        const val = doc(db, "telegram", messageMap.communication);
        const collectionMessage = collection(val, "messages");
    
        await addDoc(collectionMessage, message)
        return;
    }
    const val = doc(db, "telegram",  `${uid}#${userId}`);
        const collectionMessage = collection(val, "messages");
    
        await addDoc(collectionMessage, message)
}
