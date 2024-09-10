import React from 'react';
import {openDB} from 'idb';
import * as indexedDB from 'idb';

class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keys: [],
      files: [],
    };
  }

  indexedDBStuff = () => {
    // Check for IndexedDB support:
    if (!('indexedDB' in window)) {
      // Can't use IndexedDB
      console.log("This browser doesn't support IndexedDB");
      return false;
    } else {
      // Do IndexedDB stuff here:
      // ...
      //alert('IndexedDB supported')
      return true
    }
  }

  useDB = async  () => {
    // Returns a promise, which makes `idb` usable with async-await.
    //const dbPromise = await openDB('example-database', version, events);
    const dbPromise = await openDB('test-db1', 1)
  }

  createStoreInDB = async () => {
    const dbName = 'filesystem-database'
    const storeName = 'files'
    const db = await openDB(dbName, 1)
    this.setState({ keys: await db.getAllKeys(storeName) })
    this.setState({ files: await db.getAll(storeName) })
    //this.setState({ keys: await db.getAll(storeName) })
    console.log('keys', this.state.keys)
    console.log('keys', this.state.files)
/*
    const dbPromise = await openDB('filesystem-database', 1, {
      upgrade (db) {
        // Creates an object store:
        //db.createObjectStore('storeName', options);

        console.log('Creating a new object store...');
        // Checks if the object store exists:
        if (!db.objectStoreNames.contains('files')) {
          // If the object store does not exist, create it:
          return db.createObjectStore('files')
        } 
        //return db.objectStoreNames.contains('files')
      }
    });
*/
  }

  //const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
  //      IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
  //      dbVersion = 1.0;

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async (e) => {
      // Code to handle the uploaded file
      console.log(file)
      const fileString = e.target.result;
      console.log(fileString)
      console.log("fileString size : " + fileString.length);

      let ob = {
        created:new Date(),
        data: fileString,
        name: file.name,
      }

      try {
        const dbName = 'filesystem-database'
        const storeName = 'files'
        const db = await openDB(dbName, 1)
        //const store = db.transaction(storeName).objectStore(storeName);
        //const value = await store.get(key);
//        const transCount = db.transaction(['count'], 'readwrite');
//        await transCount.store.put(1, 'count')
//        const count = await transCount.store.get('count');
//alert('count: ' + count)
        //
        const trans = db.transaction([storeName], 'readwrite');
        await trans.store.put(ob, ob.name)

        const dataInDb = await trans.store.get(ob.name)
        console.log(dataInDb.name)
        //alert('dataInDb.name:' + dataInDb.name)

        document.querySelector("#image").style = 'border: 1px solid black';
        document.querySelector("#image").src = dataInDb.data;

//	request.onsuccess = function(e) {
//	  const db = e.target.result;
console.log(indexedDB)
//console.log(request)
//	  console.log('db opened');
//	}

//        const db = await this.createStoreInDB()
//        const trans = db.transaction(['files'], 'readwrite');
//        const addReq = trans.objectStore('files').add(ob);
//console.log(trans)
//console.log(ob)
//console.log(db)
      } catch (e) {
        console.log('ERROR FILE SAVE', e)
      }

   //document.querySelector("#image").src = fileString;

//const transaction = db.transaction(["filesystem-database"], "readwrite");
      //console.log(this.state.db)
      //localforage.setItem(theFile.name, fileString);

      //alert('file uploaded: ' + file.name)
    };

    reader.readAsDataURL(file);
    //reader.readAsBinaryString(file);
  };

  componentDidMount = () => {
    this.createStoreInDB()
  };

  //componentWillUpdate(object nextProps, object nextState)

  //componentDidUpdate(object prevProps, object prevState)
  componentDidUpdate = () => {
    alert("componentDidUpdate")
  }

  render() {
    if(this.indexedDBStuff()) {
      //this.useDB()
      return (
        <>
          FileUpload Input: <input type="file" onChange={this.handleFileUpload} />
          <p><img id="image"/></p>
          <p>
            {this.state.keys.map((name, index) => {
              return <>
                <button onClick={async () => {
                  const dbName = 'filesystem-database'
                  const storeName = 'files'
                  const ob = this.state.files[index]
                  const db = await openDB(dbName, 1)
                  const trans = db.transaction([storeName], 'readonly');
                  const dataInDb = await trans.store.get(ob.name)
                  document.querySelector("#image").style = 'border: 1px solid black';
                  document.querySelector("#image").src = dataInDb.data;
                  //console.log(Object.keys(this.state.files[index]))
                  //alert(this.state.files[index].name)
                }}>{index} :: {name}</button>
                <button onClick={async () => {
                  const dbName = 'filesystem-database'
                  const storeName = 'files'
                  const ob = this.state.files[index]
                  const db = await openDB(dbName, 1)
                  const trans = db.transaction([storeName], 'readwrite');
                  //const del = await trans.store.delete('name', ob.name)
                  //let del = await trans.objectStore(storeName).delete(index);
                  console.log(this.state.files)
                  console.log(
                    'xxxxxxxxxxxx DELETED ::::::::',
                    await trans.objectStore(storeName).delete(ob.name),
                    await db.getAll(storeName),
                    //await trans.objectStore(storeName).get(ob.name),
                    //await trans.store.getAll(),
                    //del
                  //  await db.delete(storeName, index)
                  )
                  console.log(this.state.files)
                  alert('delete ' + this.state.files[index].name)
                  this.setState({ files: await db.getAll(storeName) })
                }}> x </button>
              </>
            })}
          </p>
        </>
      );
    } else {
      return (
        <>
          FileUpload IndexedDB not available in this browser 
        </>
      );
    }
  }
}

export default FileUpload;
