export const Try = <A>(proc: () => A): Promise<A> =>
  new Promise((resolve, reject) => {
    try {
      return resolve(proc());
    } catch (e) {
      return reject(e);
    }
  });
