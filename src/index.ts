import Todoist from './todoist';
import Messages from './messages';

type GmailMessage = GoogleAppsScript.Gmail.GmailMessage;

const usernames = [
  'message-noreply',
  'scout-message-noreply',
];

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
