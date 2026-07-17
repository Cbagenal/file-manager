import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:



export const createFolder = mutation({
  args: {
    name:v.string()

  },

  handler: async (ctx, args) => {

    const ownerId = await getAuthUserId(ctx)

    if(ownerId === null){
      return Error("Must be signed in to create a folder")
    }

    const dateCreated = Date.now()


    ctx.db.insert("folders", {name: args.name, ownerId, dateCreated, lastUpdated: dateCreated})
  }
})