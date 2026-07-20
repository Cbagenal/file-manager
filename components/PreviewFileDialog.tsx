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

          {selectedFile?.type.includes("pdf") && (
            <iframe src={selectedFile?.uploadThingUrl} width="100%" height="100%"/>
          )}
        </div>

      </dialog>
    )
}