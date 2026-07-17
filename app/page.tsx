'use client'
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"

export default function Home(){
  const createFolder = useMutation(api.myFunctions.createFolder)
  return(
    <div>
      <p>home</p>

      <button onClick={() => createFolder({name: "test"})}>create</button>
    </div>
  )
}