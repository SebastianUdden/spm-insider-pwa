import React, { useEffect } from "react"
import styled from "styled-components"
import { colors } from "../../constants/colors"
import { numberWithSpaces } from "../common/utils"

export const Button = styled.button`
  background-color: ${p => (p.selected ? colors.brightGrey : colors.darkGrey)};
  color: ${colors.darkWhite};
  padding: 0.5rem;
  border: 1px solid ${colors.darkGrey};
`

export const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const linearRemap = (value, oldMin, oldMax, newMin, newMax) => {
  const newScale = newMax - newMin
  const valueAsPct = (value - oldMin) / (oldMax - oldMin)
  const scaledValue = valueAsPct * newScale
  const shiftedAndScaledValue = scaledValue + newMin
  return shiftedAndScaledValue
}

const precise = (x, n) => {
  return Number.parseFloat(x).toPrecision(n)
}

const maxHeight = 400
const maxWidth = 400
const widthIndentationLeft = 0.15
const widthIndentationRight = 0.9
const strokeWidth = 1
const radius = 3

const getX = (index, length) => {
  const shiftedAndScaled = linearRemap(
    index,
    0,
    length,
    maxWidth * widthIndentationLeft + 15,
    maxWidth * widthIndentationRight - 15
  )
  return shiftedAndScaled
}

const getY = (position, high, low) => {
  const shiftedAndScaled = linearRemap(
    position,
    low,
    high,
    maxHeight * 0.1,
    maxHeight * widthIndentationRight
  )
  return maxHeight - shiftedAndScaled
}

