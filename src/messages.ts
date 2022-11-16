import { DistributedT, Distributed, Distributable } from './distributed';

type GmailMessage = GoogleAppsScript.Gmail.GmailMessage;

export default class Messages implements Distributable {
  value: GmailMessage[]

  constructor(value: GmailMessage[]) {
    this.value = value;
  }

  static search(query: string): Messages {
    const value = GmailApp.search(query).flatMap(thread => thread.getMessages());
    return new Messages(value);
  }

  distributeByUsername(usernames: string[]): Distributed {
    return new Distributed(this.value.reduce((acc: DistributedT, message) => {
      for (const username in usernames) {
        if (message.getFrom().includes(username)) {
          if (!acc[username]) {
            acc[username] = [message];
          } else {
            acc[username].push(message);
          }
          break;
        }
      }
      return acc;
    }, {}));
  }
}

