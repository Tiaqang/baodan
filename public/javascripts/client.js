var web3, tokenAbi, tokenAddress, tokenContract, token, policyPoolContractAbi, policyPoolContract, policyPoolAddress, policyPool, userid;


$(document).ready(function(){
  
  // create an instance of insChainToken
  //tokenAbi=[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"updateFreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"freezeOf","outputs":[{"name":"status","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}];
  
  tokenAbi =[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "account", "type": "address" } ], "name": "updateFreeze", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" } ], "name": "decreaseApproval", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "account", "type": "address" } ], "name": "freezeOf", "outputs": [ { "name": "status", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" } ], "name": "increaseApproval", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" } ];

  tokenContract = web3.eth.contract(tokenAbi);
  // Rinkeby testnet:  0x76fc567f56b93e158190e499fee01b526b31a2fc
  // the address should be modified according to the address of the contract
  // Mainnet: 0x07a58629aaf3e1a0d07d8f43114b76bd5eee3b91
  //tokenAddress='0x76fc567f56b93e158190e499fee01b526b31a2fc';   //Rinkeby XIN 合约地址
  tokenAddress='0xbeA46E4eaaaE5e786a67063A1e3F3e50E0F1E3CF';     //Rinkeby GETX 合约地址

  token = tokenContract.at(tokenAddress);

  policyPoolContractAbi = [ { "anonymous": false, "inputs": [ { "indexed": false, "name": "_prevOwner", "type": "address" }, { "indexed": false, "name": "_newOwner", "type": "address" } ], "name": "OwnerUpdate", "type": "event" }, { "constant": false, "inputs": [], "name": "acceptOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "proposalId", "type": "uint256" }, { "indexed": true, "name": "amount", "type": "uint256" }, { "indexed": true, "name": "proposalPassed", "type": "bool" } ], "name": "ProposalTallied", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "proposalID", "type": "uint256" }, { "indexed": true, "name": "policyExternalID", "type": "uint256" }, { "indexed": true, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "description", "type": "string" } ], "name": "ProposalAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "backer", "type": "address" }, { "indexed": true, "name": "amount", "type": "uint256" }, { "indexed": true, "name": "policyExternalID", "type": "uint256" } ], "name": "PolicyValueIn", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "backer", "type": "address" }, { "indexed": true, "name": "amount", "type": "uint256" }, { "indexed": true, "name": "policyExternalID", "type": "uint256" } ], "name": "PolicyOut", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "backer", "type": "address" }, { "indexed": true, "name": "amount", "type": "uint256" }, { "indexed": true, "name": "policyExternalID", "type": "uint256" } ], "name": "PolicyIn", "type": "event" }, { "constant": false, "inputs": [ { "name": "proposalNumber", "type": "uint256" }, { "name": "refundAmount", "type": "uint256" }, { "name": "fees", "type": "uint256" } ], "name": "executeProposal", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "payload", "type": "uint256" }, { "name": "beneficiary", "type": "address" }, { "name": "weiAmount", "type": "uint256" }, { "name": "claimDescription", "type": "string" } ], "name": "newProposal", "outputs": [ { "name": "proposalID", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "weiAmount", "type": "uint256" }, { "name": "tokenLedger", "type": "address" }, { "name": "extraData", "type": "bytes" } ], "name": "receiveApproval", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "payload", "type": "uint256" }, { "name": "weiAmount", "type": "uint256" }, { "name": "fees", "type": "uint256" }, { "name": "to", "type": "address" } ], "name": "withdrawPolicy", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "tokenLedger", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "accumulatedBalanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "claimPeriodInMinutes", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "insChainTokenLedger", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "joinSinceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "newOwner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "numProposals", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "policies", "outputs": [ { "name": "since", "type": "uint256" }, { "name": "accumulatedIn", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "policyActiveNum", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "policyFeeCollector", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "payload", "type": "uint256" } ], "name": "policyID", "outputs": [ { "name": "id", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "policyMaxRefund", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "policyTokenBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "proposals", "outputs": [ { "name": "policyPayload", "type": "uint256" }, { "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "description", "type": "string" }, { "name": "validDeadline", "type": "uint256" }, { "name": "executed", "type": "bool" }, { "name": "proposalPassed", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "updated_policy_payload", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

  policyPoolContract = web3.eth.contract(policyPoolContractAbi);
  //Rinkeby testnet
  policyPoolAddress='0xa845f9fc440b70d54a4d4147b0be6c1658fa8780';  
  policyPool = policyPoolContract.at(policyPoolAddress);

  inschainaddress ='0xf17f52151EbEF6C7334FAD080c5704D77216b732' //设置宝链eth 地址

  // use getAccounts to get the coinbace with getAccounts, web3.eth.coinbase might return null
  // see https://ethereum.stackexchange.com/questions/17491/better-pattern-to-detect-web3-default-account-when-using-metamask/17494
  /*web3.eth.getAccounts((err,res)=>{
    if(typeof res == 'undefined' || res.length==0) {
      alert('Please log in to Metamask and refresh');
    } else {
      coinbase = res[0];

      userid = $("#userid").val();
      getPolicyActiveNum();
      getPolicyTokenBalance();

      $("#myEtherAddress").html(coinbase);

    }
  });

  // listen to the transfer event, when there is a transfer refresh the page
  token.Transfer((err,res)=>{
    if (res.args._from === coinbase || res.args._to === coinbase) {
      getPolicyTokenBalance();
      //getPolicyActiveNum(coinbase);
      getPolicyActiveNum();
    }
  })*/
})

