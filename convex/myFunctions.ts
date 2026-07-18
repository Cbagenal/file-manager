import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:



export const createFolder = mutation({
  args: {
    name:v.string(),
    parentFolderId: v.optional(v.id("folders"))
  },

  handler: async (ctx, args) => {

    const ownerId = await getAuthUserId(ctx)

    if(ownerId === null){
      throw new Error("Must be signed in to create a folder")
    }

    if(args.parentFolderId !== undefined){
      const parentFolder = await ctx.db.get("folders", args.parentFolderId)

      if(parentFolder === null || parentFolder.ownerId !== ownerId){
        throw new Error("No parents folder found.")
      }
    }




    const dateCreated = Date.now()


    await ctx.db.insert("folders", {name: args.name, ownerId, dateCreated, lastUpdated: dateCreated, parentFolderId: args.parentFolderId})
  }
})

export const getFolders = query({
  args: {
    parentFolderId: v.optional(v.id("folders"))
  },

  handler: async (ctx, args) => {

    const ownerId = await getAuthUserId(ctx)

    if(ownerId === null){
      throw new Error("Must be signed in to view folders")
    }

    const folders = ctx.db
    .query("folders")
    .withIndex("by_ownerId_and_parentFolderId", (q) => 
      q
        .eq("ownerId", ownerId)
        .eq("parentFolderId", args.parentFolderId)
      )
    .collect()

    return folders
  }
  
})