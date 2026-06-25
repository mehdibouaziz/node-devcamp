export const getEnv = (key: string) => {
    const value = process.env[key];
    if (!value) throw new Error(`Config error - missing env key: ${key}`);
    return value;
}