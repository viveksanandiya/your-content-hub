import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Preference from "@/model/Preference";

// GET preference
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const preference = await Preference.findOne({ userId: params.userId });

    if (!preference) {
      // Return default preferences if none exist
      return NextResponse.json({
        success: true,
        message: {
          userId: params.userId,
          category: ['news', 'technology', 'entertainment'] // Default categories
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: preference,
    });
  } catch (err) {
    console.error("Error getting preference:", err);
    return NextResponse.json({
      success: false,
      error: "Error getting preference",
    }, { status: 500 });
  }
}

//UPDATE preference
export async function POST(
  req: Request,
  { params }:{params: {userId:string}}
){

  try{
    await dbConnect();

    const body = await req.json();
    const { category} = body;

    // Validate category array
    if (!Array.isArray(category)){
      return NextResponse.json({
        success: false,
        error: "Category not found",
      });
    }

    // Valid categories
    const validCategories = ['news', 'movies', 'music', 'technology', 'sports', 'entertainment'];
    const invalidCategories = category.filter(cat => !validCategories.includes(cat));
    
    if (invalidCategories.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid no of categories',
      });
    }

    const updatedPreference = await Preference.findOneAndUpdate(
      { userId: params.userId },
      { category },
      { upsert:true, new: true}
    );

    if (!updatedPreference) {
      return NextResponse.json({
        success: false,
        error: "Error updating preference",
      });
    }

    return NextResponse.json({
      success: true,
      message: updatedPreference,
    });

  }catch(err){
    console.error("Error updating preference:", err);
    return NextResponse.json({
      success: false,
      error: "Error updating preference try catch",
    });
  }
}