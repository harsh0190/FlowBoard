import mongoose, {
    Schema,
    Document
} from "mongoose";


export interface IProject extends Document{

    title:string;

    description:string;

    workspace:mongoose.Types.ObjectId;

    members:mongoose.Types.ObjectId[];

    deadline:Date;

    status:
    "active" |
    "completed";

}


const projectSchema =
new Schema<IProject>({


title:{

    type:String,

    required:true

},



description:{

    type:String

},



workspace:{

    type:Schema.Types.ObjectId,

    ref:"Workspace",

    required:true

},



members:[

{

type:Schema.Types.ObjectId,

ref:"User"

}

],



deadline:{

type:Date

},



status:{

type:String,

enum:[
"active",
"completed"
],

default:"active"

}


},
{
timestamps:true
});


export default mongoose.model<IProject>(
    "Project",
    projectSchema
);