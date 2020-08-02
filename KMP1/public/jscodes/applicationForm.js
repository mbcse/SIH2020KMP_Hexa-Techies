window.onload=()=>{
   
    $("#NewApplication").submit(function(e) {
        $('#applicationmodal').modal('show');
        startUpload();
        statusValue=2;
		putStatusValue(statusValue,"connecting to Blockchain Network");	
        e.preventDefault(); // prevent actual form submit
        var form = $(this);
        var url ="/client/aerodromeapplication"; //get submit url [replace url here if desired]
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes form input
            success: function(response){
                if(response.status){
                    statusValue=50;
		            putStatusValue(statusValue,"Transacting Please Approve!");
                    console.log(response);
                     KMPcontract.methods.registerApplicant(response.id,response.name, response.address, response.phone, response.nationality).send({from:userAccount},(err,tx)=>{
                        statusValue=60;
                        putStatusValue(statusValue,"Updating Ledger...");
                     })
                     .on('receipt',(rc)=>{
                        statusValue=75;
                        putStatusValue(statusValue,"Applicant added to blockchain");
                         console.log("Applicant added to blockchain");

                         statusValue=75;
                        putStatusValue(statusValue,"Submitting aerodrome Details Please Approve");
                         KMPcontract.methods.registerAerodrome(response.id,response.aerodromename, response.name, response.latitude, response.longitude, response.district_state, response.category).send({from:userAccount},(err,tx)=>{
                            statusValue=90;
                            putStatusValue(statusValue,"Confirming...");
                         })
                         .on('receipt',(rc)=>{
                            
                             console.log("Aerodrome added to Blockchain");
                             statusValue=100;
                             putStatusValue(statusValue,"Application Submitted Successfully");
                         });
                     });

                    
                }
                else{
                    alert("Server Error");
                    
                }
            }
        });
    });






}