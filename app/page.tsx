'use client'
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image"

export default function Home(){
  const [fileText, setFileText] = useState('')
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null)
  const [selectedFolderId, setSelectedFolderID] = useState<Id<"folders"> | undefined>(undefined)
  const [folderHistory, setFolderHistory] = useState<Id<"folders"> | []>([])
  const createFolder = useMutation(api.myFunctions.createFolder)
  const data = useQuery(api.myFunctions.getFolderContent, {parentFolderId: selectedFolderId})
  const createFile = useMutation(api.myFunctions.createFile)
  const dialogRef = useRef<HTMLDialogElement>(null)


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
    console.log("File", file)
    setSelectedFile(file)

    if(file.type.includes('text')){
      const response = await fetch(file.uploadThingUrl)

      const text = await response.text()
      setFileText(text)
    }
  }

  //Ensures state is updated before the imawge is loaded
  useEffect(() => {
    if(selectedFile){
      dialogRef.current?.showModal()
    }
    }, [selectedFile])

  return(
    <div>
      <p>home</p>

      <input value={folderName} onChange={(e) => setFolderName(e.target.value)}/>
      <button onClick={() => createFolder({name: folderName, parentFolderId: selectedFolderId})}>create</button>

      <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <button onClick={() => createFile({name: fileName, folderId: selectedFolderId})}>create</button>

      <button onClick={goBack}>back</button>

      <div className="flex gap-2">
        {data?.folders?.map((folder) => (
          <div key={folder._id}>
            <button className="bg-gray-500 p-3 rounded-md" onClick={() => openFolder(folder._id)}>{folder.name}</button>
          </div>
        ))}

        {data?.files.map((file) => (
          <div key={file._id}>
            <button className="bg-blue-500 p-3 rounded-md" onClick={() => openFile(file)}>{file.name}</button>
          </div>
        ))}

      </div>

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


      <dialog ref={dialogRef} onClose={() => setSelectedFile(null)} className="m-auto backdrop:bg-black/80 bg-transparent" onClick={(event) => {
        if (event.target === event.currentTarget){
          event.currentTarget.close()
        }
      }}>
        <div className="relative w-[80vw] h-[80vh]" onClick={(event) => {
          if (event.target === event.currentTarget){
            dialogRef.current?.close()
          }
        }}>
          <button className="absolute right-0 top-0 bg-red-500 p-2 z-10" onClick={(e) => {e?.stopPropagation(); dialogRef.current?.close();}}>Close</button>
          {selectedFile?.type?.includes("image") && (
            <img className="object-contain max-w-[80vw] max-h-[80vh]" src={selectedFile?.uploadThingUrl!} alt={selectedFile?.name!} />
                  )}

          {selectedFile?.type?.includes("text") && (
            <textarea value={fileText || "Loading..." } className="w-full h-full bg-white pl-3 pt-4 rounded-md" />
          )}
        </div>

      </dialog>

      
    </div>
  )
}