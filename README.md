<h1 align="center">
  Progressive Web App Template
</h1>

## 🚀 Quick start

1.  **Clone the project**

    Copy the git url and do `git clone git-url project-name` from your repository folder

1.  **Start developing**

    Navigate into your new site’s directory, remove old git, install dependencies and start it up.

    ```shell
    cd project-name/
    rm -rf .git
    npm install
    npm start
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    To edit the content run `code .` from your `project-name` folder. Edit `src/pages/index.js`, then save your changes and the browser will update in real time!

1.  **💫 Deploy to github**

    When you are happy with your changes

    1. Go to `https://github.com/user-name?tab=repositories`
    1. Click the `New` button
    1. Select a repository name that matches your project-name
    1. Keep default settings, public and don't initialize with readme
    1. Open your project-name folder in the terminal and run the following

    ```shell
    cd project-name/
    git init
    git add -A
    git commit -m "Initial commit"
    git remote add origin https://github.com/SebastianUdden/project-name.git
    git push -u origin master
    ```

1.  **💫 Deploy to netlify**

    To deploy the client with continuous integration and on a public address for free, create an account with netlify and follow the instructions to connect it to your github (make sure to allow access to repositories)

    1. Click `New site from Git`
    1. Click `Github`
    1. Write `project-name` in the search-bar and click the `project-name`
    1. Keep default settings and click `Deploy site`, netlify will spit out a randomly generated website name.
    1. When the build is complete you can simply go to the website name and see the project live, any new commits will cause a build from netlify and after a while the page will be updated.

<br>
<hr>

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser. This is where `service-worker update` is specified.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: PWA Template is licensed under the MIT license.

10. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.
