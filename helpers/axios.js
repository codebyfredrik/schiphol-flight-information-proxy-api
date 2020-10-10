import axios from 'axios';
import { dataFetchHeaderConfig as config } from '../config/dataFetchHeaderConfig';

axios.defaults.baseURL = process.env.API_BASE_URL;

axios.defaults.headers = { ...config };

axios.interceptors.response.use(
  (response) => {
    let links;
    let result;
    let lastApiPage;

    if (response.config.parse) {
      return new Promise((resolve, reject) => {
        links = response.headers.link.split('<https');
        lastApiPage = links.filter((link) => {
          return link.includes('last');
        });

        // Logging for troubleshoto
        // console.log(lastApiPage);

        const regexp = /(?<=page=)\d+(?=.*rel="last")/;
        result = regexp.exec(lastApiPage);

        // console.log(result[0]);

        response.lastPage = result[0];
        resolve(response);
      });
    }

    return response;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

export default axios;
