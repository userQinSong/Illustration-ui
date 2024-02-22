export default{
    namespaced:true,
    state:{
      tag_list:[],
      type_list:[],
    },
    mutations:{
      setTagList(state,tag_list){
        state.tag_list = tag_list;
      },
      setTypeList(state,type_list){
        state.type_list = type_list;
      },
    },
    getters:{
      tag_list:state=>{
        return state.tag_list;
      },
      type_list:state=>{
        return state.type_list;
      },
    }
    ,
    actions:{

    }
}
