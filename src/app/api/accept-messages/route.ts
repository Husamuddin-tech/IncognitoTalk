import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(session.user.id);

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
};









// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/options';
// import { User } from 'next-auth';

// export async function POST(request: Request) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);

//   const user: User = session?.user;

//   if (!session || !session.user) {
//     return Response.json(
//       {
//         success: false,
//         message: 'Not Authenticated',
//       },
//       { status: 401 }
//     );
//   }

//   const userId = user._id;
//   const { acceptMessages } = await request.json();

//   try {
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       { isAcceptingMessages: acceptMessages },
//       { new: true }
//     );
//     if (!updatedUser) {
//       // User not found
//       return Response.json(
//         {
//           success: false,
//           message: 'Failed to update user status to accept Messages',
//         },
//         { status: 404 }
//       );
//     }

//     // Successfully updated message acceptance status
//     return Response.json(
//       {
//         success: true,
//         message: 'Message Acceptance Status Updated Successfully',
//         updatedUser,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log('Failed to update user status to accept Messages', error);
//   }
//   return Response.json(
//     {
//       success: false,
//       message: 'Failed to update user status to accept Messages',
//     },
//     { status: 500 }
//   );
// }

// export async function GET(request: Request) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);
//   const user = session?.user;

//   // Check if the user is authenticated
//   if (!session || !user) {
//     return Response.json(
//       {
//         success: false,
//         message: 'Not Authenticated',
//       },
//       { status: 401 }
//     );
//   }

//   // const userId = user._id;

//   try {
//     // Retrieve the user from the database using the ID
//     const foundUser = await UserModel.findById(user._id);
//     if (!foundUser) {
//       // User not found
//       return Response.json(
//         {
//           success: false,
//           message: 'User not found',
//         },
//         { status: 404 }
//       );
//     }

//     // Return the user's message acceptance status
//     return Response.json(
//       {
//         success: true,
//         isAcceptingMessages: foundUser.isAcceptingMessages,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error retrieving message acceptance status:', error);
//     return Response.json(
//       { success: false, message: 'Error retrieving message acceptance status' },
//       { status: 500 }
//     );
//   }
// }
