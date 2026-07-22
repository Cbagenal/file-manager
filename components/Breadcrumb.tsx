export default function Breadcrumb({folderHistory, openBreadcrumb}){

    return(
        <div className="flex gap-3">
            {folderHistory.map((folder, i) => (
                <div className="flex gap-2">
                    <p>{i > 0 && ">"}</p>
                    <button onClick={() => openBreadcrumb(i)} key={folder._id}>{folder.name}</button>
                </div>
            
            ))}
        </div>
    )
}