/*function getPolicyTokenBalance(){
  policyPool.policyTokenBalance.call((err,res)=>{
    $("#policyTokenBalance").html(web3.fromWei(res.toNumber(),'ether'));
  })
}

function getPolicyActiveNum() {
  policyPool.policyActiveNum.call((err,res)=>{
    policyActiveNum = res.toNumber();
    $("#policyActiveNum").html(policyActiveNum);
  });
}*/

/*function getPolicyBalanceOf(userid) {
  var policyBalanceOf = 0;
  // get the policyID in the smart contract of this userid
  // userid in decimal number
  var useridnum = new bigInt(web3.toHex(userid).substring(2),16).toString();
  // get policyid in the smart contract
  policyPool.policyID(useridnum,(err,res)=>{
    policyPool.accumulatedBalanceOf(res,(err,res)=>{
      if (!err) {
        policyBalanceOf = web3.fromWei(res, 'ether').toNumber();
        $("#policyBalanceOf").html(policyBalanceOf);
      } else {
        console.log(err);
      }
    });
  });
}*/

/*$('#mybalance').click(function(){
  getPolicyBalanceOf($('#useridbalance').val());
});*/

// 用GETX加入计划，前台方法
/*$('#pay').click(function(){
  var amount = Number($('#amount').val());
  // todo: check if balance of coinbase is greater than amount
  if(amount <= 0) {
    alert("invalid number");
    return false;
  }

  if(amount<30) {
    alert("GETX amount should not be less than 30");
    // do not reload the page
    return false;
  } else{
    var amountInWei = web3.toWei(amount, 'ether');
    userid = $("#userid").val();
    // 调用GETX加入方法
    participateByGETX(policyPoolAddress,amountInWei,userid);
    return false;
  }

});*/

//检查用户是否安装并登录metamask

function web3_check(){
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    web3.eth.getAccounts((err,res)=>{
    if(typeof res == 'undefined' || res.length==0) {
      alert('Please log in to Metamask and refresh');
    }
  })
  }else {
    layer.alert('Please log in to Metamask and refresh');
  }
}

