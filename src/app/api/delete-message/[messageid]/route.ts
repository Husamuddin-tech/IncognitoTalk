import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ messageid: string }> } // App Router expects params as Promise
) {
  const { messageid } = await context.params; // unwrap the promise

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(user.id);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { messages: { _id: messageid } } },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User or message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}

























// import UserModel from '@/model/User';
// import { getServerSession } from 'next-auth/next';
// import dbConnect from '@/lib/dbConnect';
// import { User } from 'next-auth';
// import { Message } from '@/model/User';
// import { NextRequest } from 'next/server';
// import { authOptions } from '../../auth/[...nextauth]/options';

// export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
//   const messageId = params.messageid
//   await dbConnect();

//   const session = await getServerSession(authOptions);

//   const _user = session?.user as User & { _id: string };

//   if (!session || _user) {
//     return Response.json(
//       {
//         success: false,
//         message: 'Not Authenticated',
//       },
//       { status: 401 }
//     );
//   }

  
//   try {
//     const updateResult = await UserModel.updateOne(
//       {_id: _user._id},
//       {$pull: {messages: {_id: messageId}}}
//     )

//     if(updateResult.modifiedCount === 0) {
//       return Response.json(
//       {
//         success: false,
//         message: 'Message not found or already deleted',
//       },
//       { status: 404 }
//     );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: 'Message Deleted',
//       },
//       { status: 200 }
//     );

//   } catch(error) {
//     console.log("Error deleting messages", error)
//     return Response.json(
//       {
//         success: false,
//         message: 'Error deleting messages',
//       },
//       { status: 500 }
//     );
//   }
// }
