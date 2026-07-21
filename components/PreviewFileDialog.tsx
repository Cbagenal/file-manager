import { Doc } from "@/convex/_generated/dataModel"
import { useEffect, useRef, useState } from "react"

export default function PreviewFileDialog({selectedFile, setSelectedFile}){
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [fileText, setFileText] = useState('')


  //Ensures state is updated before the imawge is loaded
  useEffect(() => {
    if (!selectedFile) return

    setFileText('')

    const loadFile = async () => {
        const response = await fetch(selectedFile.uploadThingUrl)
        const text = await response.text()

        setFileText(text)
    }


    const isTextFile = selectedFile.type.includes("text")
    const isReady = !isTextFile || fileText !== null

    if(isReady){
      dialogRef.current?.showModal()
    }
    
    loadFile()

    }, [selectedFile])

    
    return(
        <dialog ref={dialogRef} onClose={() => setSelectedFile(null)} className="m-auto p-0 backdrop:bg-black/80 bg-white rounded-xl" onClick={(event) => {
        if (event.target === event.currentTarget){
          event.currentTarget.close()
        }
      }}>

        <div className="flex flex-col gap-2 w-[85vw] h-[85vh]">
          <div className="flex items-center justify-between border-b border-gray-300 p-3">
            <p className="truncate">{selectedFile?.name}</p>
            <button className="bg-red-600 text-white px-3 py-1 rounded-md" onClick={(e) => {e?.stopPropagation(); dialogRef.current?.close();}}>Close</button>
          </div>
          
        <div className="relative  min-h-0 flex-1 overflow-auto" onClick={(event) => {
          if (event.target === event.currentTarget){
            dialogRef.current?.close()
          }
        }}>
        
           {selectedFile?.type?.includes("image") && (
            <div className="flex h-full items-center justify-center p-4">
              <img className="object-contain max-w-[80vw] max-h-[80vh]" src={selectedFile?.uploadThingUrl!} alt={selectedFile?.name!} />
            </div> 
                  )}
      
         

          {selectedFile?.type?.includes("text") && (
            <textarea value={fileText || "Loading..." } readOnly className="w-full h-full bg-white pl-3 pt-4 rounded-xl" />
          )}

          {selectedFile?.type.includes("pdf") && (
            <iframe src={selectedFile?.uploadThingUrl} width="100%" height="100%"/>
          )}
        </div>
      </div>

      </dialog>
    )
}