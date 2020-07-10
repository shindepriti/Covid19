 /***************************************************************
 * @purpose  : Define Side Bar Home Component
 * @file     : Home.jsx             
 * @overview : Componet Is Parent component 
 * @author   : priti shinde
 * @since    : 2/6/2020
***************************************************************/
import React from 'react';
import Level from './Level';
import '../scss/home.scss'
// import data from '../data/data.min.json';
import timeseries from '../data/timeseries.min.json';
import Table from './Table'
import MiniGraph from './MiniGraph';
import TimeseriesGraph from './TimeseriesGraph';
import Searchbar from './Searchbar'
import indiaData from '../service/indiaservice'
const service = new indiaData()
class Home extends React.Component{
    constructor(){
        super()
        this.state={
            indiaList:{}
        }
    }

    componentDidMount(){
        this.getIndiaData()
    }
    getIndiaData = () => {
       service.getIndiaData()
          .then(data => {
              console.log(data.data)
              this.setState({
                  indiaList: data.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    
    render(){
       
        return(
            <div className="Home">
                <div className="home-left">
                    <Searchbar/>
                    <Level   data={this.state.indiaList['TT']}  /> 
                    <MiniGraph timeseries={timeseries['TT'].dates}  />
                    <Table data={this.state.indiaList}/>
                    <TimeseriesGraph timeseries={timeseries} stateCode={'TT'}  />
                
                </div> 
           </div>
        )
    }
} 
export default Home