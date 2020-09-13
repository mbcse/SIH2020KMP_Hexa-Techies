var web3=null;
if(Web3.givenProvider==null){
    alert("Please Install Metamask")
}
else
{
   window.ethereum.enable();
   web3=new Web3(Web3.givenProvider);
   console.log("Metamask Account Connected "+window.web3.currentProvider.isMetaMask);
}

var userAccount ="";
web3.eth.getAccounts().then((accounts)=>{
	userAccount=accounts[0];
	console.log("User Account "+userAccount);
});


var kmpABI=
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "_approverName",
				"type": "string"
			}
		],
		"name": "AIapprove",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "_approverName",
				"type": "string"
			}
		],
		"name": "DGapprove",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "_approverName",
				"type": "string"
			}
		],
		"name": "DOASapprove",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "_license",
				"type": "string"
			}
		],
		"name": "grantLicense",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "_aerodromeName",
				"type": "string"
			},
			{
				"name": "_aerodromeOwner",
				"type": "string"
			},
			{
				"name": "_latitude",
				"type": "string"
			},
			{
				"name": "_longitude",
				"type": "string"
			},
			{
				"name": "_district_state",
				"type": "string"
			},
			{
				"name": "_category",
				"type": "string"
			}
		],
		"name": "registerAerodrome",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_Haddress",
				"type": "string"
			},
			{
				"name": "_telephone",
				"type": "string"
			},
			{
				"name": "_nationality",
				"type": "string"
			}
		],
		"name": "registerApplicant",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "application_id",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "doneBy",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "ethAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "action",
				"type": "string"
			}
		],
		"name": "central_monitoring",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "approvalStatus",
		"outputs": [
			{
				"name": "DG",
				"type": "bool"
			},
			{
				"name": "DOAS",
				"type": "bool"
			},
			{
				"name": "AI",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getAerodromeDetails",
		"outputs": [
			{
				"name": "aerodromeName",
				"type": "string"
			},
			{
				"name": "aerodromeOwner",
				"type": "string"
			},
			{
				"name": "latitude",
				"type": "string"
			},
			{
				"name": "longitude",
				"type": "string"
			},
			{
				"name": "district_state",
				"type": "string"
			},
			{
				"name": "category",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getApplicantApplications",
		"outputs": [
			{
				"name": "applications",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getapplicantDetails",
		"outputs": [
			{
				"name": "id",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "Haddress",
				"type": "string"
			},
			{
				"name": "telephone",
				"type": "string"
			},
			{
				"name": "nationality",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];


var kmpADDRESS="0xf544301fa7f8d234b4ec0f2ca09ef83fabd206d8";

var KMPcontract=new web3.eth.Contract(kmpABI,kmpADDRESS);