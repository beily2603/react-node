import { errorAlert, successAlert } from "./alerts";
import { endPoint } from "./config";
import { addItem, deleteItem } from "./service";
import { uploadFile } from "./upload";

export const addLocation = (isAdmin: boolean, name: string, address: string, image: string, description: string, area: string, likes: number, id: number, imagesList: Array<string>, imageUrl?: string, file?: File, fileList?: FileList) => {
    // console.log("name: ", name, "image: ", file?.name);
    let imagesListUrl: string[] = [];
    if (!isAdmin) {
        console.log('!isAdmin');
        if (file) {
            // files.forEach(file => {
           uploadFile(file)
                .then((response) => {
                    console.log('response: ', response);
                    const imageUrl = response;
                    return imageUrl;
                })
                .then((data) => {
                    if (fileList) {
                        console.log('fileList in then: ', fileList);
                        for (let i = 0; i < fileList.length; i++) {
                            uploadFile(fileList[i])
                                .then((res) => {
                                    console.log('res: ', res);
                                    if (res)
                                        imagesListUrl = [...imagesListUrl, res];
                                    console.log('imagesListUrl: ', imagesListUrl);
                                    return [data, imagesListUrl];
                                })
                        }
                    }
                    return image;
                })
                .then((response) => {
                    const location3 = {
                        name: name,
                        address: address,
                        image: image,
                        imageUrl: response[0],
                        imagesList: response[1],
                        description: description,
                        area: area,
                        likes: likes,
                        date: Date.now()
                    }
                    console.log('location3: ', location3);
                    return location3;
                })
                // })
                .then((data) => {
                    addItem(data, `${endPoint}/location`)
                        .then(() => {
                            console.log('---------');
                            uploadFile(file);
                        })
                        .then(() => {
                            console.log('location added successfully');
                            successAlert('הלוקיישן נוסף בהצלחה');
                        })
                        .catch(() => console.log('error!!!!!!'));
                });
        }
        // }
        //             const location2 = {
        //                 name: name,
        //                 address: address,
        //                 image: image,
        //                 imageUrl: data,
        //                 imagesList: imagesListUrl,
        //                 description: description,
        //                 area: area,
        //                 likes: likes,
        //                 date: Date.now()
        //             }
        //             // setLocation({ name, address, image, imageUrl, description, area, likes,date: Date.now() });
        //             return location2;
        //         })
        //         .then((data) => {
        //             console.log('data: ', data);
        //             console.log('אני נמצא עכשיו לפני הפונקציה שמכניסה את הלוקיישן');
        //             addItem(data, `${endPoint}/location`)
        //                 .then(() => {
        //                     console.log('---------');
        //                     uploadFile(file);
        //                 })
        //                 .then(() => {
        //                     console.log('location added successfully');
        //                     successAlert('הלוקיישן נוסף בהצלחה');
        //                 })
        //                 .catch(() => console.log('error!!!!!!'));
        //         });
        //     // });
        // }
        else {
            console.log('!file');
            const location = {
                name: name,
                address: address,
                image: image,
                imageUrl: imageUrl,
                description: description,
                area: area,
                likes: likes,
                date: Date.now(),
                imagesList: imagesList
            };
            console.log('addItem', location);
            addItem(location, `${endPoint}/location`).then(() => {
                successAlert('הלוקיישן נוסף בהצלחה');
                console.log('הלוקיישן נוסף בהצלחה');
            });
        }
    } else {
        const location = {
            name: name,
            address: address,
            image: image,
            imageUrl: imageUrl,
            imagesList: fileList,
            description: description,
            area: area,
            likes: likes,
            date: Date.now(),
            // imagesList: imagesList
        };
        const del = {
            id: id,
            isTemp: true
        }
        console.log('addItem', location);
        addItem(location, `${endPoint}/location`).then(() => {
            successAlert('הלוקיישן נוסף בהצלחה');
            deleteItem(del, `${endPoint}/location/delete`).then(() => { successAlert('הלוקיישן נמחק בהצלחה'); });
        })
            .catch(() => { errorAlert('ארעה שגיאה. נסה שנית') })
    }
}

