"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteFile = action({
  args: {
    fileToDelete: v.id("files"),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("You must be signed in to delete a file.");
    }

    const file = await ctx.runQuery(internal.myFunctions.getFileToDelete, {
        fileToDelete: args.fileToDelete,
      },
    );

    if (file === null || file.ownerId !== userId) {
      throw new Error("File not found.");
    }

    // Delete the actual upload first.
    await utapi.deleteFiles(file.uploadThingKey);

    // Only remove the database record if UploadThing succeeded.
    await ctx.runMutation(internal.myFunctions.deleteFile, {
      fileToDelete: file._id,
    });

    return null;
  },
});