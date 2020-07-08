import React from 'react';
import Level from './Level';
import data from '../data/data.min.json';
import timeseries from '../data/timeseries.min.json';
import Table from './Table'
import MiniGraph from './MiniGraph';
import TimeseriesGraph from './TimeseriesGraph';

class Home extends React.Component{
    
    render(){
       
        return(
            <div className="Home">
                <div className="home-left">
                    <Level data={data['TT']}  />
                    <MiniGraph timeseries={timeseries['TT']?.dates}  />
                    <Table data={data}/>
                    <TimeseriesGraph timeseries={timeseries} stateCode={'TT'}  />
                
                </div> 
           </div>
        )
    }
} 
export default Home