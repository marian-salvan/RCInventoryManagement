const convertTimeStampToDateString = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("ro-RO");
}

const getCurrentDateString = (): string => {
    const todayTimestamp = Date.now() / 1000;
    return convertTimeStampToDateString(todayTimestamp);
}

export { convertTimeStampToDateString, getCurrentDateString };