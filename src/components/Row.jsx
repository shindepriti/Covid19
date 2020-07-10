 /***************************************************************
 * @purpose  : Define Rows Of  
 * @file     : Row.jsx             
 * @overview : Componet To Handel Rows of Table Ui  
 * @author   : priti shinde
 * @since    : 5/6/2020
***************************************************************/
import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {PRIMARY_STATISTICS,STATE_NAMES,getStatistic} from '../utils/commonfunc';
import { IconButton, Collapse, Box, TableFooter } from '@material-ui/core';

class Row extends React.Component{
    constructor(props){
        super(props)
        this.state={
            code:this.props.code,
            data:this.props.data,
            open:false
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps !== this.props)
            this.setState({code:this.props.code,data:this.props.data});
    }

    toggleSubTable=()=> {
        this.setState({open:!this.state.open})
    }
    render(){
        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        {this.state.code !== 'TT' ? 
                            <IconButton aria-label="expand row" size="small" onClick={this.toggleSubTable}>
                                {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                            </IconButton>
                        :""}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {STATE_NAMES[this.state.code]}
                    </TableCell>
                    {PRIMARY_STATISTICS.map((statistics) => (
                        <TableCell key={statistics}  >
                            <div className={"statistic"}>
                                <span className={` is-${statistics}`}> {getStatistic(this.state.data , 'delta',statistics) > 0 ? `+`+getStatistic(this.state.data , 'delta',statistics) : ` `} </span>
                                <span className={"total"}> {getStatistic(this.state.data , 'total',statistics)} </span>
                            </div>
                        </TableCell>
                    ))}
                    
                </TableRow>
                {this.state.open && this.state.data.districts  ? 
                <TableRow>
                    <TableCell colSpan={6}>
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <Box margin={1} className="subTable">
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>District</TableCell>
                                            <TableCell align="right">C</TableCell>
                                            <TableCell align="right">A</TableCell>
                                            <TableCell align="right">R</TableCell>
                                            <TableCell align="right">D</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { this.state.data.districts ?  
                                            Object.keys(this.state.data.districts)
                                            .map((district)=>(
                                                <TableRow key={district}>
                                                    <TableCell component="th" scope="row">
                                                        {district}
                                                    </TableCell>
                                                    {PRIMARY_STATISTICS.map((statistics) => (
                                                        <TableCell key={statistics} >
                                                            <div className={"statistic"}>
                                                                <span className={` is-${statistics}`}> {getStatistic(this.state.data.districts[district] , 'delta',statistics) > 0 ?`+`+getStatistic(this.state.data.districts[district] , 'delta',statistics):" "} </span>
                                                                <span className={"total"}> {getStatistic(this.state.data.districts[district] , 'total',statistics)} </span>
                                                            </div>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                            
                                        :""
                                        }

                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                End of {STATE_NAMES[this.state.code]} Districts
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>

                            </Box>
                        </Collapse>
                    </TableCell>

                </TableRow>:""}
            </React.Fragment>
        )
    }
}

export default Row;