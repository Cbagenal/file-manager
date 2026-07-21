import { useState } from "react";
import UploadButton from "./UploadButton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ToolBar({goBack, selectedFolderId}){
    const [folderName, setFolderName] = useState('')
    const createFolder = useMutation(api.myFunctions.createFolder)
    
    return(
    <div className="flex justify-between items-center">
        <div>
            <p>Create Folder</p>
            <div className="flex gap-2">
                <input className="bg-gray-200 rounded-md px-2" value={folderName} onChange={(e) => setFolderName(e.target.value)}/>
                <button className="bg-blue-600 rounded-md text-white p-2" onClick={() => createFolder({name: folderName, parentFolderId: selectedFolderId})}>Create</button>
            </div>
        </div>

        <div className="flex gap-2">
            <UploadButton />
            <button onClick={goBack} className="bg-blue-600 rounded-md p-2 text-white ">Back</button>
        </div>
      </div>
    )
}