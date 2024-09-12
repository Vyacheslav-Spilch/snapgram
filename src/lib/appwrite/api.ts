import { account, appwriteConfig, avatars, databases, storage } from "@/lib/appwrite/config";
import { INewPost, INewUser } from "@/types";
import { ID } from "appwrite";
import { Query } from 'appwrite'


export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name)
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            imageUrl: avatarUrl,
            username: user.username,
        })
        return newUser
    } catch (err) {
        console.log(err);
        return err
    }
}

export async function saveUserToDB(user: {
    accountId: string
    name: string
    email: string
    imageUrl: URL
    username?: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databasesId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
    } catch (err) {
        console.log(err);
    }
}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password)
        return session
    } catch (err) {
        console.log(err);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get()

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databasesId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        
        if(!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (err) {
        console.log(err)
    }
}


export async function checkActiveSession () {
    try {
        const session = await account.getSession('current'); 
        return session !== null; 
    } catch (err) {
        console.log(err);
    }
}

export async function deleteSessions () {
    try {
        const sessions = await account.listSessions();

        await Promise.all(
        sessions.sessions.map(async (session) => {
            await account.deleteSession(session.$id);
        })
    );
    } catch (err) {
        console.error(err);

    }
};


export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current')
        return session
    } catch (err) {
        console.log(err)
    }
}

//***CREATE POST***
export async function createPost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file[0])
        

        if(!uploadedFile) throw Error

        const fileUrl = await getFilePreview(uploadedFile.$id);


        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
        appwriteConfig.databasesId,
        appwriteConfig.postCollectionId,
        ID.unique(),
    {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
    }
    );


    if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
    }

    return newPost;

    } catch (err) {
        console.log(err)
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile
    } catch (err) {
        console.log(err)
    }
}


export async function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            //@ts-ignore
            "top",
            100
    );

    
        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}


export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts () {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databasesId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        )

        if(!posts) throw Error

        return posts
    } catch (err) {
        console.log(err)
    }
}


export async function likePost (postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databasesId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if(!updatedPost) throw Error
        
        return updatedPost
    } catch (err) {
        console.log(err)
    }
}

export async function savePost (postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databasesId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )

        if(!updatedPost) throw Error
        
        return updatedPost
    } catch (err) {
        console.log(err)
    }
}


export async function deleteSavedPost (savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databasesId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )

        if(!statusCode) throw Error
        
        return { status: 'ok'}
    } catch (err) {
        console.log(err)
    }
}