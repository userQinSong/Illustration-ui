import {ill_request} from "@/network/illustration/illustration_request";

export function getComments(param){
  return ill_request({
    url:'/comment/getComments',
    params:{
      commentParam:JSON.stringify(param)
    }
  })
}

export function sendComment(param){
  return ill_request({
    method:"post",
    url:'/comment/sendComment',
    data:{
      blogId: param.blog_id,
      userId: param.user_id,
      content: param.content,
      parentId:param.parent_id,
      rootParentId:param.root_parent_id
    }
  })
}

export function removeComment(param){
  return ill_request({
    method:"post",
    url:'/comment/removeComment',
    data:{
      id: param.comment_id,
      child: param.child,
    }
  })
}

export function changeAttitude(param){
  return ill_request({
    method:"post",
    url:'/comment/changeAttitude',
    data:{
      userId:param.userId,
      id:param.id,
      attitudeDisplay:param.attitudeDisplay
    },
  })
}

export function getCommentById(param){
  return ill_request({
    url:'/comment/getCommentById',
    params:{
      id:param.id
    },
  })
}

export function getAllCommentsInCurrentPage(param){
  return ill_request({
    url:'/comment/getAllCommentsInCurrentPage',
    params:{
      commentParam: JSON.stringify(param)
    }
  })
}


export function getCommentTotalCount(param){
  return ill_request({
    url:'/comment/getCommentTotalCount',
    params:{
      blog_id:param.blog_id,
    }
  })
}
