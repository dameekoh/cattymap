<script>
    import LedgerProfile from './LedgerProfile.svelte';
    import { initializeApp } from "firebase/app";
    import { getStorage } from "firebase/storage"
    import { ref, push, child, get, set, getDatabase, onValue, update } from 'firebase/database';
    import { onMount } from 'svelte';

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

    const database = getDatabase(app);

    //reference root 
    const dataRef = ref(database, "/");
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

const storage = getStorage(app);

onMount (async () => {
    try {
        catProfiles = await fetchCatProfileFromDB();
    }catch (error) {
        console.error("Error fetching cat profiles: ", error)
    }
})

</script>




<div class = "card fixed left-1 shadow-xl p-3 ml-7 space-y-2 bg-white items-left overflow-x-visible">
    <h2 class="card-title text-sm text-slate-500">Cats</h2>
    {#each catProfiles as { name, avatar }}
        <LedgerProfile profilePic = { avatar } name = { name } checked = { false }/>
    {/each}
</div>