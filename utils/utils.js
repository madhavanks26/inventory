function goodsDataValidation(goodsData){
    let goodsBrandValue=goodsData["goodsSize"];
    const regexStringPattern = /^[a-zA-Z0-9"]+$/;
    return regexStringPattern.test(goodsBrandValue);
}

export {goodsDataValidation};