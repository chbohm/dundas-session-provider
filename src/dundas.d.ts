
declare namespace dundas {
  type AccountName = string;
  type SessionId = string;

  interface DundasAccount {
    accountName: AccountName;
    password: string;
    isWindowsLogOn: boolean;
    deleteOtherSessions: boolean,
  }
  interface Logger {
    info(message: string, metadata?: any);
    debug(message: string, metadata?: any);
    warn(message: string, metadata?: any);
    error(message: string, metadata?: any);
  }


  interface IDundasSessionProvider {
    getSessionId(accountName: string,  logger: dundas.Logger): Promise<SessionId>;
    getDundasAccounts(): Map<dundas.AccountName, dundas.DundasAccount>;
    getDundasAccount(accountName:string): dundas.DundasAccount;
    getSessionIdStatusForAllAccounts(): Promise<any>;
  }
}
