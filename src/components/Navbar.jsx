 /***************************************************************
 * @purpose  : Define Side Bar 
 * @file     : Navbar.jsx             
 * @overview : Componet To Handel Side Bar Ui  
 * @author   : priti shinde
 * @since    : 1/6/2020
***************************************************************/
import React from 'react'
import '../scss/navbar.scss'
import { Home ,Users,Package,HelpCircle, Book} from 'react-feather'
class Navbar extends React.Component{
    render(){
        return(
           <div className="navbar">
               <div className="navbar-logo">
                       COVID19<span >INDIA</span>                   
               </div>

               <div className="navbar-menulist">
                    <div className="navbar-menulist-item">
                        <span><Home/></span>
                        <span className="name" data-testid="Home">Home</span>
                    </div>
                    <div className="navbar-menulist-item">
                        <span><Users/></span>
                        <span className="name">Demographics</span>
                    </div>
                    <div className="navbar-menulist-item">
                        <span><Package/></span>
                        <span className="name">Essentials</span>
                    </div>
                    <div className="navbar-menulist-item">
                        <span><HelpCircle/></span>
                        <span className="name">About</span>
                    </div>
                    <div className="navbar-menulist-item">
                        <span><Book/></span>
                        <span  className="name">Blog</span>
                    </div>
               </div>               
           </div>
        )
    }
} 
export default Navbar