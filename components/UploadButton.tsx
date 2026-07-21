import { UploadButton as UploadThingButton } from "@/utils/uploadthing";

export default function UploadButton(createFile){
    return(
        <UploadThingButton
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
    )
}