// 用GETX加入方法
function participateByGETX(policyPoolAddress,amount,insurance_id) {
  var amountInWei = web3.toWei(amount, 'ether');
  console.log(policyPoolAddress,amount,insurance_id)
  token.approveAndCall(policyPoolAddress, Number(amountInWei), web3.toHex(insurance_id) ,(err,transactionHash)=>{
    if (!err && transactionHash !=null && typeof transactionHash !=='undefined'){
      //提示正在写入区块链，并更新数据库表？？？？，将用户32位ID，amountether, amountGETX等存入数据库
      //console.log(transactionHash);
      //更新数据库数据
      var data={
        'user_id':$('.user_id').val(),
        'insurance_id':insurance_id,
        'payment':JSON.stringify({
          'getxself':amount,
          'getxtransactionHash':transactionHash
        })
      }
      console.log(data)
      $.post('/pay/updateInsurance',data,function(rescnt){
        if(rescnt.status==0){
          pay_success('xxx','amount');
          jump_to($('.insurance_id').val());
        }else{
          toast('充值失败,'+'error:'+rescnt.errMsg);
          $('.confirm_btn').attr('haspay','0')
        }
      })
     
    }else{
      //提示失败
      toast('充值失败');
      $('.confirm_btn').attr('haspay','0')
    }
  });
}

// 用以太币加入计划
/*$('#payether').click(function(){
  var amountether = Number($('#amountether').val());
  // todo: check if balance of coinbase is greater than amount
  if(amountether <= 0) {
    alert("invalid number");
    return false;
  }

  var useridether = $("#useridether").val();
  // address of inschain, this should be fixed in the system, I set this as input for test
  var inschainaddress = $("#inschainaddress").val();
  // 调用Ether加入方法
  participateByEther(inschainaddress, amountether, useridether);
  return false;
});*/


// 用ETHER加入方法
function participateByEther(inschainaddress, amountether, insurance_id) {
  console.log(inschainaddress,amountether,useridether)
  // first get the exchange rate
  layer.msg('正在查询当前GETS/ETH...')
  $.get('https://api.coinmarketcap.com/v1/ticker/guaranteed-ethurance-token-extra/', function(res) {
    priceGETX = res[0].price_usd;
    $.get('https://api.coinmarketcap.com/v1/ticker/ethereum/', function(res) {
      priceETH = res[0].price_usd;
      priceETH_GETX = priceGETX/priceETH;
      amountETH = priceETH_GETX*amountether;
      
      //提示 交易兑换比率
      dialog('The exchange rate GETX/ETH is '+ priceETH_GETX +'. ETH amount is ' + amountETH + ' Do you want to continue?','continue','cancel',function(){
          layer.closeAll()
          web3.eth.sendTransaction(
            {to:inschainaddress,
              value: web3.toWei(amountETH,'ether'),
              data: web3.toHex(useridether),
              gas: web3.toHex(100000),
            }, function(err, transactionHash) {
            if (!err && transactionHash !=null && typeof transactionHash !=='undefined'){
              //提示正在写入区块链，并更新数据库表？？？？，将用户32位ID，amountether, amountGETX等存入数据库
              console.log(transactionHash);
              //return transactionHash

              var data={
                'userid':$('.userid').val(),
                'insurance_id':insurance_id,
                'payment':JSON.stringify({
                  'ethgetx':amount,
                  'ethself':amountETH,
                  'ethtransactionHash':transactionHash,
                  'ethtogetx':priceETH_GETX
                })
              }
              $.post('/pay/updateInsurance',data,function(rescnt){
                if(rescnt.status==0){
                  pay_success('xxx','amount');
                  jump_to($('.insurance_id').val());
                }else{
                  toast('充值失败,'+'error:'+rescnt.errMsg);
                  $('.confirm_btn').attr('haspay','0');
                }
              })
            }else{
              //提示失败
              toast('交易失败')//交易失败
              $('.confirm_btn').attr('haspay','0');
            }
          });
      });
    })
  });
}

/*
policyPool.updated_policy_payload((err,res)=>{
  console.log(res-52647538829643172525412008049499194099236374998630846575861268644320073816400);
  policyPool.policyID(res,(err,res)=>{
    console.log(res)
  });
});

policyPool.policyID(web3.toBigNumber(parseInt(web3.toHex('testtesttesttesttesttesttesttest'),16)),(err,res)=>{
  console.log(res)
});
*/

/**function num2hexStr(num){
  var hex = num.parseInt(num,16);
  var hex_str = hex.toString();
  var text = '0x';
  for (i=0;i<64-hex_str.length;i++){
    text+='0';
  }
  alert(text+hex_str);
  return text+hex_str;
}**/