import axios from 'axios'

export default axios.create({
  baseURL: window.baseUrl + 'rest/V1/',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
