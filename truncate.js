exports.tr = function(str,len){
    const l = str.length;
    if(l>len){
        str = str.substring(0,len-5)+" ....";
    }
    return str;
}