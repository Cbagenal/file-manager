import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useAction, useMutation } from "convex/react";
import { Download, FolderIcon, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

type FolderContentsProps = {
  data: {
    folders: Doc<"folders">[];
    files: Doc<"files">[];
  } | undefined

  openFile: (file: Doc<"files">) => void;
  openFolder: (folder: Doc<"folders">) => void;
}

export default function FolderContents({data, openFile, openFolder}: FolderContentsProps){
  const[selectedFile, setSelectedFile] = useState<Doc<"files"> | null>(null);
  const deleteFile = useAction(api.fileActions.deleteFile);
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const shareFile = useMutation(api.myFunctions.shareFile)
  const shareDialogRef = useRef<HTMLDialogElement>(null)
  const [shareType, setShareType] = useState("")
  const [shareEmail, setShareEmail] = useState("")
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const columns = "grid grid-cols-[minmax(0,1fr)_7rem_7rem_4rem_7rem_7rem] items-center group-hover:bg-gray-200"

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

  const handleShareFile = async (shareType: string, shareEmail: string) => {
    if(selectedFile === null) return
    if(shareType !== "public" && shareType !== "private") return;

    const token = await shareFile({
      fileId: selectedFile._id,
      shareType,
      ...(shareType === "private"
        ? { sharedWithEmail: shareEmail }
          : {}),
    });

    setShareUrl(`${window.location.origin}/share/${token}`)
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
            
            <div className="h-px bg-black/50"/>
          </div>
        ))}

        {data?.files.map((file) => (
          <div key={file._id} className="group">
            <div className={columns}>
              <button className="text-left p-3 py-4 rounded-md" onClick={() => openFile(file)}>{file.name}</button>
              <p>{formatFileSize(file.size)}</p>
              <p>{new Date(file.dateCreated).toLocaleDateString()}</p>
              <a className="invisible group-hover:visible" href={file.uploadThingUrl} rel="noopener noreferrer" target="_blank">
                <Download className=" border-2 border-black/50 rounded-md w-8 h-8 p-1"></Download>
              </a>
              <button className="invisible group-hover:visible" onClick={() => {setSelectedFile(file); deleteDialogRef.current?.showModal()}}><Trash2></Trash2></button>
              <button onClick={() => {setSelectedFile(file); setShareUrl(null); shareDialogRef.current?.showModal()}}>Share</button>
            </div>
            
            <div className="h-px bg-black/50"/>
          
          </div>

        ))}

        <dialog ref={deleteDialogRef} className="m-auto rounded-xl ">
          <div className="p-6 flex w-96 min-h-0 bg-white flex-col items-center">
             <p className="text-red-600 text-2xl">Delete File</p>
             <p className="mt-4 text-lg">Are you sure you want to delete {selectedFile?.name}?</p>
             <div className="mt-8 flex gap-4 justify-evenly w-full">
              <button onClick={() => {if(selectedFile === null) return; deleteFile({fileToDelete: selectedFile?._id}); deleteDialogRef.current?.close()}} className="bg-red-600 rounded-lg w-full px-6 text-white text-xl">Delete</button>
              <button onClick={() => deleteDialogRef.current?.close()} className="bg-gray-600 rounded-lg py-3 w-full text-white text-xl">Cancel</button>
             </div>
          </div>
        </dialog>

        <dialog ref={shareDialogRef} className="m-auto rounded-xl ">
          <div className="p-6 flex w-96 min-h-0 bg-white flex-col items-center">
             <p className="text-2xl">Share File</p>
             <p className="mt-4 text-lg">Are you sure you want to share {selectedFile?.name}?</p>
             <div className="mt-8 flex gap-4 justify-evenly w-full">
                <button className={`w-full rounded-md py-3 ${shareType === "public" ? "bg-blue-600 text-white transition ease-in-out duration-200": "bg-gray-200"}`} onClick={() => setShareType("public")}>Public</button>
                <button className={`w-full rounded-md py-3 ${shareType === "private" ? "bg-blue-600 text-white transition ease-in-out duration-200": "bg-gray-200"}`} onClick={() => setShareType("private")}>Private</button>
             </div>
             {shareType === "private" && <input value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} placeholder="Email" className="mt-2 w-full py-2 pl-2 bg-gray-200 rounded-md" />}
             <button className="mt-3 bg-gray-600 py-3 w-full rounded-md text-white" onClick={() => {handleShareFile(shareType, shareEmail)}}>Share</button>
             {shareUrl && (
              <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="mt-3 break-all rounded-md bg-gray-200 p-2 text-blue-600 underline">
                {shareUrl}
              </a>
             )}
             <button className="mt-2 bg-red-600 py-3 w-full rounded-md text-white" onClick={() => shareDialogRef.current?.close()}>Cancel</button>
          </div>
        </dialog>
    </div>
  )
}
