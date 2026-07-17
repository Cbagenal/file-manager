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
    uploadThingUrl: v.string()
  })
  .index("by_ownerId_and_folderId", ["ownerId", "folderId"]),


  folders: defineTable({
    name: v.string(),
    parentFolderId: v.optional(v.id("folders")),
    ownerId: v.id("users"),
    dateCreated: v.number(),
    lastUpdated: v.number()
  }).index("by_ownerId_and_parentFolderId", ["ownerId", "parentFolderId"])
});
