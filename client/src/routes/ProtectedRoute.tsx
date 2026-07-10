import {

Navigate

} from "react-router-dom";



import {

useAppSelector

} from "../hooks/redux";



import AppLayout
from "../components/layout/AppLayout";





export default function ProtectedRoute({

children

}:any){



const {

token

}=useAppSelector(

state=>state.auth

);





if(!token){


return (

<Navigate

to="/auth"

replace

/>

);


}




return(

<AppLayout>


{children}


</AppLayout>


);


}