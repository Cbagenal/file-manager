'use client'
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"

export default function Home(){
  const [folderName, setFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderID] = useState<Id<"folders"> | undefined>(undefined)
  const [folderHistory, setFolderHistory] = useState<Id<"folders"> | []>([])
  const createFolder = useMutation(api.myFunctions.createFolder)
  const folders = useQuery(api.myFunctions.getFolders, {parentFolderId: selectedFolderId})


  const openFolder = (folderId: Id<"folders">) => {
    setFolderHistory((history) => [...history, selectedFolderId])

    setSelectedFolderID(folderId)

    console.log(folderHistory)
  }


  const goBack = () => {
    if(folderHistory.length === 0) return;

    const previousFolderId = folderHistory[folderHistory.length - 1]

    setSelectedFolderID(previousFolderId)

    setFolderHistory((history) => history.slice(0, -1))
  }
  console.log(folders)
  return(
    <div>
      <p>home</p>
      <input value={folderName} onChange={(e) => setFolderName(e.target.value)}/>

      <button onClick={() => createFolder({name: folderName, parentFolderId: selectedFolderId})}>create</button>
      <button onClick={goBack}>back</button>


      <div className="flex gap-2">
        {folders?.map((folder) => (
          <div key={folder._id}>
            <p className="bg-gray-500 p-3 rounded-md" onClick={() => openFolder(folder._id)}>{folder.name}</p>
          </div>
      ))}
      </div>

      
    </div>
  )
}