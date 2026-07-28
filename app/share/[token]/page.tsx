'use client'
import { api } from "@/convex/_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { useQuery } from "convex/react";
import { get } from "http";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Page(){
    const params = useParams<{ token: string}>();
    const result = useQuery(api.myFunctions.getShareFile, {token: params.token})
    const [text, setText] = useState('')


    useEffect(() => {
      if(result?.status !== 'success') return;
      if(!result.file.type.includes('text')) return;

      const getText = async () => {

      const response = await fetch(result.file.uploadThingUrl)
      const fileText = await response.text()
      setText(fileText)
    }

    getText()

    }, [result])

    if(result === undefined){
      return <p>Loading...</p>
    }

    if(result.status === "not_found"){
      return <p>This file does not exist</p>
    }


    return(
        <div className="w-screen h-screen">
            {result?.file?.type.includes("image") && (
            <div className="flex h-full items-center justify-center p-4">
              <img className="object-contain max-w-[80vw] max-h-[80vh]" src={result.file?.uploadThingUrl!} alt={result.file?.name!} />
            </div> 
                  )}
      
         

          {result?.file?.type.includes("text") && (
            <textarea value={text || "Loading..." } readOnly className="h-full w-full focus:outline-none bg-white pl-3 pt-4 rounded-xl" />
          )}

          {result?.file?.type.includes("pdf") && (
            <iframe src={result.file?.uploadThingUrl} width="100%" height="100%"/>
          )}
          
        </div>
    )
}