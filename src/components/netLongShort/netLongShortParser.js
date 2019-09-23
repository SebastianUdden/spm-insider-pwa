const netLongShortParser = async () => {
  return fetch("http://localhost:3000", {
    method: "get",
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

export default netLongShortParser
