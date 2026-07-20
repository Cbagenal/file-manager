'use client'
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image"
import PreviewFileDialog from "@/components/PreviewFileDialog"
import FolderContents from "@/components/FolderContents"

export default function Home(){

  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null)
  const [selectedFolderId, setSelectedFolderID] = useState<Id<"folders"> | undefined>(undefined)
  const [folderHistory, setFolderHistory] = useState<Id<"folders"> | []>([])
  const createFolder = useMutation(api.myFunctions.createFolder)
  const data = useQuery(api.myFunctions.getFolderContent, {parentFolderId: selectedFolderId})
  const createFile = useMutation(api.myFunctions.createFile)

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
  console.log(data?.folders)

  const openFile = async (file: Doc<"files">) => {
        setSelectedFile(file)
    }


  return(
    <div>
      <p>home</p>

      <input value={folderName} onChange={(e) => setFolderName(e.target.value)}/>
      <button onClick={() => createFolder({name: folderName, parentFolderId: selectedFolderId})}>create</button>

      <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <button onClick={() => createFile({name: fileName, folderId: selectedFolderId})}>create</button>

      <button onClick={goBack}>back</button>

      <FolderContents data={data} openFile={openFile} openFolder={openFolder}/>

      <UploadButton
      appearance={{
        allowedContent: "hidden",
      }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const data = res[0]
          createFile({name: data.name, type: data.type, size: data.size, folderId: selectedFolderId, uploadThingURL: data.ufsUrl})
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <PreviewFileDialog  selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>

    </div>
  )
}