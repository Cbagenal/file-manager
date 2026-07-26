'use client'
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation"

export default function Page(){
    const params = useParams<{ token: string}>();
    const file = useQuery(api.myFunctions.getShareToken, {token: params.token})

    return(
        <div>
            {file?.type?.includes("image") && (
            <div className="flex h-full items-center justify-center p-4">
              <img className="object-contain max-w-[80vw] max-h-[80vh]" src={file?.uploadThingUrl!} alt={file?.name!} />
            </div> 
                  )}
      
         

          {file?.type?.includes("text") && (
            <textarea value={file || "Loading..." } readOnly className="focus:outline-none w-full h-full bg-white pl-3 pt-4 rounded-xl" />
          )}

          {file?.type.includes("pdf") && (
            <iframe src={file?.uploadThingUrl} width="100%" height="100%"/>
          )}
        </div>
    )
}