import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import NetLongShort from "../components/netLongShort/NetLongShort"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <NetLongShort />
  </Layout>
)

export default IndexPage
