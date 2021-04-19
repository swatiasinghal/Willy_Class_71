import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import SearchScreen from './screens/SearchScreen';
import BookTransactionScreen from './screens/BookTransactionScreen';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs'

export default class App extends React.Component
{
  render()
  {
    return(
      <AppContainer/>
    )
  }
}

const TabNavigator = createBottomTabNavigator(
{
    Transaction : BookTransactionScreen,//{screen:BookTransactionScreen},
    Search:SearchScreen,//{screen:SearchScreen}
  },
  {
    defaultNavigationOptions :({navigation})=> ({
        tabBarIcon: ()=> {
          const routeName= navigation.state.routeName;
          console.log(routeName)
          if(routeName==="Transaction") {
            return(
              <Image 
              source ={require("./assets/book.png")}
              style={{width:40,height:40}}
	      />
            )
          }
          else if (routeName==="Search"){
            return(
              <Image 
              source ={require("./assets/searchingbook.png")}
              style={{width:40,height:40}}
	     />)
          }

        }
      } )
  }

  
)

const AppContainer=createAppContainer(TabNavigator);

