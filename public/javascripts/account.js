web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/772c5bb74c54405aa9a0718484d64b92"));

const createBtn = document.getElementById('createAccountBtn');
const getBtn = document.getElementById('getAccountBtn');
const saveNewAddressBtn = document.getElementById('saveNewAddress');
const saveGetAddressBtn = document.getElementById('saveGetAddress');

createBtn.addEventListener('click', function(e) {
    fetch('https://api.blockcypher.com/v1/eth/main/addrs?token=c413484c714f4e08a9a8b64ea56960a6', {
        method: 'POST'
    }).then(function(response) {
        response.json().then((value) => {
            var address = '0x' + value.address;
            var private = '0x' + value.private;

            document.getElementById("newAddress").innerHTML = '<p>Address: <small id="new" style="display:block;">' + address + '</small></small></p>'
                                                            +'<p>Private Key: <small>' + private + '</small></small></p>';
            console.log(address, private);
        });
    });
});

getBtn.addEventListener('click', function(e) {
    var prvKey = '0x' + document.getElementById('import').value;
    var import_address = web3.eth.accounts.privateKeyToAccount(prvKey);
    var address = import_address.address
    console.log(address);
    document.getElementById('getAddress').innerHTML = '<p>Address: <small id="get" style="display:block;">' + address + '</small></small></p>';
});

saveNewAddressBtn.addEventListener('click', function(e) {
    var newAddress = document.getElementById('new').innerHTML;
    var uid = document.getElementById('uid').innerHTML;

    fetch('https://insurance-pwa-b8506.firebaseio.com/users/' + uid + '/address.json', {
        method: 'POST',
        body: JSON.stringify(newAddress)
    }).then(function() {
        fetch('https://insurance-pwa-b8506.firebaseio.com/users/' + uid + '/address.json').then(function(response) {
            response.json().then((data) => {
                document.getElementById('addressList').innerHTML = '';
                for(var prop in data) {
                    document.getElementById('addressList').innerHTML += '<li style="list-style-position: inside; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="list-group-item"><a href="https://ropsten.etherscan.io/address/' + data[prop] + '" target="_blank">' + data[prop] + '</a></li>';
                }
            });
        });
    });
});

saveGetAddressBtn.addEventListener('click', function(e) {
    var importAddress = document.getElementById('get').innerHTML;
    var uid = document.getElementById('uid').innerHTML;

    fetch('https://insurance-pwa-b8506.firebaseio.com/users/' + uid + '/address.json', {
        method: 'POST',
        body: JSON.stringify(importAddress)
    }).then(function() {
        fetch('https://insurance-pwa-b8506.firebaseio.com/users/' + uid + '/address.json').then(function(response) {
            response.json().then((data) => {
                document.getElementById('addressList').innerHTML = '';
                for(var prop in data) {
                    document.getElementById('addressList').innerHTML += '<li style="list-style-position: inside; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="list-group-item"><a href="https://ropsten.etherscan.io/address/' + data[prop] + '" target="_blank">' + data[prop] + '</a></li>';
                }
            });
        });
    });
});