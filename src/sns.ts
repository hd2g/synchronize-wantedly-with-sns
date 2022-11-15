import { WebClient, ChatPostMessageResponse } from '@slack/web-api';

interface Sns {
  name: string;
  token?: string;
  url?: string;
}

interface SnsNotifiable<Response> {
  notify(distributed: Distributed): Promise<Response>;
}

class Slack implements Sns, SnsNotifiable<ChatPostMessageResponse> {
  name = 'slack';
  token = process.env['SLACK_TOKEN'];

  notify(distributed: Distributed): Promise<ChatPostMessageResponse> {
    const client = new WebClient(this.token);
    const channelId = '';
    const message = '';
    return client.chat.postMessage({
      channel: channelId,
      text: message,
    });
  }
}

class Chatwork implements Sns, SnsNotifiable<ChatPostMessageResponse> {
}
