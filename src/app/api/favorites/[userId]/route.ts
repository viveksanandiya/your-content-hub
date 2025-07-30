import dbConnect from '@/lib/db';
import Favorite from '@/model/Favorite';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  
  try{

    await dbConnect();
    const favorites = await Favorite.find({ userId: params.userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: favorites,
    });

  }catch(err){
    console.error('Error fetching favorites:', err);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch favorites data' 
    });
  }
}

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const body = await req.json();

    const existingFavorite = await Favorite.findOne({
      userId: params.userId,
      title: body.title,
      url: body.url
    });

    if(existingFavorite){
      return NextResponse.json({
        success: false,
        error: 'favorite exist'
      });
    }

    const favorite = await Favorite.create({ 
      ...body, 
      userId: params.userId 
    });

    return NextResponse.json({
      success: true,
      message: favorite
    });

  }catch(err){
    console.error('Error saving favorite:', err);
    return NextResponse.json({ 
      success: false,
      error: 'try catch error ,favorite'
    });
  }
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { contentId} = body;

    // Try to delete by contentId first, then by title and url as fallback
    let deleteQuery;
    if(contentId){
      deleteQuery = { _id: contentId, userId: params.userId };
    }
    else{
      return NextResponse.json({
        success: false,
        error: 'Content not found'
      });
    }

    const deletedFavorite = await Favorite.findOneAndDelete(deleteQuery);

    if(!deletedFavorite){
      return NextResponse.json({
        success: false,
        error: 'Favorite not found'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Favorite removed successfully'
    });

  }catch(err){
    console.error('Error removing favorite:', err);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to remove favorite try catch'
    });
  }
}