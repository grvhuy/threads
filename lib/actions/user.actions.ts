"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    bio: string;
    name: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    bio,
    name,
    image,
    path,
}: Params): Promise<void> {
    connectToDB();
    const usrName = username.toLowerCase()
    console.log(usrName)
    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username,
                name,
                bio,
                image,
                onboarded: true,
            },
            {
                upsert: true,
            }
        );

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User
      .findOne({ id: userId })
      // .populate({
      //   path: 'communities',
      //   model: 'Community'
      // })

  } catch (error: any) {
    throw new Error(`Failed to fetch user ${error.message}`)
  }

}

export async function fetchUsers({ 
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
}: {
    userId: string,
    searchString?:string,
    pageNumber?:number,
    pageSize?:number,
    sortBy?: SortOrder,
}){
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;  
        
        const regex = new RegExp(searchString, "i")
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }

        }

        if (searchString.trim() !='') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOption = { createdAt: sortBy };
        const usersQuery = User.find(query)
            .sort(sortOption)
            .skip(skipAmount)
            .limit(pageSize)     
            
        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();
        const isNext = totalUsersCount > (users.length + skipAmount);

        return { users, isNext }
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}
