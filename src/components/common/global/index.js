exports.install = function (Vue, options) {
  Vue.prototype.myConfirm = function (content,sureFunc){
    this.$confirm(content, '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      type: 'warning',
      showCancelButton: true,  //是否显示取消按钮
      showClose: true, //是否显示右上角的x
      closeOnClickModal: true, //是否可以点击空白处关闭弹窗
    }).then(() => {
      sureFunc();
    }).catch(()=>{
      console.log("取消")
    })
  };
};
