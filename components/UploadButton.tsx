import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadButton as UploadThingButton } from "@/utils/uploadthing";
import { useMutation } from "convex/react";

type UploadButtonProps = {
  selectedFolderId?: Id<"folders">;
};


export default function UploadButton({selectedFolderId}: UploadButtonProps){
  const createFile = useMutation(api.myFunctions.createFile);

    return(
        <UploadThingButton
              appearance={{
                allowedContent: "hidden",
              }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const data = res[0]
                  createFile({name: data.name, type: data.type, size: data.size, folderId: selectedFolderId, uploadThingURL: data.ufsUrl, uploadThingKey: data.key})
                  console.log(res)
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
    )
}