const Graph = ({
  id,
  positions,
  selectedPoint,
  setSelectedPoint,
  showZeroLine,
  minValue,
  maxValue,
}) => {
  const yValues = positions.map(p => p.y)
  const xValues = positions.map(p => p.x)
  const positionsDescending = yValues.slice().sort((a, b) => b - a)
  const high = maxValue || positionsDescending[0]
  const low = minValue || positionsDescending[positionsDescending.length - 1]
  const positionsXY = yValues.map(
    (p, i) =>
      `${getX(
        i,
        positions.length > 1 ? positions.length - 1 : positions.length
      )},${getY(p, high, low)}`
  )

  const oneDown = point => (point > 0 ? point - 1 : 0)
  const oneUp = point =>
    point < positions.length - 1 ? point + 1 : positions.length - 1
  const fiveDown = point => (point > 5 ? point - 5 : 0)
  const fiveUp = point =>
    point < positions.length - 5 ? point + 5 : positions.length - 1
  const twentyDown = point => (point > 20 ? point - 20 : 0)
  const twentyUp = point =>
    point < positions.length - 20 ? point + 20 : positions.length - 1

  const checkKey = e => {
    const event = e || window.event
    if (event.keyCode === 38) {
      // up arrow
      e.stopPropagation()
      e.preventDefault()
      setSelectedPoint(fiveUp(selectedPoint))
    } else if (event.keyCode === 40) {
      // down arrow
      e.stopPropagation()
      e.preventDefault()
      setSelectedPoint(fiveDown(selectedPoint))
    } else if (event.keyCode === 37) {
      // left arrow
      setSelectedPoint(oneDown(selectedPoint))
    } else if (event.keyCode === 39) {
      // right arrow
      setSelectedPoint(oneUp(selectedPoint))
    }
  }

  useEffect(() => {
    document.onkeydown = checkKey
  }, [selectedPoint])

  return (
    <Wrapper>
      <FlexWrapper>
        <NavigateButton
          id="twenty-down"
          onClick={() => setSelectedPoint(twentyDown(selectedPoint))}
        >
          &#x3c;&#x3c;&#x3c;
        </NavigateButton>
        <NavigateButton
          id="five-down"
          onClick={() => setSelectedPoint(fiveDown(selectedPoint))}
        >
          &#x3c;&#x3c;
        </NavigateButton>
        <NavigateButton
          id="one-down"
          onClick={() => setSelectedPoint(oneDown(selectedPoint))}
        >
          &#x3c;
        </NavigateButton>
        <NavigateButton
          id="one-up"
          onClick={() => setSelectedPoint(oneUp(selectedPoint))}
        >
          &#x3e;
        </NavigateButton>
        <NavigateButton
          id="five-up"
          onClick={() => setSelectedPoint(fiveUp(selectedPoint))}
        >
          &#x3e;&#x3e;
        </NavigateButton>
        <NavigateButton
          id="twenty-up"
          onClick={() => setSelectedPoint(twentyUp(selectedPoint))}
        >
          &#x3e;&#x3e;&#x3e;
        </NavigateButton>
      </FlexWrapper>
      <SVG viewBox={`0 0 ${maxWidth} ${maxHeight}`}>
        <title id={`${id}-title`}>
          A line chart showing some information about {id}
        </title>
        <polyline
          fill="none"
          stroke={colors.orange}
          strokeWidth={strokeWidth}
          points={positionsXY}
        />
        <g>
          <Text key="maxValue" x={0} y={maxHeight * 0.1}>
            {numberWithSpaces(maxValue)}
          </Text>
        </g>
        <g>
          <Line
            x1={maxWidth * widthIndentationLeft}
            x2={maxWidth * 0.9}
            y1={maxHeight * 0.9}
            y2={maxHeight * 0.9}
          />
        </g>
        <g>
          <Text key="minValue" x={0} y={maxHeight * 0.9}>
            {numberWithSpaces(minValue)}
          </Text>
        </g>
        <g>
          <Line
            x1={maxWidth * widthIndentationLeft}
            x2={maxWidth * widthIndentationLeft}
            y1={maxHeight * 0.9}
            y2={maxHeight * 0.1}
          />
        </g>
        {showZeroLine && (
          <>
            <g>
              <Text key="zeroValue" x={30} y={maxHeight * 0.5}>
                0
              </Text>
            </g>
            <g>
              <Line
                x1={maxWidth * widthIndentationLeft}
                x2={maxWidth * 0.9}
                y1={getY(0, high, low)}
                y2={getY(0, high, low)}
              />
            </g>
          </>
        )}
        <g>
          {yValues.map(
            (p, i) =>
              selectedPoint === i && (
                <React.Fragment key={p}>
                  <Text
                    interactive
                    positive={yValues[selectedPoint] > 0}
                    x={positionsXY[i].split(",")[0] - maxWidth * 0.04}
                    y={maxHeight * 0.05}
                  >
                    {numberWithSpaces(p.toFixed(0))}
                  </Text>
                  <Line
                    interactive
                    positive={yValues[selectedPoint] > 0}
                    x1={positionsXY[i].split(",")[0]}
                    x2={positionsXY[i].split(",")[0]}
                    y1={maxHeight * 0.94}
                    y2={maxHeight * 0.06}
                  />
                </React.Fragment>
              )
          )}
        </g>
        <g>
          {yValues.map(
            (p, i) =>
              (p === high || p === low) && (
                <Text key={p} x={0} y={positionsXY[i].split(",")[1]}>
                  {precise(Number(p), 6)}
                </Text>
              )
          )}
        </g>
        <g>
          {xValues.map(
            (t, i) =>
              selectedPoint === i && (
                <Text
                  key={t}
                  positive={yValues[selectedPoint] > 0}
                  interactive
                  x={positionsXY[i].split(",")[0] - maxWidth * 0.1}
                  y={maxHeight * 0.98}
                >
                  {t}
                </Text>
              )
          )}
        </g>
        <g data-setname="Our first data set">
          {positions.map((p, i) => (
            <Circle
              key={`${p.value}-${p.time}`}
              positive={yValues[selectedPoint] > 0}
              interactive={i === selectedPoint}
              onClick={() => setSelectedPoint(i)}
              cx={positionsXY[i].split(",")[0]}
              cy={positionsXY[i].split(",")[1]}
              data-value={p.value}
              r={radius}
            />
          ))}
        </g>
      </SVG>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 0.1rem;
`

const SVG = styled.svg`
  fill: 1px solid ${colors.darkGrey};
`

const Line = styled.line`
  stroke: ${p =>
    p.interactive
      ? p.positive
        ? colors.green
        : colors.red
      : colors.darkWhite};
  stroke-width: ${p => (p.interactive ? 0.5 : strokeWidth)};
`

const Text = styled.text`
  font-size: x-small;
  fill: ${p =>
    p.interactive
      ? p.positive
        ? colors.green
        : colors.red
      : colors.darkWhite};
`

const Circle = styled.circle`
  fill: ${p =>
    p.interactive ? (p.positive ? colors.green : colors.red) : colors.orange};
  :hover {
    fill: ${colors.red};
    cursor: pointer;
  }
  :focus {
    fill: ${colors.red};
  }
`

const NavigateButton = styled(Button)`
  touch-action: manipulation;
  flex-grow: 1;
  margin: 0 0.2rem;
  :first-child {
    margin-left: 0;
  }
  :last-child {
    margin-right: 0;
  }
`

export default Graph
