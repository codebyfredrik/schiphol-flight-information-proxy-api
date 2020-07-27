import axios from 'axios';
import { dataFetchConfig as config } from './../config/dataFetchConfig';

axios.defaults.baseURL = process.env.API_BASE_URL;

axios.defaults.headers = { ...config };

axios.interceptors.response.use(
  (response) => {
    let links, result, lastApiPage;
    if (response.config.parse) {
      return new Promise((resolve, reject) => {
        links = response.headers.link.split('<https');
        lastApiPage = links.filter((link) => {
          return link.includes('last');
        });

        console.log(lastApiPage);

        const regexp = /(?<=page=)\d+(?=.*rel="last")/;
        result = regexp.exec(lastApiPage);

        console.log(result[0]);

        response.lastPage = result[0];
        resolve(response);
      });
    }
    // console.log(response);
    return response;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

export default axios;
