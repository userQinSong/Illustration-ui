export default{
    namespaced:true,
    state:{
      pathArray:[]
    },
    mutations:{
      setPath(state,pathArray){
        state.pathArray = pathArray;
      },
    },
    getters:{
      currentPath:state=>{
        let path = '';
        state.pathArray.forEach(item=> {
          path += item + ">"
        })
        path = path.slice(0,-1)
        return path;
      },
      pathArray:state=>{
        return state.pathArray;
      }
    }
    ,
    actions:{

    }
}
