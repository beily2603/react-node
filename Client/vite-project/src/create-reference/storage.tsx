import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCYfSTaTHu23TENxhqSMoACfcDU-rY5PGs",
  authDomain: "imglocations.firebaseapp.com",
  databaseURL: "https://imglocations-default-rtdb.firebaseio.com",
  projectId: "imglocations",
  storageBucket: "imglocations.appspot.com",
  messagingSenderId: "1081543036373",
  appId: "1:1081543036373:web:60d2400fd543bf7565c15c",
  measurementId: "G-CYPEQ5VMH4"
};

const app = initializeApp(firebaseConfig);
export const analytics = () => getAnalytics(app);

const storage = getStorage();

export const upload = async (file: File) => {
  const storageRef = ref(storage, `images/${file.name}`);
  const metadata = {
    contentType: 'image/jpeg',
  };
  await uploadBytes(storageRef, file, metadata);
  console.log('Uploaded a blob or file!');
  return download(file.name).then((response) => {
    console.log(response);
    return response;
  });
}

export const download = async (name: string): Promise<string> => {
  const url: any = await getDownloadURL(ref(storage, `images/${name}`))
    .then((url) => {
      console.log(url);
      return url;
    })
    .catch((error) => {
      console.log(error);
    });
  return url;
}