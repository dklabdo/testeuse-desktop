import { useEffect, useState } from "react"
import img from "../assets/image.png"
const useImage = (file) => {
    const [url,seturl] = useState('');
    useEffect(() => {
        if(file) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                seturl(fileReader.result)
            }
            fileReader.readAsDataURL(file)
        }
        else{
            seturl(img)
        }
    } , [file])
    return url
}

export default useImage;