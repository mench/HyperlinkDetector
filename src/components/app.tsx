import * as React from 'react';
import {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {lightBlue500} from 'material-ui/styles/colors';
import {red500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Card, CardHeader ,CardText} from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import * as request from 'request';

require('csvexport');
let glob:any = window;
let Export = glob.Export;
const exporter = Export.create({
    filename: "report.csv",
});

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color :lightBlue500
    }
});
export class App extends Component<any,any>{

    state = {
        snackBar : false,
        snackBarMessage :"",
        loader : false,
        error : false,
        disabled : true,
        disableCsv :true,
        data :{
            url:"",
            keyword : ""
        },
        list:[]
    };
    handleRequestClose = () => {
        this.setState({
            snackBar: false,
        });
    };
    get regex(){
        return Object.defineProperty(this,'regex',{
            value:/https?:\/\/[^"'\s]+/gi
        }).regex;
    }
    onSubmit = e =>{
        e.preventDefault();
        this.setState({
            loader:true
        });
        request.get(this.state.data.url,(error, response, body:string)=>{
            if(!error){
                let list = body.match(this.regex);
                let array = [];
                list.forEach(link=>{
                    if(link.indexOf(this.state.data.keyword.trim()) > -1){
                        array.push(link);
                    }
                });
                this.setState({
                    error :!(array.length > 0),
                    loader:false,
                    disableCsv :!(array.length > 0),
                    list:array
                });
            }else{
                this.setState({
                    loader:false,
                    list:[],
                    disableCsv :true,
                    error :true
                });
            }

        });
    };
    handleRequired(){
        if( this.state.data.keyword.trim().length > 0 && this.state.data.url.trim().length > 0 ){
            this.setState({
                disabled:false
            })
        }else{
            this.setState({
                disabled:true
            })
        }
    }
    handleChangeUrl = e =>{
        this.state.data.url = e.target.value;
        this.handleRequired();
    };
    handleChangeKeyword = e =>{
        this.state.data.keyword = e.target.value;
        this.handleRequired();
    };
    handleExport = () =>{
        let data = this.state.list.map(e=>{
            return {
                URL:e
            }
        });
        if( data && data.length ){
            exporter.downloadCsv(data);
            setTimeout(()=>{
                this.setState({
                    snackBar: true,
                    snackBarMessage:"Report is exported. Check your Downloads folder"
                });
            },2000)
        }else{
            this.setState({
                snackBar: true,
                snackBarMessage:"There are no report to export"
            });
        }
    };
    public render(){
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Card style={{margin: 40}}>
                        <div style={{textAlign:'right',padding:10}}>
                            <RaisedButton  onTouchTap={this.handleExport} disabled={this.state.disableCsv} label="Export Csv"   />
                        </div>
                        <CardText>
                            <form  onSubmit={this.onSubmit} autoComplete="on" >
                                <TextField
                                    style={{width:'55%',marginLeft:'2%',}}
                                    hintText="Url"
                                    type="text"
                                    name="link"
                                    onChange={this.handleChangeUrl}
                                    floatingLabelText="Url"
                                />
                                <TextField
                                    style={{width:'20%',marginLeft:'2%'}}
                                    hintText="Keyword"
                                    type="text"
                                    name="keyword"
                                    onChange={this.handleChangeKeyword}
                                    floatingLabelText="Keyword"
                                />
                                <RaisedButton disabled={this.state.disabled}  type="submit" label="Run" primary={true}  style={{width:'15%',marginLeft:'4%'}} />
                            </form>
                            {
                                (()=>{
                                    if( this.state.loader ){
                                        return  (
                                            <div style={{textAlign:'center'}}>
                                                <CircularProgress style={{margin:50}} />
                                            </div>
                                        )
                                    }
                                    if( this.state.error ){
                                        return (
                                            <div style={{textAlign:'center',color:red500}}>
                                                <h4>There are no items to show</h4>
                                            </div>
                                        );
                                    }
                                    return (
                                       <CardText>
                                           <List style={{height: 600,overflow: 'auto'}}>
                                               {
                                                   this.state.list.map((e,i)=>{
                                                       return  <ListItem key={i} primaryText={e} disabled={true} />
                                                   })
                                               }
                                           </List>
                                       </CardText>
                                    )
                                })()
                            }

                        </CardText>
                        <Snackbar
                            open={this.state.snackBar}
                            message={this.state.snackBarMessage || ""}
                            autoHideDuration={5000}
                            onRequestClose={this.handleRequestClose}
                        />
                    </Card>
                </div>
            </MuiThemeProvider>
        )
    }
}
