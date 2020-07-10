import axios from 'axios';
require('dotenv').config();
const baseUrl= process.env.REACT_APP_INDIAURL;

export default class note{
  
    getIndiaData(){       
        return axios.get(baseUrl+'/v4/min/data.min.json')  
    }
}