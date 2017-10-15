import React, {Component} from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity }  from 'react-native';
import styles from '../../style/stylesheet.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../containers/header'
import { ping } from '../actions/items';
import ProgressBar from 'react-native-progress/Bar'
import Reactotron from 'reactotron-react-native'

export default class Sync extends Component{
    constructor(props) {
        super(props);
        this.doSync = this.doSync.bind(this);
        this.state = { progress: 0, syncStatus: null };
        this.megaCallback = this.megaCallback.bind(this);
        this.getColorForSyncStatus = this.getColorForSyncStatus.bind(this);
        this.getTextForSyncStatus = this.getTextForSyncStatus.bind(this);
        this.navHome = this.navHome.bind(this);
    }

    componentWillMount(){
         this.props.ping();
        
    }

    static navigationOptions = {
        drawerLabel: 'Sync Data',
        drawerIcon: ({ tintColor }) => (
            <Icon name="refresh" size={24} color='#004A7F' />
            ),
    };

    displayConnectionStatus(connectionStatus){
        if (connectionStatus == true)
            return <Text>Server connection status: <Text style={{color:'green'}}>Connected</Text></Text>;
        else if (connectionStatus == false)
            return <View style={[styles.flexColumn, {alignItems:'center'}]}><Text>Server connection status: <Text style={{color:'red'}}>Not Connected</Text></Text>
            <Text style={{marginTop:10, fontWeight:'bold'}}>Syncing requires a connection to the server</Text></View>;
        else
            return <View style={styles.centerRow}><Text>Checking connection to server: </Text><ActivityIndicator /></View>;
    }

    doSync(){
        this.setState({syncStatus: "In Progress"});

        this.props.megaSync(this.props.userId, this.props.entries, this.props.logbooks, this.megaCallback)
    }

    megaCallback(data){
        Reactotron.log(data);
        this.setState({syncStatus: data.ok ? "Complete" : "Failed"});
    }

    getColorForSyncStatus(){
        switch (this.state.syncStatus)
        {
            case "In Progress":
                return null;
            case "Failed":
                return { color: 'red' };
            case "Complete":
                return { color: 'green'};
        }
    }

    navHome() {
        this.props.dispatch({type: 'NAVIGATE_TO', routeName: 'Home' });
    }

    getTextForSyncStatus(){
        switch (this.state.syncStatus)
        {
            case "In Progress":
                return null;
            case "Failed":
                return <Text>Sorry, there must be a problem.  Try again in a few minutes.</Text>;
            case "Complete":
                return (<View>
                            <Text style={{marginBottom:50}}>Great!  Your data is all synced and secure.</Text>
                            <TouchableOpacity style={{height: '30%', margin:20, backgroundColor:'#4682b4', alignItems:'center', justifyContent:'center'}} onPress={() => this.navHome()}>
                                    <View style={styles.centerRow}>
                                        <Text style={{fontSize:24, color:'white', fontWeight:'bold'}}>BACK TO HOME</Text>
                                    </View>
                            </TouchableOpacity>
                        </View>);
        }
    }

    render(){
        return  (<View style={styles.flexColumn}>
                    <Header navigation={this.props.navigation} title="Sync" />
                    <View style={[styles.flexColumn, { margin:5, alignItems:'center' }]}>
                        <Text style={{fontSize:12}}>
                            The sync process uploads new data in this app to the website, and downloads any new data from the website.
                        </Text>
                        <Text style={{fontSize:12, fontWeight: 'bold'}}>
                            You should sync regularly even if you do not use the website, to avoid the risk of losing your data.
                        </Text>
                    </View>
                    <View style={[styles.centerRow, { marginLeft:10, marginRight:10, marginTop:20, padding:15, borderWidth:1, borderColor:'#dddddd' }]}>                                                
                        {this.displayConnectionStatus(this.props.connectionStatus)}
                    </View>
                    {/* <View style={[styles.centerRow, { margin:5 }]}>                                                
                        <Text>You have {this.props.unsyncedEntries.entries} unsynced entries</Text>
                    </View> */}
                    {this.props.connectionStatus && this.state.syncStatus !== "Complete" && this.state.syncStatus !== "In Progress" ?
                        <View style={[styles.flexColumn, { margin:5, marginTop:30 }]}>
                            <TouchableOpacity onPress={() => this.doSync()} style={{height: '30%', margin:20, backgroundColor:'#4682b4', alignItems:'center', justifyContent:'center'}}>
                                    <View style={styles.centerRow}>
                                        <Text style={{fontSize:24, color:'white', fontWeight:'bold'}}>SYNC NOW</Text>
                                    </View>
                            </TouchableOpacity>
                        </View> : null}
                    { this.state.syncStatus ?
                    <View style={[styles.flexColumn, { margin:5, marginTop:20 }]}>
                        <View style={[styles.centerRow, {marginTop:5}]}>
                            <Text style={[this.getColorForSyncStatus(), {fontSize:36}]}>Sync {this.state.syncStatus}</Text>
                        </View>
                        {(this.state.syncStatus === "In Progress" ? <View style={styles.centerRow}>
                            <ActivityIndicator />
                        </View> : null)}
                    </View> : null }
                    <View style={[styles.centerRow, { margin:5, marginTop:30 }]}>
                        {this.getTextForSyncStatus()}
                    </View>
                </View>);
    }
}