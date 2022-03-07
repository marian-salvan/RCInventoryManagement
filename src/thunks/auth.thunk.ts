import { createAsyncThunk } from "@reduxjs/toolkit";
import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";

const signInUserAsync = createAsyncThunk(
    'app/signInUser',
    async ({auth, email, password}: { auth: Auth, email: string, password: string }) => {
      const response: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return response;
    }
);

const signOutUserAsync = createAsyncThunk(
    'app/signOutUser',
    async (auth: Auth) => {
      const response = await signOut(auth);
      return response;
    }
);

export { signInUserAsync, signOutUserAsync };