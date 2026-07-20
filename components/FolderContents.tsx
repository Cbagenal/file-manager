export default function FolderContents({data, openFile, openFolder}){
    
    return(
        <div className="flex gap-2">
        {data?.folders?.map((folder) => (
          <div key={folder._id}>
            <button className="bg-gray-500 p-3 rounded-md" onClick={() => openFolder(folder._id)}>{folder.name}</button>
          </div>
        ))}

        {data?.files.map((file) => (
          <div key={file._id}>
            <button className="bg-blue-500 p-3 rounded-md" onClick={() => openFile(file)}>{file.name}</button>
          </div>
        ))}

      </div>
    )
}