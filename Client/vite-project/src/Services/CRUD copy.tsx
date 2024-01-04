import { errorAlert, successAlert } from "./alerts";
import { endPoint } from "./config";
import { addItem, deleteItem } from "./service";
import { uploadFile } from "./upload";

export const addLocation = (isAdmin: boolean, id: number, name: string, address: string, imageUrl: string, description: string, area: string, likes: number, imagesList: Array<string>, userName?: string, file?: File, fileList?: FileList) => {
    if (isAdmin && imageUrl && imagesList) {
        const location = {
            id: 0,
            name: name,
            address: address,
            imageUrl: imageUrl,
            description: description,
            area: area,
            likes: likes,
            imagesList: imagesList,
            date: Date.now(),
            userName: userName
        };
        const del = {
            id: id,
            isTemp: true
        }
        console.log('in crud: ', location);
        addItem(location, `${endPoint}/location`)
            .then(() => {
                successAlert('הלוקיישן נוסף בהצלחה');
                deleteItem(del, `${endPoint}/location/delete`)
                    .then(() => { console.log('הלוקיישן נמחק בהצלחה'); });
            })
            .catch(() => { errorAlert('ארעה שגיאה. נסה שנית') });
    }
    else {
        let imagesListUrl: string[] = [];
        if (file) {
            uploadFile(file)
                .then((response) => {
                    console.log('imagesListUrl: ', response);
                    const imageUrl = response;
                    return imageUrl;
                })
                .then((data) => {
                    if (fileList) {
                        const fileArray = Array.from(fileList);
                        const imagePromises = fileArray.map((fileListItem) =>
                            uploadFile(fileListItem).then((res) => {
                                if (res) {
                                    imagesListUrl = [...imagesListUrl, res];
                                }
                                console.log('imagesList: ', imagesListUrl);
                            })
                        );
                        return Promise.all(imagePromises).then(() => [data, imagesListUrl]);
                    } else {
                        return [data, imagesListUrl];
                    }
                })
                .then((response) => {
                    const location3 = {
                        id: 0,
                        name: name,
                        address: address,
                        imageUrl: response[0],
                        description: description,
                        area: area,
                        likes: likes,
                        imagesList: response[1],
                        date: Date.now(),
                        userName: userName
                    }
                    console.log('location: ', location3);
                    return location3;
                })
                .then((data) => {
                    addItem(data, `${endPoint}/location`)
                        .then(() => {
                            successAlert('הלוקיישן נוסף בהצלחה');
                        })
                        .catch(() => console.log('error!!!!!!'));
                });
        }
        else {
            console.log('!file');
            const location = {
                id: 0,
                name: name,
                address: address,
                imageUrl: imageUrl,
                description: description,
                area: area,
                likes: likes,
                imagesList: imagesList,
                date: Date.now(),
                userName: userName
            };
            addItem(location, `${endPoint}/location`).then(() => {
                successAlert('הלוקיישן נוסף בהצלחה');
            });
        }
    }
}