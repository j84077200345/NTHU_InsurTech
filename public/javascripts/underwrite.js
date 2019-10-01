
const underwriteBtn = document.getElementById('underwriteBtn');
const insurance = '0xa7B4960Ee77D64defbD2b0155ce828E4A8Bb6E75';

underwriteBtn.addEventListener('click', function(e) {
    var select = document.getElementById('selectAddress');
    var prvKey = select.options[select.selectedIndex].value;
    var address = select.options[select.selectedIndex].innerHTML;
    var sData = JSON.stringify({
        "fromAddress": address,
        "toAddress": insurance,
        "gasPrice": 21000000000,
        "gasLimit": 2100000,
        "value": 0.5,
        "privateKey" : prvKey,
        "data": "0xb01a4d8b0000000000000000000000000000000000000000000000000000000000000000"
    });
    
    fetch('https://api.cryptoapis.io/v1/bc/eth/rinkeby/txs/new-pvtkey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'a418a13cf522402db6214a2c8a76413bc93f2f17'
        },
        body: sData
    }).then(function(response) {
        console.log(response);
    });
});