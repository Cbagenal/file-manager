import { v } from "convex/values";
import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { UTApi } from "uploadthing/server";
import { useQuery } from "convex/react";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:

const utapi = new UTApi()


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


    await ctx.db.insert("folders", {name: args.name, ownerId, dateCreated, parentFolderId: args.parentFolderId})
  }
})

export const getFolderContent = query({
  args: {
    parentFolderId: v.optional(v.id("folders"))
  },

  handler: async (ctx, args) => {

    const ownerId = await getAuthUserId(ctx)

    if(ownerId === null){
      throw new Error("Must be signed in to view folders")
    }

    const [folders, files] = await Promise.all([
      ctx.db
        .query("folders")
        .withIndex("by_ownerId_and_parentFolderId", (q) => 
          q
            .eq("ownerId", ownerId)
            .eq("parentFolderId", args.parentFolderId)
          )
        .collect(),

      ctx.db
        .query("files")
        .withIndex("by_ownerId_and_folderId", (q) => 
          q
            .eq("ownerId", ownerId)
            .eq("folderId", args.parentFolderId)
          )
        .collect()
    ])

    return { folders, files}
  }
  
})


export const createFile = mutation({
  args: {
    name: v.string(),
    folderId: v.optional(v.id("folders")),
    size: v.number(),
    type: v.string(),
    uploadThingURL: v.string(),
    uploadThingKey: v.string()
  },

  handler: async (ctx, args) => {
    const ownerId = await getAuthUserId(ctx)

    if(ownerId === null){
      throw new Error('You must be singed into to create a file.')
    }

    if(args.folderId !== undefined){
      const folder = await ctx.db.get("folders", args.folderId)

      if(folder === null || folder.ownerId !== ownerId){
        throw new Error('No folder found.')
      }
    }

    const dateCreated = Date.now()

    await ctx.db.insert("files", {name: args.name, folderId: args.folderId, ownerId, type:args.type, size: args.size, dateCreated, uploadThingUrl: args.uploadThingURL, uploadThingKey: args.uploadThingKey})
  }
})

export const getCurrentUser = query({
  args:{},

  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if(userId === null){
      return null;
    }

    return await ctx.db.get("users", userId)
  }
})

export const getFileToDelete = internalQuery({
  args: { fileToDelete: v.id("files")},

  handler: async (ctx, args) => {

    const userId = await getAuthUserId(ctx)

    if(userId === null){
      throw new Error("Must be signed in to delete a folder")
    }

    const file = await ctx.db.get("files", args.fileToDelete)

    if(file === null || file.ownerId !== userId){
      throw new Error("No folder found")
    }

    return file

  }
})

export const deleteFile = internalMutation({
  args: { fileToDelete: v.id("files")},

  handler: async (ctx, args) => {

    const userId = await getAuthUserId(ctx)

    if(userId === null){
      throw new Error('You must be signed in to delete a file.')
    }

    const file = await ctx.db.get("files", args.fileToDelete)

    if(file === null || file.ownerId !== userId){
      throw new Error('File not found.')
    }

    await ctx.db.delete("files", args.fileToDelete)
  }
})

export const shareFile = mutation({
  args: {
    fileId: v.id("files"),
    shareType: v.union(v.literal("public"), v.literal("private")),
    sharedWithEmail: v.optional(v.string())
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if(userId === null){
      throw new Error("You must be signed in to share a file.")
    }

    const file = await ctx.db.get("files", args.fileId)

    if(file === null || file.ownerId !== userId){
      throw new Error("No file found.")
    }

    const createdAt = Date.now()
    const token = crypto.randomUUID()

    if(args.shareType === 'public'){

      return await ctx.db.insert("fileShares", {
          fileId: file._id,
          createdAt,
          createdBy: userId,
          shareType: args.shareType,
          token
      })
    }

    const sharedWithUser = await ctx.db
    .query("users")
    .withIndex("email", (q) => 
      q.eq("email", args.sharedWithEmail))
    .unique()

    if(sharedWithUser === null){
      throw new Error("No user found with that email.")
    }

    if(args.shareType === 'private'){
      return await ctx.db.insert("fileShares", {
        fileId: file._id,
        shareType: args.shareType,
        createdAt,
        createdBy: userId,
        token,
        sharedWithUserId: sharedWithUser._id,
      })
    }
  }
})

export const getShareToken = query({
  args: {token: v.string()},

  handler: async (ctx, args) => {


     const share = await ctx.db
    .query("fileShares")
    .withIndex("by_token", (q) =>
      q.eq("token", args.token))
    .unique()

    if(share === null){
      throw new Error("No file found.")
    }

    const file = await ctx.db.get("files", share.fileId)

    return file
  }
})