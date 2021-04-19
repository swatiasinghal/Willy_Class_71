import * as React from 'react';
import {Text,View,TouchableOpacity,StyleSheet,TextInput,Image, Alert} from 'react-native';

import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';

import  firebase from 'firebase';
import db  from '../config.js'

export default class BookTransactionScreen extends React.Component
{
    constructor()
    {
        super();
        this.state=
        {
            hasCameraPermissions:null,
            scanned:false,
            scannerData:'empty data',
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:""
        }
    }

   getCameraPermissions=async(id)=>
    {
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState(
            {
                hasCameraPermissions:status==="granted",
                buttonState: id,
                scanned:false

            }
        )
    }
    handleBarCodeScanned=async({type,data})=>
    {
	const {buttonState}=this.state
        if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
    }

    initiateBookIssue=async()=>
    {
        console.log("inside initiateBookIssue")
        //add a transaction
        db.collection("Transaction").add(
            {
                'studentId':this.state.scannedStudentId,
                'bookId':this.state.scannedBookId,
                'date':firebase.firestore.TIMESTAMP.now().toDate(),
                'transactionType':"ISSUE"
            }
        )

        //change book status
            db.collection("Books").doc(this.state.scannedBookId).update(
                {
                    'bookAvailability':false
                }
            )

            //change no.of books issued for the student
            db.collection("Students").doc(this.state.scannedStudentId).update(
                {
                    'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
                }
            )

            Alert.alert("Book Issued");
            this.setState(
                {
                    scannedBookId:'',
                    scannedStudentId:''
                }
            )
    }

    
    initiateBookReturn=async()=>
    {

        console.log("inside initiate BookReturn");

        db.collection("Transaction").add(
            {
                'studentId':this.state.scannedStudentId,
                'bookId':this.state.scannedBookId,
                'date':firebase.firestore.TIMESTAMP.now().toDate(),
                'transactionType':"RETURN"
            }
        )

        //change book status
            db.collection("Books").doc(this.state.scannedBookId).update(
                {
                    'bookAvailability':true
                }
            )

            //change no.of books issued for the student
            db.collection("Students").doc(this.state.scannedStudentId).update(
                {
                    'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
                }
            )

            Alert.alert("Book Returned");
            this.setState(
                {
                    scannedBookId:'',
                    scannedStudentId:''
                }
            )
        
    }


    handleTransaction=async()=>
    {
        var transactionMessage ;
        db.collection("Books").doc(this.state.scannedBookId).get()
        .then((doc)=>
        {
            var book = doc.data();
            if(book.bookAvailability)
            {
                this.initiateBookIssue();
                transactionMessage="Book Issued";
            }
            else{
                this.initiateBookReturn();
                transactionMessage="Book Returned"
            }
           console.log(doc.data())
        })
        this.setState(
            {
                transactionMessage:transactionMessage
            }
        )
    }
    render ()
    {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned=this.state.scanned;
        const buttonState = this.state.buttonState;

        if (buttonState!= "normal" && hasCameraPermissions)
        {
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}  />
            
            )
        }
        else if(buttonState==='normal') {
        return(
            <View style={styles.container}>

                <View>
                    <Image source={require("../assets/booklogo.jpg")}
                    style={{width:200,height:200}}/>
                    <Text style={{textAlign:'center',fontSize:30}}>Willy</Text>
                    </View>

            <View style ={styles.inputView}>
                <TextInput style={styles.inputBox} placeholder='Book Id'
                value={this.state.scannedBookId}/>
                <TouchableOpacity style={styles.scanButton} 
                onPress={()=>
                {
                    this.getCameraPermissions("BookId")
                }}>
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>

                <View style ={styles.inputView}>
                <TextInput style={styles.inputBox} placeholder='Student Id'
                value={this.state.scannedStudentId}/>
                <TouchableOpacity style={styles.scanButton}
                 onPress={()=>
                    {
                        this.getCameraPermissions("StudentId")
                    }}>
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>

                    <TouchableOpacity style={styles.submitButton}
                    onPress={async()=>{this.handleTransaction()}}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
        )
        }
        
    }
}

const styles = StyleSheet.create(
    {
        container : 
        {
            flex:1,
            justifyContent:'center',
            alignItems:'center'
        },

        submitButton:
        {
            backgroundColor:'#FBC02D',
            width:100,
            height:50
        },
        submitButtonText:
        {
            padding:10,
            textAlign:'center',
            fontSize:20,
            fontWeight:'bold',
            color:'white'
        },
        displayText :
        {
            fontSize:25,
            textDecorationLine:'underline'
        },
        scanButton :
        {
            backgroundColor:'grey',
            padding :10,
            margin:10
        },
        buttonText:
        {
            fontSize:10,
            textAlign:'center',
            margin:20
        },
        inputView:
        {

            flexDirection:'row',
            margin:20
        },
        inputBox:
        {
            width:200,
            height:40,
            borderWidth:1.5,
            borderRightWidth:0,
            fontSize:20
        }

    }
)