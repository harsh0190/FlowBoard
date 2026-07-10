import mongoose, {
    Schema,
    Document
} from "mongoose";


export interface IWorkspace extends Document{

    name:string;

    owner:mongoose.Types.ObjectId;

    members:{
        user:mongoose.Types.ObjectId;
        role:"admin"|"member";
    }[];

}



const workspaceSchema =
new Schema<IWorkspace>({

    name:{
        type:String,
        required:true
    },


    owner:{

        type:Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    members:[

        {

            user:{

                type:Schema.Types.ObjectId,

                ref:"User"

            },


            role:{

                type:String,

                enum:[
                    "admin",
                    "member"
                ],

                default:"member"

            }

        }

    ]


},
{
    timestamps:true
});



export default mongoose.model<IWorkspace>(
    "Workspace",
    workspaceSchema
);