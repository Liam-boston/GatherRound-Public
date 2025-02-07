# 📌GatherRound 

*A full-stack web application designed to help coordinate board game club events. Organize game nights, manage club memberships, and keep track of RSVPs, all in one place. Let the games begin!*

## 🚀Features
* **Club Management**: Create and manage clubs, invite members, and build communities based on shared interests.
* **Event Scheduling**: Plan game nights, track RSVPs and curate game lists.
* **Voting & Group Composition**: Allow members to vote on games and form groups based on skill level and interest.
* **User Authentication**: Secure login and profile management via Firebase Authentication.

## 🛠️Tech Stack
* **Node.js** (v20.15.0)
* **npm** (v10.7.0)
* **React.js** (v18.3.1)
* **Firebase** (v10.12.3)
    * **Cloud Firestore**
    * **Firebase Authentication**
* **Babel** (v7.24.7)
* **Jest** (v29.7.0)

<br />

## ⚡Getting Started

### Prerequisites
Install the following on your machine: 
* **[Node.js LTS(v20.13.1)](https://nodejs.org/en)** 
* **[Visual Studio Code](https://code.visualstudio.com/)**

You can download and install them from the provided links.

### Install Dependencies
Before running the server or client, you'll need to install the required dependencies for each:
1. Open the project in **Visual Studio Code**.
2. In the root directory of the project, open a terminal in Visual Studio Code and run the following command to install dependencies for both the server and client:

```shell
npm install
```

This will install all the necessary packages listed in the `package.json` files for both the server and client.

### Running the Server
1. Open a new terminal instance in **Visual Studio Code** and navigate to the `/server` directory.
2. Run the following command to start the server:

```shell
npm start
```

3. Once the server is running, open a browser and go to http://localhost:9000/test to verify everything is working.

### Running the Client
1. Open a new terminal instance in **Visual Studio Code** and navigate to the `/client` directory.
2. Run the following command to install client-side dependencies (if you haven't done so already):

```shell
npm install
```

3. Then, start the client by running:

```shell
npm start
```

4. Once the client is up and running, open a browser and go to http://localhost:3000 to view the app.

### Learn more

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Build for production

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
