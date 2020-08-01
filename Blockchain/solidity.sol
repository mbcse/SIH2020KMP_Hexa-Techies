pragma solidity ^0.5.*;
pragma experimental ABIEncoderV2;

/*
***************************************importing libraries*****************************************
*/
import "browser/strings.sol";



contract AAI_LICENSING{
    using strings for *;
    
    
    
    address public owner;
/*
***************************************Applicant Details*****************************************
*/    
    struct applicant{
        string name;
        string addresss;
        string telephone_no;
        string nationality;
    }
    
    mapping(address=>string[]) applicantId;//Mapping address to all apllications aplied
    mapping(string=>applicant) applicantDetails;
    mapping(string=>address) applicantETHAddress;
    

/*
***************************************Aerdrome Details*****************************************
*/
    struct aerodromeDetails{
            string  aerodromeName;//Location of the proposed aerodrome/ helipad site with reference to the nearest IAF aerodrome
            string  aerodromeOwner;
            string  latitude; //Latitude and Longitude of the place 
            string  longitude;
            string  district_state; //State/ District in which proposed location is situated 
            string  category; //public or private
            
    }
    mapping(string=>aerodromeDetails) applicantAerodrome;//map Id to its aerodomeDetails
    mapping(string=>string) internal HM_ApprovalDoc;//Home Ministry Approval
    mapping(string=>string) internal DF_ApprovalDoc;//Defence approval
    mapping(string=>string) internal OW_ApprovalDoc;//Owner of Land
    mapping(string=>string) internal aerodromeManual;//Aerodome Manual
    mapping(string=>uint8)  internal status;//status 0-rejected 1-pending 2-acccepted
    
/*
***************************************Approval Details*****************************************
*/
    
    mapping(address=>uint) internal isAdmin;//0-No Admin Permission & 1-Yes Admin Permission
    mapping(address=>string) internal admins;
    mapping(string=>bool) internal DGapproval;
    mapping(string=>bool) internal DOASapproval;
    mapping(string=>bool)internal AIapproval;
    
    
/*
***************************************License Details*****************************************
*/
    mapping(string=>string) applicantLicenceIssued;
    mapping(string=>string) licenseDetails;//mapping id to license number for getting license information later on

/*
***************************************constructor*****************************************
*/
    constructor() public{
        owner=msg.sender;
    }
    
/*
***************************************Modifiers*****************************************
*/    
    
    modifier onlyAdmin(){
        require(isAdmin[msg.sender]==1 || msg.sender==owner);
        _;
    }
    
    modifier onlyAdminApplicant(string memory _id){
        require(isAdmin[msg.sender]==1 || msg.sender==owner || msg.sender==applicantETHAddress[_id]);
        _;
    }
    
    /*
***************************************Events*****************************************
*/    
    event central_monitoring(
        string application_id, 
        uint date , 
        string doneBy, 
        address ethAddress, 
        string action
        );
        
/*
***************************************Function to convert address to string*****************************************
*/ 
    function toString(address x) public returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }
        


    
    
   
/*
***************************************Admin Functions*****************************************
*/
  
    
    function grantAdminAccess(address _addresss) public onlyAdmin{
        isAdmin[_addresss]=1;
        string memory work = "grantAdminAccess".toSlice().concat(toString(_addresss).toSlice());
        
        emit central_monitoring("_id",block.timestamp,"admins",msg.sender, work);
    }
/*
***************************************Registration Functions*****************************************
*/  
function registerApplicant(string memory _id, string memory _name, string memory _Haddress, string memory _telephone, string memory _nationality) public{
        applicantId[msg.sender].push(_id);
        applicantETHAddress[_id]=msg.sender;
        applicantDetails[_id]=applicant(_name,_Haddress,_telephone,_nationality);
        string memory work1 = "registerApplicant".toSlice().concat("applicantId".toSlice());
        emit central_monitoring(_id,block.timestamp,"name",msg.sender,work1);

    }
    
    function registerAerodrome(string memory _id, string memory _aerodromeName, string memory _aerodromeOwner, string memory _latitude, string memory _longitude, string memory _district_state, string memory  _category) public{
        applicantAerodrome[_id]=aerodromeDetails(_aerodromeName, _aerodromeOwner, _latitude, _longitude, _district_state, _category);
    }
    
/*
***************************************Get Application Details Function*****************************************
*/    function getApplicantApplications() public view returns(string[] memory applications){
        return applicantId[msg.sender];
    }
    
    
    function getapplicantDetails(string memory _id) public view returns(string memory id, string memory name, string memory Haddress, string memory telephone, string memory nationality){
        return(_id, applicantDetails[_id].name,applicantDetails[_id].addresss, applicantDetails[_id].telephone_no, applicantDetails[_id].nationality);
    }
    
    function getAerodromeDetails(string memory _id) public view returns(string memory aerodromeName, string memory aerodromeOwner, string memory latitude, string memory longitude, string memory district_state, string memory  category){
        return(applicantAerodrome[_id].aerodromeName, applicantAerodrome[_id].aerodromeOwner, applicantAerodrome[_id].latitude, applicantAerodrome[_id].longitude, applicantAerodrome[_id].district_state, applicantAerodrome[_id].category);
    }
    
/*
***************************************Approval Functions*****************************************
*/
    function AIapprove(string memory _id, string memory _approverName) public onlyAdmin{
        require(keccak256(abi.encodePacked(admins[msg.sender]))==keccak256(abi.encodePacked("AI")));
        AIapproval[_id]=true;
        string memory work2 = "AIapproved".toSlice().concat("_id".toSlice());

        emit central_monitoring(_id,block.timestamp, _approverName, msg.sender, work2);

    }
    
    function DOASapprove(string memory _id, string memory _approverName) public onlyAdmin{
        require(keccak256(abi.encodePacked(admins[msg.sender]))==keccak256(abi.encodePacked("DOAS")));
        require(AIapproval[_id]==true);
        DOASapproval[_id]=true;
        string memory work3 = "DOASapprove".toSlice().concat("_id".toSlice());

        emit central_monitoring(_id,block.timestamp,"DOAS", msg.sender, work3);

    }
    
    function DGapprove(string memory _id, string memory _approverName) public onlyAdmin{
        require(keccak256(abi.encodePacked(admins[msg.sender]))==keccak256(abi.encodePacked("DG")));
        require(AIapproval[_id]==true);
        require(DOASapproval[_id]==true);
        DGapproval[_id]=true;
        string memory work4= "DGapprove".toSlice().concat("_id".toSlice());

        emit central_monitoring(_id,block.timestamp,"DG", msg.sender,work4);

    }
    
    
    function approvalStatus(string memory _id) public onlyAdminApplicant(_id) view returns(bool DG, bool DOAS, bool AI){
        return(DGapproval[_id], DOASapproval[_id], AIapproval[_id]);
    }
    
    
    function grantLicense(string memory _id, string memory _license) public onlyAdmin{
        require(DGapproval[_id]==true && DOASapproval[_id]==true && AIapproval[_id]==true);
        applicantLicenceIssued[_id]=_license;
        licenseDetails[_license]=_id;
        string memory work5 = "grantLicense".toSlice().concat("_id".toSlice());

        emit central_monitoring(_id,block.timestamp,"DG + DOAS + AI", msg.sender,work5);

    }
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    

    
    
    
        
        
   
    
 
    
    
    
    
    
}