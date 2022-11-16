import Todoist from './todoist';

const usernames = ['message-noreply', 'scout-message-noreply'];

type GmailMessage = GoogleAppsScript.Gmail.GmailMessage;

type DistributedT = { [key: string]: GmailMessage[] };

class Distributed {
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

class Messages {
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

function main() {
  const token = PropertiesService.getScriptProperties().getProperty('TODOIST_TOKEN');
  if (!token) throw new Error('TODOIST_TOKEN is unset');

  const projectId = PropertiesService.getScriptProperties().getProperty('TODOIST_PROJECT_ID');
  if (!projectId) throw new Error('TODOIST_PROJECT_ID is unset');

  const todoist = Todoist.fromToken(token);

  Messages
    .search('label: Wantedly is:unread')
    .distributeByUsername(usernames)
    .forEach((username, messages) => {
      const kindOfMessage = {
        'message-noreply': 'ダイレクトメッセージ',
        'scout-message-noreply': 'スカウトメッセージ',
      }[username] || 'unknown';

      const replyingLimit = '';
      const task = `${replyingLimit} Reply Wantedly ${kindOfMessage} messages`;
      todoist.addTask({ projectId: projectId, task: task });
    });
}
