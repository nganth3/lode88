npx kill-port 8018 -y
npm start


VTGR95BAE5F8 pass modem nhà

F4:26:79:B0:0D:83	
192.168.1.4





string getAccountNumber(){

   string cookie=NULL,headers;
   char   post[],result[];
   string url="http://192.168.1.5";
//--- To enable access to the server, you should add URL "https://finance.yahoo.com"
//--- to the list of allowed URLs (Main Menu->Tools->Options, tab "Expert Advisors"):
//--- Resetting the last error code
   ResetLastError();
//--- Downloading a html page from Yahoo Finance
   int res=WebRequest("GET",url,cookie,NULL,500,post,0,result,headers);
   if(res==-1)
     {
      Print("Error in WebRequest. Error code  =",GetLastError());
      //--- Perhaps the URL is not listed, display a message about the necessity to add the address
      MessageBox("Add the address '"+url+"' to the list of allowed URLs on tab 'Expert Advisors'","Error",MB_ICONINFORMATION);
     }
   else
     {
      Print("WebRequest. Error code  =OKKKKKKKKKKKKKKKKKKKKKKKKKKK");
       
      if(res==200)
        {
        
        
         //--- Successful download
         PrintFormat("The file has been successfully downloaded, File size %d byte.",ArraySize(result));
         
         //PrintFormat("Server headers: %s",headers);
         //--- Saving the data to a file
         int filehandle=FileOpen("url.htm",FILE_WRITE|FILE_BIN);
        
         if(filehandle!=INVALID_HANDLE)
           {
            //--- Saving the contents of the result[] array to a file
            FileWriteArray(filehandle,result,0,ArraySize(result));
            //--- Closing the file
            FileClose(filehandle);
           }
         else
            Print("Error in FileOpen. Error code =",GetLastError());
        }
      else
         PrintFormat("Downloading '%s' failed, error code %d",url,res);
     }
     return CharArrayToString( result );
}
