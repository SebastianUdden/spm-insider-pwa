module.exports = {
  siteMetadata: {
    title: `SPM Insider`,
    description: `Tool that handles visualization of trades.`,
    author: `@SebastianUdden`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `SPM Insider`,
        short_name: `SPM Insider`,
        start_url: `/`,
        background_color: `#444`,
        theme_color: `#222`,
        display: `standalone`,
        icon: `src/images/rocket.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
