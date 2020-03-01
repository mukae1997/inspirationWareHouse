<template>
  <div class="hello">
    <h1>发现你的灵感。Search for your inspiration.</h1>
    <div id="searchbox-container">
    <input  type="text" placeholder="search..." 
    @input="search"
    v-model="searchtext"/> 
  
    </div>
    <ul>
      <li v-for='(dat, index) in viewList' :key="index">

        <div class="card">
            <div><h2>{{dat.title}}</h2> </div>
           <div ><span class="section-title">Description</span> 
            <div>
              {{dat.description}}   
            </div>
           </div>
           <div >
             <span class="section-title">Artist</span>
             <ul>
               <li class="artist-li" v-for="(aArtist, index) in dat.artist" :key="index">
                 {{aArtist}}
               </li>
             </ul>
           </div>

           <div v-for="(linkobj, index) in dat.links" :key="index">
              <div v-if="linkobj.type == 'localserver' ">
              <iframe :src='solveLink(linkobj.link)' width="700" height="400"></iframe>
              <!-- {{solveLink(dat.link)}} -->
              </div>
             <div v-if="linkobj.type == 'other' ">
              链接：<a :href='linkobj.link'>{{linkobj.link}}</a>
             
              <!-- <iframe :src='linkobj.link' width="600" height="400"></iframe> -->
              <!-- {{solveLink(dat.link)}} -->
             </div>
           </div>
           

           
           <div class="tags">
             <span class="section-title">tags</span>

              <ul>
                <li v-for="(t,ti) in dat.tags" :key="ti">
                  <span class="tag">{{t.content}}</span>
                </li>
              </ul>
           </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RefPage',
  data() {
    return {
      localServer:"http://127.0.0.1:8083",
      searchtext:"",
      data:null,
      result:null

    };
  },
  filters : {
    // search : function( ) {
    //   var target = this.searchtext;
    //   if (target.length == 0) return this.data;
    //   return this.data; 
    // }
  },
  computed:{
    viewList() {
        if (this.searchtext.length > 1) {
          return this.result;
        }
        return this.data;
      
    }
  },
  methods:{
    solveLink(d){
      return this.localServer+d;
    },
    search(event) {
      // console.log(event.target.value)
      var inputVal = event.target.value;
      if (inputVal.length <= 1) return ;
      var res = [];
      for (var key in this.data) {
        var obj = this.data[key];
        // console.log(obj);
        var getThisObjFlag = this.checkIfObjContainsWord(obj, inputVal);
        if (getThisObjFlag) {
          res.push(obj);
        } 
      }
      this.result = res;
      // console.log(this.result.length)
    },
    checkIfObjContainsWord(obj, word) {
      var getThisObjFlag = false;

      var tags = obj.tags;

      if (this.blurEqual(obj.title,word)) {
        return true;
      }
      
        // console.log(tags)
      for (var i = 0; i < tags.length; i++) {
        var tagobj = tags[i];

        if (this.blurEqual(tagobj["content"],word)
          // || this.blurEqual(tagobj["category"],word)
          ) {
          getThisObjFlag = true;
          break;
        }
      }

      if (!getThisObjFlag) {
        var artists = obj.artist;
        for (var index in artists) {
          if (this.blurEqual(artists[index], word)) {
            getThisObjFlag = true;
            break;
          }
        }
      }

      return getThisObjFlag;
    },
    blurEqual(a, b) {
      var alower = a.toLowerCase();
      var blower = b.toLowerCase()
      var fullequal = alower == blower;
      var contains = alower.indexOf(blower) != -1 || blower.indexOf(alower) != -1;
      // console.log(a,b)
      // console.log(a.indexOf(b))
      // console.log(b.indexOf(a))
      return fullequal || contains;
    }

  },
  mounted() {
    // console.log("mounted");
    var pageobj = this;
    this.axios.get(this.solveLink("/ref/data/data.json"))
      .then((res) => {

        var dataobj = res.data.data;
        // console.log(res.data);
        pageobj.data = dataobj;
      })
      .catch((err)=>{
        console.log(err);
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  text-align: left;
}
h1 {
  text-align: center;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
#searchbox-container{
  margin-left: 35%;
}
#searchbox-container input{
  padding:7px;
  width: 50%;
}
.tags li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

li div {
  margin-bottom: 20px;
}
.artist-li{
  margin: 0 10px;
  display: inline-block;
}
.card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 90%;
    border-radius: 5px;
    margin: 40px;
    padding: 40px;
}

.section-title{
  font-style: italic;
    color: darkgray;
}
.tag {
    color: cadetblue;
    font-size: small;
}
</style>
