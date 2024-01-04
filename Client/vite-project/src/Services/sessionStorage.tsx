import { endPoint } from "./config";
import { getAll } from "./service";
import { location } from "../Services/interfaces";

export const setMessage=(countMessage: number,list:Array<string>)=>{
sessionStorage.setItem("countOfChanges",countMessage.toString());
sessionStorage.setItem("listOfChanges",JSON.stringify(list));
}

export const getMessage=()=>{
    const count = sessionStorage.getItem("countOfChanges");
    const data =  sessionStorage.getItem("listOfChanges");
    let list = [];
    if (data !== null){
     list = JSON.parse(data);
    }
    return {count,list}
}

export const checkChange=()=>{
    getAll(`${endPoint}/location/getLocations`).then((result) => {
        console.log(result);
      const data=result.data;
     const dataChange= data.filter((d:location)=>d.tempImagesList.length>0);
     let tempImages: Array<string>=[] ;
     dataChange.forEach((location:location)=>{
          tempImages.push(location.name);
     })
     setMessage(tempImages.length,tempImages);
    });
}
