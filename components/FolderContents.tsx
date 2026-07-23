import { Download, FolderIcon } from "lucide-react";
import { useState } from "react";

export default function FolderContents({data, openFile, openFolder}){

  const columns = "grid grid-cols-[minmax(0,1fr)_7rem_7rem_7rem] items-center group-hover:bg-gray-200"

  const formatFileSize = (size: number) => {
    if(size < 1000){
    return `${size}B`;
    }
    else if(size < 1_000_000){
      return `${(size / 1000).toFixed(2)} KB`;
    }
    else {
      return `${(size / 1_000_000).toFixed(2)} MB`
    }
  } 
    
  return(
      <div className="flex flex-col">
        <div className={columns}>
          <p>Name</p>
          <p>Size</p>
          <p>Created</p>
        </div>
        {data?.folders?.map((folder) => (
          <div key={folder._id} className="cursor-pointer group"> 
            <div className={columns}>
              <button className="flex gap-2 text-left p-3 rounded-md hover:bg-grey-200" onClick={() => openFolder(folder)}><FolderIcon />{folder.name}</button>
              <p>-</p>
              <p>{new Date(folder.dateCreated).toLocaleDateString()}</p>
            </div>              
            
            <div className="h-[1px] bg-black/50"/>
          </div>
        ))}

        {data?.files.map((file) => (
          <div key={file._id} className="group">
            <div className={columns} >
              <button className="text-left p-3 py-4 rounded-md" onClick={() => openFile(file)}>{file.name}</button>
              <p>{formatFileSize(file.size)}</p>
              <p>{new Date(file.dateCreated).toLocaleDateString()}</p>
              <a className="invisible group-hover:visible" href={file.uploadThingUrl} rel="noopener noreferrer" target="_blank">
                <Download className=" border-2 border-black/50 rounded-md w-8 h-8 p-1"></Download>
              </a>
            </div>
            
            <div className="h-[1px] bg-black/50"/>
          
          </div>

        ))}

    </div>
  )
}