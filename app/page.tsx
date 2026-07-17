'use client'
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"

export default function Home(){
  const createFolder = useMutation(api.myFunctions.createFolder)
  const folders = useQuery(api.myFunctions.getFolders)


  console.log(folders)
  return(
    <div>
      <p>home</p>

      <button onClick={() => createFolder({name: "test"})}>create</button>

      {folders?.map((folder) => (
        <div key={folder._id}>
          <p>{folder.name}</p>
        </div>
      ))}
    </div>
  )
}