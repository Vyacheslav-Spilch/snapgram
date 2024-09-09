import { account, appwriteConfig, avatars, databases } from "@/lib/appwrite/config";
import { INewUser } from "@/types";
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


export const checkActiveSession = async () => {
    try {
        const session = await account.getSession('current'); 
        return session !== null; 
    } catch (err) {
        console.log(err);
    }
}

export const deleteSessions = async () => {
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
