const BASE_URL = 'https://test-task.expane.pro/api/graphql';

const getClients = () => fetch(`${BASE_URL}`)
.then(res => res.json())
  

export default getClients;