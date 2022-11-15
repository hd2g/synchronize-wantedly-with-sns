interface Sns {
  name: string
  url: string

  notify(distributed: Distributed): Promise<void>
}

// module Slack implements Sns {
//   name = 'slack';
//   url = '';

//   notify(distributed: Distributed): Promise<void> {
//     return new Promise((resolve, reject) => {
//     });
//   }
// }
