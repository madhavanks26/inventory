function goodsDataValidation(goodsData){
    let goodsBrandValue=goodsData["goodsBrand"];
    const regexStringPattern = /^[a-zA-Z0-9"]+$/;
    return regexStringPattern.test(goodsBrandValue);
}

export {goodsDataValidation};