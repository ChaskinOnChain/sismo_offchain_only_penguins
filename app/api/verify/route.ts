import prismadb from "@/prismadb";
import {
  AuthType,
  SismoConnect,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-server";
import { NextRequest, NextResponse } from "next/server";

const sismoConnect = SismoConnect({
  config: {
    appId: "0xbffb8652509c7e27e0b0485beade19c2",
  },
});

export async function POST(req: NextRequest) {
  const sismoConnectResponse = await req.json();
  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(
      sismoConnectResponse,
      {
        auths: [{ authType: AuthType.VAULT }],
      }
    );

    const vaultId = result.getUserId(AuthType.VAULT);

    let userPaidStatus = false;

    if (vaultId) {
      const existingUser = await prismadb.user.findFirst({
        where: { id: vaultId },
      });

      if (existingUser) {
        userPaidStatus = existingUser.paid;
      } else {
        await prismadb.user.create({
          data: {
            id: vaultId,
            paid: false,
          },
        });
      }
    } else {
      return NextResponse.json("Invalid response", { status: 400 });
    }

    return NextResponse.json(
      { userId: vaultId, paid: userPaidStatus },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
