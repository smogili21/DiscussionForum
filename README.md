#Discussion Forum
www.dforum.com

www.dforum.com/graphql (GraphQL server developed for the project)

Discussion Forum is a web application that enables users to create and engage in discussions on various topics. Users can create an account and participate in existing discussions or start their own threads within different categories, such as Science, Medicine, Astronomy, and more. The forum supports markdown formatting, allowing users to create rich and structured content. Other users can interact with the posts by upvoting, downvoting, and commenting on them. Additionally, users have the ability to explore profiles of other forum members. The website also features a global chatroom where users can join ongoing conversations.

##Core Technologies Used
React: The frontend is developed using React to build a dynamic single-page application.
Redis: Redis is utilized to cache post and user data, improving performance and responsiveness.
GraphQL: The main backend query language is GraphQL, which is used to fetch all the necessary data efficiently.

##Independent Technologies Used
Dolby.io: Dolby.io's high-fidelity audio and video library is integrated to create a seamless chatroom experience for users.
Deploying to DigitalOcean: The application is deployed on DigitalOcean's infrastructure, utilizing a Droplet and reverse-proxying through Nginx.

##Before Running the Project
Before running the project, ensure that you have a Redis server running, as it is used to cache data. You may need to clear any existing cache if necessary. The database does not require seeding, as we are using MongoDB Atlas.

##How to Run
To run the project, navigate to the project directory, which consists of two main directories:

##Frontend:

Move to the Project/client directory.
Run npm install to install the required dependencies.
If testing locally, execute npm run dev.
If creating a deployment build, run npm build followed by npm start.
The React project will run on port 3000.

##Backend:

Move to the Project/server directory.
Run npm install to install the necessary dependencies.
Execute npm start to start the GraphQL server.
The GraphQL server will run on port 4000.