import axios from 'axios';
import { dataFetchConfig as config } from './../config/dataFetchConfig';

axios.defaults.baseURL = process.env.API_BASE_URL;

axios.defaults.headers = { ...config };

axios.interceptors.response.use(
  (response) => {
    // console.log(typeof response.config.parse);
    let hasMore, temp, finalItem, last;
    if (response.config.parse) {
      return new Promise((resolve, reject) => {
        // console.log(response.headers.link);
        temp = response.headers.link;
        hasMore = temp.split('<https');
        // console.log(hasMore);
        finalItem = hasMore.filter((item) => {
          return item.includes('last');
        });
        console.log(finalItem);
        const regexp = /(?<=page=)\d+(?=.*rel="last")/;
        last = regexp.exec(finalItem);
        if (last[0] === null) {
          reject('error');
        }
        console.log(last[0]);
        response.lastPage = last[0];
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
