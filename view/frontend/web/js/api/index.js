export default function request (url, params = {}) {
  return new Promise((resolve, reject) => {
    fetch(url, params)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error(response.statusText);
      })
      .then(response => {
        return response.json();
      })
  });
};
