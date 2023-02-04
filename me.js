let me = "Eri--oluwa"
let m="ri"
let receiverIdEx = `.*${m}.*`;
let receiverIDregEx = new RegExp(receiverIdEx)
let nums=["2","4","5","6","7"]
let num=5
console.log(nums.find((v,i)=>{
    return v==num
}))