type Username = 'message-noreply' | 'scout-message-noreply';

const typeOfUsername = (value: string): value is Username => ['message-noreply', 'scout-message-noreply'].includes(value);

type Distributed = {[key: string]: [Message]};

function main() {
  const distributed = GmailApp
    .search('label: Wantedly is:unread')
    .flatMap(thread => thread.getMessages())
    .reduce((acc: Distributed, message) => {
      const address = message.getFrom()
      const username = address.split('@')[0]

      if (!typeOfUsername(username)) return acc

      const msg = new Message(message.getFrom(), message.getSubject(), message.getBody())
      if (!acc[username]) {
        acc[username] = [msg]
      } else {
        acc[username].push(msg)
      }
      return acc
    }, {})

  console.log(GmailApp.search('label: Wantedly').flatMap(thread => thread.getMessages()).map(message => message.getFrom()).join('\n'))
}
