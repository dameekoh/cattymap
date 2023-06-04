<script>
    import { initializeApp } from "firebase/app";
    import { getStorage, ref as sref, uploadString, getDownloadURL} from "firebase/storage"
    import { ref, get, set, getDatabase, onValue, update } from 'firebase/database';
    import { onMount } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';

    const firebaseConfig = {
        apiKey: "AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA",
        authDomain: "cattymap-1b9a3.firebaseapp.com",
        projectId: "cattymap-1b9a3",
        storageBucket: "cattymap-1b9a3.appspot.com",
        messagingSenderId: "368074086145",
        appId: "1:368074086145:web:393f103f6ca32a06bbad00",
        measurementId: "G-442J384EW1",
        databaseURL: 'https://cattymap-1b9a3-default-rtdb.asia-southeast1.firebasedatabase.app/',
    };

    const app = initializeApp(firebaseConfig);

    const storage = getStorage();
    const database = getDatabase(app);
  
    let videoElement
    let imageURL = '' 
    let data = {
        name, 
        latitude, 
        longitude, 
        avatar, 
        image, 
        likeCount, 
        caption
    }
  
    //reference root 
    const dataRef = ref(database, "/");
    // reference Cat table (postNumber, name, latitude, longitude, avatar, image, likeCount)
    const catPostRef = ref(database, "Cat");
    // reference Cat post count 
    const catPostCountRef = ref(database, "CatCount");
    let catPostCount

     /**
   * function to send data to database  
   * @param {Object} catDataObj
   */
   function sendToCatDB(catDataObj) {
    get(catPostCountRef).then((snapshot) => {
      catPostCount = snapshot.val();
      set(catPostCountRef, catPostCount + 1);
      const uniqueKey = catPostCount;
      const dataToUpdate = { [uniqueKey]: {name: catDataObj.name, 
                                         latitude: catDataObj.lat, 
                                         longitude: catDataObj.lng,  
                                         avatar: catDataObj.avatar, 
                                         image: catDataObj.image, 
                                         likeCount: catDataObj.likeCount,
                                         caption: catDataObj.caption}};
    update(catPostRef, dataToUpdate)
        .then(() => {
          addCatMarkers(); // Add cat markers immediately after updating the database
        })
        .catch((error) => {
          console.error('Error updating database:', error);
        });
    }).catch((error) => {
      console.error(error);
    });
  }

    async function savePicture(data){
      // uploading to Firebase Storage
      let fileName = uuidv4();
      // might have to change jpeg 
      let fileRef = sref(storage,`images/${fileName}.jpeg`);
      // might have to change data.image to a image data url 
      await uploadString(fileRef, data.image, 'data_url').then((snapshot) => {
        console.log('Uploaded a data_url string!');
      }).catch((error) => console.log(error));

      // uploading to Firebase Realtime Database
      data.image = await getImageURL();
      sendToCatDB(data);
    }

    // get image url from Firebase storage 
    function getImageURL(){
        return new Promise((resolve, reject) => {
            getDownloadURL(fileRef)
                .then((url) => {
                    resolve(url);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }




    // This is for cat profiles 
    // reference CatProfile table 
    const catProfileRef = ref(database, "CatProfile");
    // reference CatProfile count 
    const catProfileCountRef = ref(database, "CatProfileCount");
    let catProfileCount;
    let catProfiles = [];

    /**
   * function to send data to database  
   * @param {Object} catProfileObj
   */
  function sendToDB(catProfileObj) {
    get(catProfileCountRef).then((snapshot) => {
      catProfileCount = snapshot.val();
      set(catProfileCountRef, catProfileCount + 1);
      const uniqueKey = catProfileCount;
      const dataToUpdate = { [uniqueKey]: {name: catProfileObj.name, 
                                        avatar: catProfileObj.avatar}};
    update(catProfileRef, dataToUpdate)
        .then(() => {
        })
        .catch((error) => {
          console.error('Error updating database:', error);
        });
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * function to get data from database 
   * @returns {any}
   */
    function fetchCatProfileFromDB() {
        return new Promise((resolve, reject) => {
            onValue(catProfileRef, (snapshot) => {
                const data = snapshot.val();
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    onMount (async () => {
        try {
            catProfiles = await fetchCatProfileFromDB();
        }catch (error) {
            console.error("Error fetching cat profiles: ", error)
        }
    })
  </script>
  