import Todoist from './todoist';
import Messages from './messages';

import moment from 'moment';
import 'moment/locale/ja';

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

  const replyingLimit = moment()
    .add(23, 'hours')
    .format('YYYY-MM-DD HH:00');

  Messages
    .search('label: Wantedly is:unread')
    .distributeByUsername(usernames)
    .forEach((username, messages) => {
      const kindOfMessage = {
        'message-noreply': 'DM',
        'scout-message-noreply': 'new scout message',
      }[username] || 'unknown';

      const task = `${replyingLimit} Reply Wantedly ${kindOfMessage} messages`;
      todoist.addTask({ projectId: projectId, task: task });
    });
}
