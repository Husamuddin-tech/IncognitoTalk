import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({username}).exec()

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {status: 404}
            )
        }

        // Check if user accepts messages
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages"
                }, {status: 403} // 403 Forbidden status
            )
        }

        const newMessage = {content, createdAt: new Date()}

        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
                {
                    success: true,
                    message: "Message sent successfully",
                }, {status: 200}
            )
        

    } catch (error) {
        console.log("Error adding messages", error);
        return Response.json(
            {
                success: false,
                message: "Error adding messages"
            },
            {status: 500}
        )
    }

}