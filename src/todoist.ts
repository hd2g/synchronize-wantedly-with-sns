import { v4 as uuidv4 } from 'uuid';

interface AddTaskProps {
  projectId: string;
  task: string;
}

type HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;

export default class Todoist {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  static fromToken(token: string): Todoist {
    if (token === '') throw new Error('token is empty');
    return new Todoist(token);
  }

  addTask({projectId, task}: AddTaskProps): Promise<HTTPResponse> {
    const requestId = uuidv4();
    return new Promise((resolve, reject) => {
      const response = UrlFetchApp.fetch(`https://api.todoist.com/rest/v2/tasks`, {
        method: 'post',
        contentType: 'application/json',
        headers: {
          'X-Request-Id': requestId,
          Authorization: `Bearer ${this.token}`,
        },
        payload: JSON.stringify({
          'project_id': projectId,
          'content': task,
        }),
      });

      const status = response.getResponseCode();
      const report = /^2[0-9]{2}$/.test(String(status)) ? resolve : reject;
      return report(response);
    });
  }
}
