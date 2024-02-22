


export function debounce(fn, delay){
  let timer = null;
  return  (...args) =>{
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this,args)
    },delay)
}
}
//时间戳转换为时间格式字符串
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};


export function keepTwoDecimalFull(num) {
  var result = parseFloat(num)
  if (isNaN(result)) {
    return ''
  }
  result = Math.round(num * 100) / 100
  var s_x = result.toString()
  var pos_decimal = s_x.indexOf('.')
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0'
  }
  return  s_x
}

export function timeFormat (time) {
  // console.log(time);
  let timee = parseInt(time/1000);
  // console.log(timee);
  //分钟
  var minute = timee / 60;
  var minutes = parseInt(minute);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  //秒
  var second = timee % 60;
  var seconds = Math.round(second);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${minutes}:${seconds}`;
}
export function songTimeFormat (time) {
 //分钟
 var minute = time / 60;
 var minutes = parseInt(minute);

 if (minutes < 10) {
   minutes = "0" + minutes;
 }

 //秒
 var second = time % 60;
 var seconds = Math.round(second);
 if (seconds < 10) {
   seconds = "0" + seconds;
 }
 return `${minutes}:${seconds}`;
}

//根据下载地址转换成base64图片
export function getBase64 (img) {
  // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
  function getBase64Image (img, width, height) {
    var canvas = document.createElement('canvas')
    canvas.width = width || img.width
    canvas.height = height || img.height

    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    var dataURL = canvas.toDataURL()
    return dataURL
  }
  return new Promise((resolve) => {
    var image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = img
    image.setAttribute('crossOrigin', 'anonymous');
    if (img) {
      image.onload = function () {
        // 读取图片之后的操作
        resolve(getBase64Image(image))
      }
    }
  })
}
export function preloadPics (picList,pic_width=300) {
  console.log("##preload:",pic_width)
  let loadedCount = 0;
  // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
  return new Promise((resolve) => {
    picList.forEach((item, index) => {
      if (index < loadedCount)
        return;
      // 无图则把高度设置为0
      if (!item.pic_src) {
        // 图片的高度
        picList[index].height = 0;
        ++loadedCount;
        // 当前图片都与处理完，则加载图片
        if (picList.length === loadedCount) {
          resolve(picList)
        }
      } else {
        let img = new Image();
        console.log("得到img:",img.src)
        img.src = item.pic_src;
        img.onload = img.onerror = (e) => {
          //保存图片原始宽高
          picList[index].rowHeight = img.height;
          picList[index].rowWidth = img.width;
          // 若加载失败则设置图片高度与宽度一致，加载成功则动态计算图片高度
          picList[index].height = e.type === "load" ? Math.round(pic_width * (img.height / img.width)) : pic_width;
          ++loadedCount;
          // 当前图片都与处理完，则加载图片
          if (picList.length === loadedCount) {
            resolve(picList)
          }
        }
      }
    })
  })
}
export function spaceNumFormat (val,fractionDigit = 2) {
  if (val == "0") return "0B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB", "TB"];
  let i = Math.floor(Math.log(val) / Math.log(k));//得出该数字的单位应该是kB?MB
  return (val / Math.pow(k, i)).toFixed(fractionDigit)+ "" + sizes[i];
}

export function simpleNumber (num) {
  let strKey = "";
  if(num === undefined || num === '' || num === null)
    return 0;
  if(num >= 1000 && num < 10000){
    strKey = "k";
    num = (num / 1000).toFixed(1);
  }else if(num >= 10000 && num < 100000000){
    strKey = "w";
    num = (num / 10000).toFixed(1);
  }else if(num > 100000000){
    strKey = "kw";
    num = (num / 100000000).toFixed(1);
  }
  return num+strKey
}

export function docSimpleName (docName) {
  let name_arr = docName.split(".")
  return name_arr[0];
}

export function checkObj (obj) {
  return obj !== null && obj !== undefined && obj !== '';
}

export function getCurrentTimeSeconds () {
  return parseInt(new Date().getTime()/1000)
}



