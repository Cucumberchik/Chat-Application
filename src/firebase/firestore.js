import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
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

export const listUserMessage = async(uid, userId, setMessages) => {
    const ref = collection(db, "telegram")
    let querySnapshot = await getDocs(ref);
    let list = [];
    querySnapshot.forEach((doc) => {
        list.push({...doc.data(), communication: doc.id})
    });
    const messageMap = list.find((el) => {
        let chat = el.communication.split('-')
        return chat.includes(uid) && chat.includes(userId)
    });
    if(!messageMap) {setMessages(`telegram/${uid}-${userId}`)};
    setMessages(messageMap?.communication)
}

export const sendMessage = async (uid, userId, message, setLoading) => {
    const ref = collection(db, "telegram");
    let querySnapshot = await getDocs(ref);
    let messageMap = null;
    
    querySnapshot.forEach((doc) => {
        let communication = doc.id.split('-')
        if (communication.includes(uid) && communication.includes(userId)) {
            messageMap = { communication: doc.id, ...doc.data() };
        }
    });
    console.log(messageMap);
    if (messageMap) {
        const val = doc(db, "telegram", messageMap.communication);
        try {
            setLoading(true)
            await updateDoc(val, {
                messages: [...messageMap.messages, message]
            });
            
        } catch (error) {
        }finally{
            setLoading(false)
        }

        return;
    } 
        const val = doc(db, "telegram", `${uid}-${userId}`);
        try {
            await setDoc(val, { messages: [message] });
        } catch (error) {
        }finally{
            setLoading(false)
    }
    
}
