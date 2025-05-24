import {pgTable,text,uuid,integer,boolean,timestamp} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const files = pgTable("files", {
    id:uuid("id").defaultRandom().primaryKey(),
    
    //file/folder info
    name:text("name").notNull(),
    path:text("path").notNull(),
    size:integer("size").notNull(),
    type:text("type").notNull(),
    
    //storage info
    fileUrl:text("file_url").notNull(),
    thumbnailUrl:text("thumbnail_url"),
    
    //ownership info
    userId:text("user_id").notNull(),
    parentId:uuid("parent_id").notNull(),
    
    //boolean flags
    isFolder:boolean("is_folder").notNull().default(false),
    isStarred:boolean("is_starred").notNull().default(false),
    isTrashed:boolean("is_trashed").notNull().default(false),
    
    //Timestamps
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
});


export const filesRelations=relations(files,({one,many})=>({
    parent: one(files,{
        fields:[files.parentId],
        references:[files.id],
    }),

    children:many(files),
}))

//type definitions

export const File=typeof files.$inferSelect;
export const NewFile=typeof files.$inferInsert;
