const get = async url => {
  return fetch(url, {
    method: "get",
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

const api = { get }

export default api
