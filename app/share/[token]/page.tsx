'use client'
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { get } from "http";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Page(){
    const params = useParams<{ token: string}>();
    const file = useQuery(api.myFunctions.getShareToken, {token: params.token})
    const [text, setText] = useState('')


    useEffect(() => {
      const getText = async () => {

      if(!file) return

      const response = await fetch(file.uploadThingUrl)
      const fileText = await response.text()
      setText(fileText)
    }

    getText()

    }, [file])

    return(
        <div className="w-screen h-screen">
            {file?.type?.includes("image") && (
            <div className="flex h-full items-center justify-center p-4">
              <img className="object-contain max-w-[80vw] max-h-[80vh]" src={file?.uploadThingUrl!} alt={file?.name!} />
            </div> 
                  )}
      
         

          {file?.type?.includes("text") && (
            <textarea value={text || "Loading..." } readOnly className="h-full w-full focus:outline-none bg-white pl-3 pt-4 rounded-xl" />
          )}

          {file?.type.includes("pdf") && (
            <iframe src={file?.uploadThingUrl} width="100%" height="100%"/>
          )}
        </div>
    )
}