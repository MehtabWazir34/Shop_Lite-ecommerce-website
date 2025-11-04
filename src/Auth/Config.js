import { Client, Account, ID, Databases, TablesDB } from "appwrite";

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // API Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);   // Project ID

export const account = new Account(client);
export const DataBases = new Databases(client)
export const tableSData = new TablesDB(client)



export { ID };


// -------- Auth Functions --------
export const signup = async (email, password, name) => {
  return await account.create("unique()", email, password, name);
};

export const login = async (email, password) => {
  return await account.createEmailPasswordSession(email, password);
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.log("console error:", error);
    
    return null;
  }
};

export const logout = async () => {
  return await account.deleteSession("current");
};
