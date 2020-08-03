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


var kmpABI=[
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
				"name": "_addresss",
				"type": "address"
			}
		],
		"name": "grantAdminAccess",
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
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "rejectApplication",
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
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "uploadAM",
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
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "uploadDF",
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
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "uploadHM",
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
				"name": "_hash",
				"type": "string"
			}
		],
		"name": "uploadLO",
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
				"name": "applicationId",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "signatory",
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
		"name": "centralMonitoring",
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
		"name": "applicationStatus",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
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
		"inputs": [
			{
				"name": "_id",
				"type": "string"
			}
		],
		"name": "getApprovalDocs",
		"outputs": [
			{
				"name": "hm",
				"type": "string"
			},
			{
				"name": "df",
				"type": "string"
			},
			{
				"name": "lo",
				"type": "string"
			},
			{
				"name": "am",
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


var kmpADDRESS="0x6ce0d96684afbd80214b8708bcf10f967e2098eb";

var KMPcontract=new web3.eth.Contract(kmpABI,kmpADDRESS);