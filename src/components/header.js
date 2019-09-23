import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { MAX_WIDTH } from "../constants/sizes"
import {
  HEADER_COLOR,
  BASE_TEXT_COLOR,
  BASE_HOVER_COLOR,
} from "../constants/theme"

const MainLink = styled(Link)`
  color: ${BASE_TEXT_COLOR};
  text-decoration: none;
  :hover {
    color: ${BASE_HOVER_COLOR};
  }
`

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: HEADER_COLOR,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: MAX_WIDTH,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <MainLink to="/" style={{}}>
          {siteTitle}
        </MainLink>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
