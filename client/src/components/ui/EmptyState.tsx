interface Props{

title:string;

message:string;

}



export default function EmptyState({

title,

message

}:Props){



return(

<div className="
flex
flex-col
items-center
justify-center
h-80
text-center
"


>


<h2 className="
text-2xl
font-bold
">

{title}

</h2>



<p className="
text-gray-500
mt-2
">

{message}

</p>



</div>

)

}