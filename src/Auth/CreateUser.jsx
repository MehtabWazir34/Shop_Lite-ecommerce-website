import { DataBases } from "../Auth/Config";
import { Query } from "appwrite";

export const CreateUser = async (userId, name, email, bio = "") => {
  return await DataBases.createDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    import.meta.env.VITE_APPWRITE_Collection_ID,
    // "unique()",
    userId,
    { Name: name, 
        Email: email,
        bio: bio || '' }
  );
  
};

export const GetUser = async (userId) => {
  const result = await DataBases.listDocuments(
    import.meta.env.VITE_APPWRITE_DB_ID,
    import.meta.env.VITE_APPWRITE_Collection_ID,
    [Query.equal("userId", userId)]
  );
  return result.documents[0];
};

export const UpdateUser = async (docId, bio) => {
  return await DataBases.updateDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    import.meta.env.VITE_APPWRITE_Collection_ID,
    docId,
    { bio }
  );
};
