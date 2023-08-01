import prismadb from "@/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const userId = await req.json();
  try {
    const user = await prismadb.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }
    await prismadb.user.update({
      where: { id: user.id },
      data: { paid: true },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(e.message, { status: 500 });
  }
}
