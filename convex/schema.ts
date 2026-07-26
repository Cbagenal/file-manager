import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  files: defineTable({
    ownerId: v.id("users"),
    folderId: v.optional(v.id("folders")),
    type: v.string(),
    name: v.string(),
    size: v.number(),
    dateCreated: v.number(),
    uploadThingUrl: v.string(),
    uploadThingKey: v.string()
  })
  .index("by_ownerId_and_folderId", ["ownerId", "folderId"]),


  folders: defineTable({
    name: v.string(),
    parentFolderId: v.optional(v.id("folders")),
    ownerId: v.id("users"),
    dateCreated: v.number(),
  }).index("by_ownerId_and_parentFolderId", ["ownerId", "parentFolderId"]),

  fileShares: defineTable(
  v.union(
    v.object({
      shareType: v.literal("public"),
      fileId: v.id("files"),
      token: v.string(),
      createdBy: v.id("users"),
      createdAt: v.number(),
    }),
    v.object({
      shareType: v.literal("user"),
      fileId: v.id("files"),
      sharedWithUserId: v.id("users"),
      createdBy: v.id("users"),
      createdAt: v.number(),
    }),
  ),
).index("by_token", ['token']).index("by_createdBy", ['createdBy']).index("by_fileId", ['fileId'])
});
