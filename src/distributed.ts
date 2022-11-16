type GmailMessage = GoogleAppsScript.Gmail.GmailMessage;

export type DistributedT = { [key: string]: GmailMessage[] };

export class Distributed {
  value: DistributedT;

  constructor(value: DistributedT) {
    this.value = value;
  }

  forEach(proc: (username: string, messages: GmailMessage[]) => void): void {
    Object.keys(this.value).forEach(username => {
      const messages = this.value[username];
      proc(username, messages);
    });
  }
}

export interface Distributable {
  distributeByUsername(usernames: string[]): Distributed;
}


