
import React from 'react';
import '../scss/table.scss'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Row from './Row';

class TableData extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:this.props.data
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props)
            this.setState({data:this.props.data});
    }
   
    render(){
        return(
            <div className="table-container">
                <Paper elevation={3} className="tablePaper" >
                    <TableContainer >
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>State/UT</TableCell>
                            <TableCell align="right">C</TableCell>
                            <TableCell align="right">A</TableCell>
                            <TableCell align="right">R</TableCell>
                            <TableCell align="right">D</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            { Object.keys(this.state.data)
                            .filter((stateCode)=> stateCode !== 'TT')
                            .map((stateCode)=>(
                                <Row  id="table" key={stateCode} code={stateCode} data={this.state.data[stateCode]} ></Row>
                            ))}
                        <Row key={'TT'} code={'TT'} data={this.state.data['TT']} ></Row>
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
            </div> 
        )
    }
} 
export default TableData;