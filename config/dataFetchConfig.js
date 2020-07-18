const dataFetchConfig = {
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
    ResourceVersion: 'v4',
    app_id: process.env.API_ID,
    app_key: process.env.API_KEY,
  },
};

export default dataFetchConfig;
