const { posts, users } = require("../config/mongoCollections");
const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const usersData = data.users;
const postsData = data.posts;

async function main() {
  try {
    const db = await dbConnection();
    await db.dropDatabase();

    try {
      //Add user
      const newUser0 = await usersData.addUser(
        "Pradeep",
        "Kumar",
        "kpradeep",
        "pradeep@pradeep.com",
        "Pradeep_123"
      );
      const newUser1 = await usersData.addUser(
        "Manas",
        "Acharekar",
        "amanas",
        "Manas@gmail.com",
        "Manas_123"
      );
      const newUser2 = await usersData.addUser(
        "Hanish",
        "Pallapothu",
        "phanish",
        "hanish@gmail.com",
        "Hanish_123"
      );
      const newUser3 = await usersData.addUser(
        "Dhruv",
        "Solanki",
        "sdhruv",
        "dhruv@gmail.com",
        "Dhruv_123"
      );
      const newUser4 = await usersData.addUser(
        "Ashvath",
        "Rameshkumar",
        "rashvath",
        "ashvath@gmail.com",
        "Ashvath_123"
      );
      const newUser5 = await usersData.addUser(
        "Brendan",
        "O'Connell",
        "obrendan",
        "brendan@gmail.com",
        "Brendon_123"
      );
      const newUser6 = await usersData.addUser(
        "Petra",
        "Park",
        "ppetra",
        "petra@gmail.com",
        "Petra_123"
      );
      const newUser7 = await usersData.addUser(
        "Erwin",
        "Smith",
        "serwin",
        "erwin@gmail.com",
        "Erwni_123"
      );
      const newUser8 = await usersData.addUser(
        "Advait",
        "Gharat",
        "gadvait",
        "advait@gmail.com",
        "Advait_123"
      );
      const newUser9 = await usersData.addUser(
        "Test",
        "Tester",
        "ttest",
        "test@gmail.com",
        "Test_123"
      );
      const newUser10 = await usersData.addUser(
        "Log",
        "Logger",
        "llog",
        "log@gmail.com",
        "Log_123"
      );
    } catch (e) {
      console.log(e);
    }

    try {
      //Add posts
      for (let i = 0; i < 10; i++) {
        await postsData.addPost(
          "61a268b3a0a2ed1d119bb770",
          `This is a post ${i}`,
          ["seed test - 1"],
          `Title - ${i}`
        );
      }

      for (let i = 0; i < 10; i++) {
        await postsData.addPost(
          "61a276d16f402d8bd6cf405c",
          `This is a post 1${i}`,
          ["seed test - 2"],
          `Title - 1${i}`
        );
      }

      for (let i = 0; i < 10; i++) {
        await postsData.addPost(
          "61a276d16f402d8bd6cf4074",
          `This is a post 2${i}`,
          ["seed test - 3"],
          `Title - 2${i}`
        );
      }
    } catch (e) {
      console.log(e);
    }

    console.log("Done seeding database");

    await db.serverConfig.close();
  } catch (e) {
    console.log(e);
  }
}

main();
