import { Timestamp } from "firebase/firestore";

const convertTimeStampToDateString = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("ro-RO");
}

const convertDateToTimestamp = (date: Date): Timestamp | null => {
    return null;
}

const getCurrentDateString = (): string => {
    const todayTimestamp = Date.now() / 1000;
    return convertTimeStampToDateString(todayTimestamp);
}

export { convertTimeStampToDateString, convertDateToTimestamp, getCurrentDateString };