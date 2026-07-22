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
import Breadcrumb from "@/components/Breadcrumb"

type FolderHistoryItem = {
  id: Id<"folders">;
  name: string;
};

export default function Home(){

  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null)
  const [selectedFolderId, setSelectedFolderID] = useState<Id<"folders"> | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<FolderHistoryItem[]>([])
  const data = useQuery(api.myFunctions.getFolderContent, {parentFolderId: selectedFolderId})

  const openFolder = (folder: Doc<"folders">) => {
    setFolderHistory((history) => [...history, {id: folder._id, name: folder.name}])

    setSelectedFolderID(folder._id)

    console.log(folderHistory)
  }


  const goBack = () => {
    setFolderHistory((history) => {
      const newHistory = history.slice(0, -1);
      setSelectedFolderID(newHistory.at(-1)?.id);
      return newHistory;
    });
  };

  const openFile = async (file: Doc<"files">) => {
        setSelectedFile(file)
    }

  const openBreadcrumb = (folderIndex: number) => {
    setFolderHistory((history) => {
      const newHistory = history.slice(0, folderIndex + 1);
      setSelectedFolderID(newHistory.at(-1)?.id);
      return newHistory;
    });
};


  return(
    <div className="p-8 flex gap-8 flex-col">

      <ToolBar goBack={goBack} selectedFolderId={selectedFolderId} />

      <Breadcrumb folderHistory={folderHistory} openBreadcrumb={openBreadcrumb}/>

      <FolderContents data={data} openFile={openFile} openFolder={openFolder}/>

      <PreviewFileDialog  selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>

    </div>
  )
}