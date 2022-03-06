import { signInWithPopup, GoogleAuthProvider, UserCredential, signOut, Auth  } from "firebase/auth";

const signInWithGoogle = (auth: Auth): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
}

const signOutUser = (auth: Auth): Promise<void> => {
    return signOut(auth);
}

export { signInWithGoogle, signOutUser };