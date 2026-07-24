import { Id } from "@/convex/_generated/dataModel"

type FolderHistoryItem = {
    folderHistory: Id<"folders">;
    name: string;
}

type BreadcrumbProps = {
    folderHistory: FolderHistoryItem[];
    openBreadcrumb: (folderIndex: number) => void;
}

export default function Breadcrumb({folderHistory, openBreadcrumb}: BreadcrumbProps){

    return(
        <div className="flex gap-3">
            {folderHistory.map((folder, i) => (
                <div className="flex gap-2" key={i}>
                    <p>{i > 0 && ">"}</p>
                    <button onClick={() => openBreadcrumb(i)} key={folder._id}>{folder.name}</button>
                </div>
            
            ))}
        </div>
    )
}
