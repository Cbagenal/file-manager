'use client'
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image"
import PreviewFileDialog from "@/components/PreviewFileDialog"
import FolderContents from "@/components/FolderContents"
import ToolBar from "@/components/ToolBar"

export default function Home(){

  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null)
  const [selectedFolderId, setSelectedFolderID] = useState<Id<"folders"> | undefined>(undefined)
  const [folderHistory, setFolderHistory] = useState<Id<"folders"> | []>([])
  const data = useQuery(api.myFunctions.getFolderContent, {parentFolderId: selectedFolderId})

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
    <div className="p-8 flex gap-8 flex-col">

      <ToolBar goBack={goBack} selectedFolderId={selectedFolderId} />

      <FolderContents data={data} openFile={openFile} openFolder={openFolder}/>

      <PreviewFileDialog  selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>

    </div>
  )
}