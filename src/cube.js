import cubejs from '@cubejs-client/core';

const cubeApi = cubejs(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTMwOTUwODAsImV4cCI6MTU5MzE4MTQ4MH0.-ju5B1TtKq2Dd13iAJ5l6NyecUOTVgZo5poQkuiuVWg',
  { apiUrl: 'http://localhost:4000/cubejs-api/v1' },
);

export default cubeApi;

export function query(json) {
  return cubeApi.load(json);
}
