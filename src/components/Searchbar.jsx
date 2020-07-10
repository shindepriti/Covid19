 /***************************************************************
 * @purpose  : Define Side Bar Home Component
 * @file     : Home.jsx             
 * @overview : Componet Is Parent component 
 * @author   : priti shinde
 * @since    : 2/6/2020
***************************************************************/
import React from 'react';
import {FormControl,InputAdornment, InputBase} from '@material-ui/core';
import '../scss/searchbar.scss'
import SearchIcon from '@material-ui/icons/Search';
class Searchbar extends React.Component{
    
    handleChange=(event)=>{
        this.setState({[event.target.name]: event.target.value});
    }
    
    render(){
       
        return(
            <div>
                 <FormControl fullWidth className="searchform">
                    <InputBase
                    name="search"
                    id="search"
                    className="searchinput"
                    placeholder="Search.."
                    onChange={this.handleChange}
                    startAdornment={<InputAdornment position="start"><SearchIcon className="searchicon"/></InputAdornment>}
                   
                    />
                </FormControl>
                
           </div>
        )
    }
} 
export default Searchbar