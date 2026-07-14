// Shared shape of the tRPC request context.
// The API app implements createContext(); this type just describes it
// so both server and client agree on what's available in procedures.
export type Context = {
  userId: string | null;
};
