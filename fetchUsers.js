export default function fetchUsers() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something bad happened.");
      }
      return response.json();
    })
    .then((users) => {
      users.forEach((user) => {
        console.log(user.name);
      });
      return users;
    })
    .catch((error) => {
      console.error("Ошибка", error);
      throw error;
    });
}

fetchUsers();
