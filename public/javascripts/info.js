web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/772c5bb74c54405aa9a0718484d64b92"));
const insurance_address = '0xa7B4960Ee77D64defbD2b0155ce828E4A8Bb6E75';
const searchBtn = document.getElementById('searchAddress');

var insuranceContract = new web3.eth.Contract([ { "constant": false, "inputs": [ { "name": "severity", "type": "uint256" } ], "name": "confirmclaim", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "payPremium", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "payPremiumFor", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "underwrite", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "update", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contract_owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "insuranceTakers", "outputs": [ { "name": "banned", "type": "bool" }, { "name": "policyValid", "type": "bool" }, { "name": "lastPayment", "type": "uint256" }, { "name": "numAccidents", "type": "uint256" }, { "name": "totalPayment", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "isInsured", "outputs": [ { "name": "insured", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paymentPeriod", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "premiumPerYear", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ], insurance_address, {
    from: '0xf1f179B8D9fe7FF108427F3B1A0DB010A8844273',
    gasPrice: '20000000000'
});

searchBtn.addEventListener('click', function(e) {
    var e = document.getElementById('List');
    var value = e.options[e.selectedIndex].value;

    insuranceContract.methods.insuranceTakers(value).call({from: value}, function(error, result) {
        
    });
});