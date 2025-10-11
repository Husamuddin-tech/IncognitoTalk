import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const messages = user.messages?.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    ) || [];

    return NextResponse.json(
      { success: true, messages },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
};





///. error

// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/options';
// import { User } from 'next-auth';
// import mongoose from 'mongoose';

// export async function GET(request: Request) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);

//   const _user: User = session?.user;

//   if (!session || !_user) {
//     return Response.json(
//       {
//         success: false,
//         message: 'Not Authenticated',
//       },
//       { status: 401 }
//     );
//   }

//   const userId = new mongoose.Types.ObjectId(_user._id);

//   try {
//     const user = await UserModel.aggregate([
//       {
//         $match: {
//           _id: userId,
//         },
//       },
//       {
//         $unwind: '$messages',
//       },
//       {
//         $sort: {
//           'messages.createdAt': -1,
//         },
//       },
//       {
//         $group: {
//           _id: '$_id',
//           messages: {
//             $push: '$messages',
//           },
//         },
//       },
//     ]);

//     if (!user || user.length === 0) {
//       return Response.json(
//         {
//           success: false,
//           message: 'User not found',
//         },
//         { status: 404 }
//       );
//     }

//     return Response.json(
//       {
//         // success: true,
//         messages: user[0].messages,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Error getting messages", error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error getting messages"
//             },
//             {status: 500}
//         )
//   }
// }
